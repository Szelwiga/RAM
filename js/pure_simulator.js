var PS_is_launched = 0;

function PS_color(text, color) {
	 return "<span style=\"color:var(" + color + ");display:inline;\">" + text + "</span>";
}

function PS_set_counters(mem, time, ins) {
	var text = "<pre>";
	if (window.innerWidth >= G_min_width_viewport) {
		text += "Counters<br>"
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

function PS_set_alu(value, state, error) {
	text = "<pre>";
	if (window.innerWidth >= G_min_width_viewport) {
		text += "Accumulator<br>";
		text += "Value: " + value + "<br>";
		text += "State: " + state + "<br>";
		if (error != "" && error != undefined)
			text += "Error: " + error;
		else
			text += "<br>";
		text += "</pre>";
	} else {
		var line1 = "Accumulator  ";
		var line2 = "State: " + state + "  ";

		while (line2.length < line1.length) line2 += " ";
		while (line2.length > line1.length) line1 += " ";

		line1 += "Value: " + value + "<br>";
		if (error != "" && error != undefined)
			line2 += "Error: " + error;

		text += line1 + line2 + "</pre>";
	}
	text = text.replaceAll("Accumulator", PS_color("<b>Accumulator</b>", "--light_orange"));
	document.getElementById("PS-alu").innerHTML = text;
}

function PS_set_instruction(instruction, event) {

	var text = "<pre>";
	text += "Instruction <br>";
	text += instruction + "<br>";
	if (event != "" && event != undefined)
		text += "Event: " + event + "<br><br>";
	else
		text += "<br><br>"
	text += "</pre>";

	text = text.replaceAll("Instruction", PS_color("<b>Instruction</b>", "--light_red"));
	document.getElementById("PS-instruction").innerHTML = text;
}

function PS_set_output(text) {
	document.getElementById("PS-output").value = text;
}

function PS_set_memory(mem) {
	var cell_box = document.getElementById("PS-memory-cells-box");
	for (var mem_cell of mem) {
		var cell = document.createElement("PRE");

		if (mem_cell[1] != undefined) cell.innerHTML = mem_cell[0] + ": " + mem_cell[1];
		else                          cell.innerHTML = mem_cell[0] + ": ?";
		cell.className = "PS-memory-cell"

		cell_box.appendChild(cell);
	}
}

function PS_clear() {
	PS_set_counters(0, 0, 0);
	PS_set_alu(0, "inactive", "");
	PS_set_instruction("", "");
	PS_set_output("");

	var mem = [];
	for (var i = 1; i <= RAM_DEFAULT_CACHE_SIZE; i++)
		mem.push([i, undefined]);
	PS_set_memory(mem);
	
}

function PS_get_input() {
	return document.getElementById("PS-input").value;
}

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
	PS_clear();
}
