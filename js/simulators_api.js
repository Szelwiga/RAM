var SA_curr_sim = S_get_simulator();
var SA_time_cnt = 0;
var SA_output   = "";

function SA_init(){
	if (SA_curr_sim == "PS") PS_init();
	else                     DS_init();
}

function SA_is_launched(){
	return PS_is_launched || DS_is_launched;
}

function SA_close(){
	if (PS_is_launched) {
		document.getElementById("right-div").innerHTML = "";
		PS_is_launched = false;
	}
	if (DS_is_launched) {
		document.getElementById("right-div").innerHTML = "";
		DS_is_launched = false;
	}
}

function SA_set_counters(mem, time, ins) {
	if (SA_curr_sim == "PS") PS_set_counters(mem, time, ins);
	else                     DS_set_counters(mem, time, ins);
}
function SA_set_alu(value, error) {
	if (SA_curr_sim == "PS") PS_set_alu(value, error);
	else                     DS_set_alu(value, error);
}
function SA_set_instruction(instruction, event) {
	if (SA_curr_sim == "PS") PS_set_instruction(instruction, event);
	else                     DS_set_instruction(instruction, event);
}
function SA_set_output(text) {
	if (SA_curr_sim == "PS") PS_set_output(text);
	else                     DS_set_output(text);
}
function SA_set_memory(mem) {
	if (SA_curr_sim == "PS") PS_set_memory(mem);
	else                     DS_set_memory(mem);
}
function SA_clear() {
	if (SA_curr_sim == "PS") PS_clear();
	else                     DS_clear();
}
function SA_get_input() {
	if (SA_curr_sim == "PS") return PS_get_input();
	else                     return DS_get_input();
}
function SA_set_input(inp) {
	if (SA_curr_sim == "PS") return PS_set_input(inp);
	else                     return DS_set_input(inp);
}
function SA_set_frame_color(color) {
	if (SA_curr_sim == "PS") PS_set_frame_color(color);
	else                     DS_set_frame_color(color);
}

function SA_color_output(color) {
	if (SA_curr_sim == "PS") PS_color_output(color);
	else                     DS_color_output(color);
}

function SA_init_sim(){
	SA_clear();
	SA_set_memory(RAM.get_page_state());
	SA_time_cnt = 0;
	SA_output   = "";
}

function SA_process_step_result(event, result) {
	if (SA_curr_sim == "PS") {
		SA_time_cnt += RAM_DEFAULT_EVENTS_TIMES[event.event];

		
		var pretty_event_names = {
			"runtime_error": "runtime error",
			"get_value": "read from memory",
			"move_cache": "move cache",
			"read": "move from<br>input to memory",
			"write": "move from<br>memory to output",
			"store": "save to memory",
			"load": "read from memory",
			"add": "perform operation",
			"sub": "perform operation",
			"mult": "perform operation",
			"div": "perform operation",
			"jump": "jump",
			"checkgtz": "check condition",
			"checkzero": "check condition",
			"halt": "stop",
		}
		
		PS_set_counters(RAM.memory_counter, SA_time_cnt, RAM.instruction_counter);
		PS_set_alu(RAM.memory[0], "");
		PS_set_instruction(result.ins, pretty_event_names[event.event]);

		if (event.event == "runtime_error") {
			SA_output += "\n";
			SA_output += "Runtime error on line: " + (event.line + 1) + "\n" + event.details;
			PS_set_alu(RAM.memory[0], "ERROR");
			PS_set_output(SA_output);
			PS_color_output("var(--red)");

		} else if (event.event == "move_cache") {
			PS_set_memory(event.page_state);

		} else if (event.event == "read") {
			PS_set_memory(RAM.get_page_state());

		} else if (event.event == "write") {
			SA_output += event.value + " ";
			PS_set_output(SA_output);

		} else if (event.event == "store") {
			PS_set_memory(RAM.get_page_state());
		}

		if (event == result.events[result.events.length - 1]) {
			SA_time_cnt = RAM.time_counter;
			PS_set_counters(RAM.memory_counter, RAM.time_counter, RAM.instruction_counter);
		}
	}

}
