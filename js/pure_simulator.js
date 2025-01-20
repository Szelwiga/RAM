var PS_is_launched = 0;

function PS_color(text, color) {
	 return "<span style=\"color:var(" + color + ");display:inline;\">" + text + "</span>";
}

function PS_counters(mem, time, ins) {
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
	return text;
}

function PS_alu(value, state, error) {
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
	return text;
}

function PS_instruction(instruction, event) {

	var text = "<pre>";
	text += "Instruction <br>";
	text += instruction + "<br>";
	if (event != "" && event != undefined)
		text += "Event: " + event + "<br><br>";
	else
		text += "<br><br>"
	text += "</pre>";

	text = text.replaceAll("Instruction", PS_color("<b>Instruction</b>", "--light_red"));
	return text;
}
function PS_clear(){
	document.getElementById("PS-counters").innerHTML    = PS_counters(0, 0, 0);
	document.getElementById("PS-alu").innerHTML         = PS_alu(0, "inactive", "");
	document.getElementById("PS-instruction").innerHTML = PS_instruction("", "");
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
			<div class="PS-memory" id="PS-memory"> </div>
			<hr>
			<textarea id="PS-output" placeholder="Program output ..." readonly></textarea>
		</div>
	`;
	PS_is_launched = 1;
	PS_clear();
}

function PS_update_state() {

}
