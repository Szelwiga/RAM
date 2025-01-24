/*
	Author:            Marcel Szelwiga
	Implemented here:  RAM Machine interpreter in JavaScript
*/
const RAM_DEFAULT_CACHE_SIZE = 10n;
const RAM_DEFAULT_EVENTS_TIMES = {
	"runtime_error": 2,
	"get_value": 1,
	"move_cache": 3,
	"read": 5,
	"write": 5,
	"store": 1,
	"load": 1,
	"add": 1,
	"sub": 1,
	"mult": 2,
	"div": 4,
	"jump": 2,
	"checkgtz": 1,
	"checkzero": 1,
	"halt": 1,
};
class ram_machine {
	/*
		# variables #

			code       -- instructions array
			next_line  -- next non-empty line number array
			jumps      -- label to line number map
			entry      -- line number with first valid instruction

			memory     -- memory state
			ip         -- instruction_pointer
			cache_p    -- current cache pointer

			input      -- input for program
			input_p    -- input pointer
			output     -- produced output

			event_times  -- time it takes for each operation to complete
			cache_size   -- cache size
			
		# constants and settings #
		
			memory_limit         -- max instruction cell
			instruction_limit    -- intruction count limit
			time_limit           -- instruction by time limit 

			variable_type   -- either BigInt or 64bit
			zero_fill       -- should fill empty cells with zeros?

			instruction_times -- times it takes for each instruction to execute

		# counters #

			instruction_counter  -- instruction count during execution
			time_counter         -- time counsed during execution
			memory_counter       -- max cell number used during exection

		# outside functions #

			parse_code   -- parses code
			clear_state  -- clears memory and resets counters
			set_input    -- set input
			get_output   -- get produced output
			run_one_step -- runs one step and returns what happend
			run_checks   -- checks if code will end in specified amount of time
			run_full     -- runs code and produces output

		# inside functions #

			get_value       -- returns the value from cell
			adjust_cache    -- resolves_addr
			get_page_state  -- returns cache state
			resolve_addr    -- resolves addres (for store and read)
			resolve_value   -- resolves values for other instructions
					
		# parse_code output #

			{status: "ok"/"pe", line_number: xxx, description: sss}

		# run_one_step #

			{status: "ok/re/done", events: [...]}
	*/

	constructor(){
		this.memory_limit      = Infinity;
		this.instruction_limit = Infinity;
		this.time_limit        = Infinity;

		this.variable_type = "BigInt";
		this.zero_fill     = false;

		this.instruction_counter = 0;
		this.time_counter        = 0;
		this.memory_counter      = 0;

		this.input  = [];
		this.output = [];

		this.cache_size  = BigInt(RAM_DEFAULT_CACHE_SIZE);
		this.event_times = RAM_DEFAULT_EVENTS_TIMES;


		this.clear_state();
	}

	clear_state(){
		this.ip       = this.entry;
		this.memory   = [];
		this.input_p  = 0;
		this.output   = [];
		this.cache_p  = 1n;

		this.instruction_counter = 0;
		this.time_counter        = 0;
		this.memory_counter      = 0;
	}
	
	int64orBigInt(x){
		/* TODO int64_t */
		/* emulation of 64 bit variables with sign */
		if (this.variable_type == "BigInt")
			return x;
		else
			return x%(1n<<63n);
	}

	get_value(x){
		/* returns content of given cell */
		return this.memory[x] == undefined ? (this.zero_fill ? 0 : undefined) : this.memory[x];
	}

	get_page_state(x){
		/* returns current cache state */
		var P = BigInt(this.cache_p);
		if (x != undefined)
			P = (x - (x-1n)%this.cache_size);

		var res = [];
		for (var i=P; i<P + this.cache_size; i++){
			res.push([i, this.get_value(i)]);
		}
		return res;
	}
	
	adjust_cache(x){
		/* adjust the cache and returns it's new state in case of change */
		if (x == 0 || (this.cache_p <= x && x < this.cache_p + this.cache_size)){
			return [];
		} else {
			this.cache_p = (x - (x-1n)%this.cache_size);
			return [{event: "move_cache", page_state: this.get_page_state()}];
		}
	}

	resolve_addr(x){
		/* resolves address */
		if (x[0] == '='){
			/* =xxx is not a valid address */
			return {result: undefined, events: [{event: "runtime_error", details: "this should not happend please report bug"}]};
		} else if (x[0] == '^'){
			/* ^xxx adjust cache and read the content of memory */
			var cell = BigInt(x.substr(1, x.length-1));
			var events = this.adjust_cache(cell);

			this.memory_counter = this.memory_counter > cell ? this.memory_counter : cell;

			events.push({event: "get_value", from: cell});
			if (this.get_value(cell) == undefined){
				events.push({event: "runtime_error", details: "read from undefined cell"})
				return {result: undefined, events: events};
			} else {
				return {result: this.get_value(cell), events: events};
			}
		} else {
			/* there is no need to resolve address */
			return {result: BigInt(x), events: []};
		}
	}
	
	resolve_value(x){
		/* resolves value from instruction argument */
		if (x[0] == '='){
			/* the value is hidden in the instruction */
			return {result: BigInt(x.substr(1, x.length-1)), events: []};
		}
		
		/* resolve the address at first */
		var addr = this.resolve_addr(x);
		if (addr.result == undefined)
			return addr;
		var events = addr.events;
		var cell   = addr.result;

		this.memory_counter = this.memory_counter > cell ? this.memory_counter : cell;

		/* adjust cache and read memory content */
		for (var e of this.adjust_cache(cell))	events.push(e);
		events.push({event: "get_value", from: cell});
		var value = this.get_value(cell);
		if (value == undefined) {
			events.push({event: "runtime_error", details: "read undefined value"})
			return {result: undefined, events: events};
		} else {
			return {result: value, events: events};
		}
	}

	update_time_counter(events){
		/* update global counter */
		for (var event of events)
			this.time_counter += this.event_times[event.event];
	}

	run_one_step(){
		/* runs one step of simulation and returns what happend */
		if (this.code[this.ip] == undefined || this.code[this.ip][0] == undefined){
			var events = [{event: "halt"}];
			return {status: "done", events: events, ins: ""};
		}

		var events      = [];
		var instruction = this.code[this.ip][0];
		var argument    = this.code[this.ip][1];
		var line        = instruction + " " + argument;
		var curr_line   = this.ip;

		this.instruction_counter++;
		if (instruction == "read") {
			/* the read instruction */
			var res = this.resolve_addr(argument);
			if (res.result == undefined){
				return {status: "re", events: res.events, ins: line, line: curr_line};
			}
			if (this.input_p == this.input.length){
				res.events.push({event: "runtime_error", details: "attempting to read with empty input", line: curr_line});
				return {status: "re", events: res.events, ins: line, line: curr_line};
			}

			for (var e of this.adjust_cache(res.result))	res.events.push(e);

			this.memory[res.result] = this.int64orBigInt(this.input[this.input_p++]);
			this.memory_counter = this.memory_counter > res.result ? this.memory_counter : res.result;

			res.events.push({event: "read", to: res.result, value: this.memory[res.result]});

			this.ip = this.next_line[this.ip];
			this.update_time_counter(res.events);
			return {status: "ok", events: res.events, ins: line, line: curr_line};
			
		} else if (instruction == "write"){
			/* the write instruction */
			var res = this.resolve_value(argument);
			if (res.result == undefined){
				return {status: "re", events: res.events, ins: line, line: curr_line};
			}

			this.output.push(res.result);
			res.events.push({event: "write", value: res.result});

			this.ip = this.next_line[this.ip];
			this.update_time_counter(res.events);
			return {status: "ok", events: res.events, ins: line, line: curr_line};
			
		} else if (instruction == "load"){
			/* the load instruction */
			var res = this.resolve_value(argument);
			if (res.result == undefined){
				return {status: "re", events: res.events, ins: line, line: curr_line};
			}

			this.memory[0] = this.int64orBigInt(res.result);
			res.events.push({event: "load", value: res.result});

			this.ip = this.next_line[this.ip];
			this.update_time_counter(res.events);
			return {status: "ok", events: res.events, ins: line, line: curr_line};
			
		} else if (instruction == "store"){
			/* the store instruction */
			var res = this.resolve_addr(argument);
			if (res.result == undefined){
				return {status: "re", events: res.events, ins: line, line: curr_line};
			}

			for (var e of this.adjust_cache(res.result))	res.events.push(e);

			this.memory[res.result] = this.memory[0];
			this.memory_counter = this.memory_counter > res.result ? this.memory_counter : res.result;

			res.events.push({event: "store", value: this.memory[0], to: res.result});

			this.ip = this.next_line[this.ip];
			this.update_time_counter(res.events);
			return {status: "ok", events: res.events, ins: line, line: curr_line};
						
		} else if (instruction == "add"  || instruction == "sub" || 
		           instruction == "mult" || instruction == "div"){
			/* the alu instructions */
			var res = this.resolve_value(argument);
			if (res.result == undefined){
				return {status: "re", events: res.events, ins: line, line: curr_line};
			}
			if (instruction == "add"){
				this.memory[0] = this.int64orBigInt(this.memory[0] + res.result);
				res.events.push({event: "add",  value: res.result, new_value: this.memory[0]});

			} else if (instruction == "sub"){
				this.memory[0] = this.int64orBigInt(this.memory[0] - res.result);
				res.events.push({event: "sub",  value: res.result, new_value: this.memory[0]});

			} else if (instruction == "mult"){
				this.memory[0] = this.int64orBigInt(this.memory[0] * res.result);
				res.events.push({event: "mult", value: res.result, new_value: this.memory[0]});

			} else if (instruction == "div"){
				if (res.result == 0n) {
					res.events.push({event: "runtime_error", details: "division by zero"})
					return {status: "re", events: res.events, ins: line, line: curr_line};
				}
				this.memory[0] = this.int64orBigInt(this.memory[0] / res.result);
				res.events.push({event: "div",  value: res.result, new_value: this.memory[0]});
			}
			
			this.ip = this.next_line[this.ip];
			this.update_time_counter(res.events);
			return {status: "ok", events: res.events, ins: line, line: curr_line};
			
		} else if (instruction == "jump" || instruction == "jzero" || instruction == "jgtz"){
			/* the jumps instructions */
			var jump = 0;
			var events = [];
			if (instruction == "jump"){
				jump = 1;
				
			} else if (instruction == "jgtz") {
				jump = this.memory[0] > 0;
				events.push({event: "checkgtz", result: jump});
				
			} else if (instruction == "jzero") {
				jump = this.memory[0] == 0;
				events.push({event: "checkzero", result: jump});
			}
			if (jump) {
				this.ip = this.jumps[argument];
				events.push({event: "jump", label: argument});
			} else {
				this.ip = this.next_line[this.ip];
			}
			this.update_time_counter(events);
			return {status: "ok", events: events, ins: line, line: curr_line};
			
		} else if (instruction == "halt"){
			var events = [{event: "halt"}];
			return {status: "done", events: events, ins: line, line: curr_line};
		}
		
	}

	run_full(extra_time_limit){
		do {
			var status = this.run_one_step();
			if (this.time_counter > this.time_limit)
				return {status: "timeout"};

			if (this.time_counter > extra_time_limit)
				return {status: "timeout_extra"};

			if (this.instruction_counter > this.instruction_limit)
				return {status: "insout"};

			if (this.memory_counter > this.memory_limit)
				return {status: "memout"};

			if (status.status == "re")
				return {status: "re", details: status.events[status.events.length-1]};

//			console.log(status);
//			for (var e of status.events)
//				if (e.event == "move_cache")
//					console.log(e.page_state);

		} while (status.status == "ok");

		return {status: "ok"};
	}

	set_input(s){
		/* parses the input to BigInts */
		var separators = {' ': 1, '\t': 1, '\r': 1, '\n': 1};
		var current = "";
		s += ' ';
		this.input = [];
		for (var c of s){
			if (separators[c] == 1){
				var x, fail = 0;
				try {
					x = BigInt(current);
					if (current == "")
						fail = true;
				} catch(e) {
					for (var cc of current)
						this.input.push(BigInt(cc.charCodeAt(0)));
					this.input.push(BigInt(0));
					fail = 1;
				}
				if (!fail)
					this.input.push(x);
				current = "";
			} else {
				current += c;
			}
		}
	}	
	
	get_output(){
		var result = ""
		for (var i of this.output)
			result += i + " ";;
		return result;
	}
	
	parse_code(code){
		/* split the code to lines */
		var lines = code.split('\n');


		/* truncate comments */
		for (var i=0; i<lines.length; i++){
			lines[i] = ((line) => {

				var result = "";
				for (var i=0; i<line.length; i++){
					if (line[i] == '#')
						break;
					result += line[i];
				}
				return result;
				
			})(lines[i]);
		}
		

		/* prepare valid chars */
		var valid_chars = {};
		for (var c=0; c<26; c++)        valid_chars[String.fromCharCode(c+97)] = 1;
		for (var c=0; c<26; c++)        valid_chars[String.fromCharCode(c+65)] = 1;
		for (var c='0'; c<='9'; c++)    valid_chars[c] = 1;

		valid_chars['^'] = 1;
		valid_chars['='] = 1;
		valid_chars['-'] = 1;
		valid_chars[':'] = 1;

		valid_chars[' '] = 1;
		valid_chars['\t'] = 1;
		valid_chars['\r'] = 1;

		/* check if invalid chars occur in code */
		for (var i=0; i<lines.length; i++){
			for (var j=0; j<lines[i].length; j++){
				if (valid_chars[lines[i][j]] != 1)
					return {
						status:      "pe",
						line_number: i,
						description: "Invalid character: " + lines[i][j]
					};
			}
		}


		/* prepare separators */
		var separators = {};
		separators[' '] = 1;
		separators['\t'] = 1;
		separators['\r'] = 1;
		
		
		/* tokenize each line */
		for (var i=0; i<lines.length; i++){
			
			lines[i] = ((line) => {
				var result = [];
				var current = "";
				line += ' ';

				for (var i=0; i<line.length; i++){
					if (separators[line[i]] == 1) {
						if (current != "") result.push(current);
						current = "";
					} else {
						current += line[i];
					}
				}
				return result;

			})(lines[i]);

		}


		/* parse labels */
		this.jumps = {};

		var labels = {};
		var label_end_char = ':';
		for (var i=0; i<lines.length; i++){

			var tokens = lines[i];
			if (tokens.length == 0) continue;
			if (tokens[0][tokens[0].length-1] == label_end_char){
				var label = tokens[0].substr(0, tokens[0].length - 1);
				if (labels[label] == 1){
					return {
						status: "pe",
						line_number: i,
						description: "Multiple occurrences of the same label: " + label
					};
				} else {
					labels[label] = 1;
					this.jumps[label] = i;
					lines[i].shift();
				}
			}

			for (var token of tokens){
				if (token.search(':') != '-1'){
					return {
						status: "pe",
						line_number: i,
						description: "Unexpected : in token: " + token
					};
				}
			}

		}


		/* find next non empty line for each line */
		this.next_line = [];
		var next = lines.length;
		for (var i=lines.length-1; i>=0; i--){
			this.next_line[i] = next;
			if (lines[i].length != 0)
				next = i;
		}


		/* fix jumps so that they don't point to empty line */
		for (var label in labels){
			if (lines[this.jumps[label]].length == 0)
				this.jumps[label] = this.next_line[this.jumps[label]];
		}

		
		/* check if instructions are correct */
		var flag_argument = 1<<0; /* check if the command takes any arguemnts */
		var flag_number   = 1<<1; /* number argument flag */ 
		var flag_address  = 1<<2; /* ^number argument flag */ 
		var flag_constant = 1<<3; /* =number argument flag */ 
		var flag_label    = 1<<4; /* label argument flag */ 

		var instructions = {
			"read":  flag_argument | flag_number | flag_address,
			"write": flag_argument | flag_number | flag_address | flag_constant,

			"load":  flag_argument | flag_number | flag_address | flag_constant,
			"store": flag_argument | flag_number | flag_address,

			"add":   flag_argument | flag_number | flag_address | flag_constant,
			"mult":  flag_argument | flag_number | flag_address | flag_constant,
			"sub":   flag_argument | flag_number | flag_address | flag_constant,
			"div":   flag_argument | flag_number | flag_address | flag_constant,

			"jump":  flag_argument | flag_label,
			"jgtz":  flag_argument | flag_label,
			"jzero": flag_argument | flag_label,

			"halt":  0
		};

		for (var i=0; i<lines.length; i++){
			var line = lines[i];
			if (line.length == 0)	continue;
			var instruction = line[0];
			var flags = instructions[instruction];

			/* check if such instruction exists */
			if (!instructions.hasOwnProperty(instruction)){
				return {
					status: "pe",
					line_number: i,
					description: "Unkown instruction: " + instruction
				};
			}

			/* check if it has proper count of arguments */
			if (line.length > 1 + (flags&flag_argument ? 1 : 0)){
				return {
					status: "pe",
					line_number: i,
					description: "Too many arugments for instruction: " + instruction
				};
			}

			if ((flag_argument&flags) && line.length != 2){
				return {
					status: "pe",
					line_number: i,
					description: "Instruction " + instruction + " expects argument"
				};				
			}

			/* skip if instruction doesn't take any arguments */
			if (!(flag_argument&flags))
				continue;

			/* some helper functions */
			var is_number = ((s) => {
				for (var i of s)
					if (!('0' <= i && i <= '9') && i != '-')
						return false;
				return true;
			});
			var is_constant = (s) => {
				return s[0] == '=' && is_number(s.substr(1, s.length-1));
		};
			var is_address = (s) => {
				return s[0] == '^' && is_number(s.substr(1, s.length-1));
			};

			var has_number   = is_number(line[1]);
			var has_constant = is_constant(line[1]);
			var has_address  = is_address(line[1]);
			
			/* check if argument is proper */
			if (flags&flag_label){
				if (labels[line[1]] != 1){
					return {
						status: "pe",
						line_number: i,
						description: "Label " + line[1] + " occurs as argument, but is not declared"
					};				
				}
			} else {

				var pe = {
					status: "pe",
					line_number: i,
					description: "Argument " + line[1] + " is not valid for instruction " + line[0]
				};				

				if (has_number) {
					if (!(flags&flag_number))   return pe;
				} else if (has_constant) {
					if (!(flags&flag_constant)) return pe;
				} else if (has_address) {
					if (!(flags&flag_address))  return pe;
				} else {
					return pe;
				}
			}
		}


		/* set code to parsed lines and proper entry point */
		this.code = lines;
		this.entry = lines[0].length == 0 ? this.next_line[0] : 0;

		return {status: "ok"};
	}
}

/* TESTS */

/*
var RAM = new ram_machine();

var code1 = `
	read 0
	read 1
	read 2 # comment
	write 2
	write 1#anothercomment!@#***ąę
	# ...
	write 0
`;

console.log("Test 1");
console.log(RAM.parse_code(code1));
RAM.clear_state();
RAM.set_input("3 2 1")
console.log(RAM.code)
console.log(RAM.next_line)
do {
	var status = RAM.run_one_step();
	console.log("status: ", status);
} while (status.status == "ok");

console.log(RAM.get_output())
console.log("")

var code2 = `
		load =0
		store 1
loop:
		read 0
		jzero end
		load 1
		add =1
		store 1
		jump loop
end:	write 1
		halt
`;

console.log("Test 2");
console.log(RAM.parse_code(code2));
console.log("")

RAM.clear_state();
RAM.set_input("3 2 1 0")
console.log(RAM.code)
console.log(RAM.next_line)
do {
	var status = RAM.run_one_step();
	console.log("status: ", status);
} while (status.status == "ok");

console.log(RAM.run_full(Infinity))
console.log(RAM.get_output())
console.log("")

console.log("instructions: ", RAM.instruction_counter);
console.log("max memory:   ", RAM.memory_counter);
console.log("time counter: ", RAM.time_counter);


var code3 = `           read  1         #a
           read  2
           load  =0
           store 13
           load  =500
           store 10
           load  =1
           store 9
potega2:   load  9
           mult  =2
           store 9
           load  10
           sub   =1
           store 10
           jgtz  potega2
           load  =500
           store 10
petla2:    load  2
           sub   9
           jgtz  binarny
           jzero binarny
petla22:   load  9
           div   =2
           store 9
           load  10
           sub   =1
           store 10
           jzero petla2
           jgtz  petla2
           jump  koniec2
binarny:   store 2
           load  10
           store 11
           load  =1
           store 12
binarny10: load  11
           jzero koniec10
           sub   =1
           store 11
           load  12
           mult  =10
           store 12
           jump  binarny10
koniec10:  load  12
           add   13
           store 13
           jump  petla22
koniec2:   read  3         #c
           load  =1
           store 9         #potega liczona
           store 10        #potegi a
           load  13
           jzero konieclol #czy b == 0
           load  10
           mult  1         #a^1
           store 10
           div   3
           mult  3
           sub   10
           mult  =-1
           store 10        #a % c
           load  13
           div   =10
           mult  =10
           sub   13
           jzero dalejmno
           load  9         #zapis binarny - 1 (jest)
           mult  10
           store 9
           div   3
           mult  3
           sub   9
           mult  =-1
           store 9
dalejmno:  load  13
           div   =10
           jzero konieclol
           store 13
           load  10
           mult  10        #potegowanie poteg a
           store 10
           div   3
           mult  3
           sub   10
           mult  =-1
           store 10        #a % c
           load  13
           div   =10
           mult  =10
           sub   13
           jzero dalejmno
           load  9         #zapis binarny - 1 (jest)
           mult  10
           store 9
           div   3
           mult  3
           sub   9
           mult  =-1
           store 9
           jump  dalejmno
konieclol: write 9`;

var code4 = `
	read 1
	load =0
	store 2

loop1:	
	load 2
	sub 1	
	jzero loop2

		load 2
		add =10

		store 3
		read ^3

		load 2
		add =1
		store 2
	
	jump loop1
	
loop2:

	load 2
	jzero end

		load 2
		sub =1
		store 2

		load 2
		add =10
		store 3
		write ^3


	jump loop2
end:

`;

console.log(RAM.parse_code(code4));
console.log(RAM.clear_state());
console.log(RAM.set_input("5 1 2 3 4 5"));
console.log(RAM.run_full());
console.log(RAM.get_output())

console.log("instructions: ", RAM.instruction_counter);
console.log("max memory:   ", RAM.memory_counter);
console.log("time counter: ", RAM.time_counter);
*/
