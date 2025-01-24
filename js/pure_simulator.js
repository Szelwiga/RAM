/*
	Author:            Marcel Szelwiga
	Implemented here:  Backend for pure simulator
*/

var PS_is_launched = 0; /* checks if simulator is present on screen */
var PS_current_mem; /* remembers memory state */

/* color text fragment */
function PS_color(text, color) {
	 return "<span style=\"color:var(" + color + ");display:inline;\">" + text + "</span>";
}

/* set counters time / memory / instruction */
function PS_set_counters(mem, time, ins) {
	var text = "<pre>";
	if (window.innerWidth >= G_min_width_viewport) {
		text += "Counters         <br>"
		text += "Instructions: " + ins + "<br>";
		text += "Time:         " + time + "<br>";
		text += "Memory:       " + mem + "<br>";
		text += "</pre>";
	} else {
		var line1 = "Counters  "
		var line2 = "Time: " + time + "  ";

		while (line2.length < line1.length) line2 += " ";
		while (line2.length > line1.length) line1 += " ";

		line1 += "Instructions: " + ins + "<br>";
		line2 += "Memory:       " + mem + "<br>";
		text += line1 + line2 + "</pre>";
	}
	text = text.replaceAll("Counters", PS_color("<b>Counters</b>", "--light_purple"));
	document.getElementById("PS-counters").innerHTML = text;
}

/* sets accumulator value (and optionaly reports error) */
function PS_set_alu(value, error) {
	if (value == undefined) value = "?";
	text = "<pre>";
	text += "Accumulator   <br>";
	text += "Value: " + value + "<br>";
	if (error)
		text += PS_color("ERROR", "--red");
	text += "</pre>";
	text = text.replaceAll("Accumulator", PS_color("<b>Accumulator</b>", "--light_orange"));
	document.getElementById("PS-alu").innerHTML = text;
}

/* sets instruction and event frame */
function PS_set_instruction(instruction, event) {

	var style = [
		["read", "--blue"],
		["write", "--blue"],

		["load", "--yellow"],
		["store", "--yellow"],

		["add", "--green"],
		["sub", "--green"],
		["mult", "--green"],
		["div", "--green"],

		["jump", "--red"],
		["jgtz", "--red"],
		["jzero", "--red"],

		["halt", "--orange"]
	];

	for (var i of style)
		instruction = instruction.replaceAll(i[0], PS_color(i[0], i[1]));

	var text = "<pre>";
	text += "Instruction         <br>";
	text += instruction + "<br>";
	if (event) text += "(" + event + ")";
	else       text += "<br>"
	text += "</pre>";

	text = text.replaceAll("Instruction", PS_color("<b>Instruction</b>", "--light_red"));

	document.getElementById("PS-instruction").innerHTML = text;
}

/* sets output */
function PS_set_output(text) {
	document.getElementById("PS-output").value = text;
}

/* sets memory */
function PS_set_memory(mem) {
	var cell_box = document.getElementById("PS-memory-cells-box");
	PS_current_mem = [...mem];
	for (var mem_cell of cell_box.children) {

		let M = mem.shift();
		var new_value;

		if (M[1] != undefined) new_value = M[0] + ": " + M[1];
		else                   new_value = M[0] + ": ?";

		if (mem_cell.innerHTML != new_value) {
			mem_cell.innerHTML = new_value;
			mem_cell.id = "PS-memory-cell-" + M[0];
			PS_highlight_cell(M[0], "var(--green)");
		}
	}
}

/* highlights memeory cell (when simulation touches it) */
async function PS_highlight_cell(x, color) {
	var E = document.getElementById("PS-memory-cell-" + x);

	E.style.background = color;
	await new Promise(r => setTimeout(r, 200));
	E.style.background = "var(--black)";
}

/* resets state of PS */
function PS_clear() {
	PS_set_counters(0, 0, 0);
	PS_set_alu(0, "");
	PS_set_instruction("", "");
	PS_set_output("");

	var cell_box = document.getElementById("PS-memory-cells-box");
	cell_box.innerHTML = "";

	for (var i = 1; i <= RAM.cache_size; i++) {
		var cell = document.createElement("PRE");
		cell.innerHTML = i + ": ?";

		cell.className = "PS-memory-cell";
		cell.id = "PS-memory-cell-" + i;
 
		cell_box.appendChild(cell);
	}
	
	var mem = [];
	for (var i = 1; i <= RAM.cache_size; i++)
		mem.push([i, undefined]);
	PS_current_mem = mem;
}

/* gets / sets input */
function PS_get_input() {
	return document.getElementById("PS-input").value;
}
function PS_set_input(inp) {
	return document.getElementById("PS-input").value = inp;
}

/* crates PS html on page */
function PS_init(){
	var elem = document.getElementById("right-div");
	elem.innerHTML = `
		<div class="PS-frame" id="PS-frame">
			<textarea id="PS-input" placeholder="Program input ..."></textarea>
			<hr>
			<div class="PS-triple">
				<div class="PS-counters" id="PS-counters"></div>
				<div class="PS-alu" id="PS-alu"></div>
				<div class="PS-instruction" id="PS-instruction"></div>
			</div>
			<hr>
			<div class="PS-memory" id="PS-memory">
				<button id="PS-memory-left" onclick="D_req_cache_prev_page()">&lt;</button>
				<div class="PS-memory-cells-box" id="PS-memory-cells-box"></div>
				<button id="PS-memory-right" onclick="D_req_cache_next_page()">&gt;</button>
			</div>
			<hr>
			<textarea id="PS-output" placeholder="Program output ..." readonly></textarea>
		</div>
	`;
	PS_is_launched = 1;
	DS_is_launched = 0;

	PS_clear();
}


/* colors frame / output */
function PS_set_frame_color(color) {
	document.getElementById("PS-frame").style.borderColor = color;
}
function PS_color_output(color) {
	document.getElementById("PS-output").style.borderColor = color;
	document.getElementById("PS-output").style.color       = color;
}
