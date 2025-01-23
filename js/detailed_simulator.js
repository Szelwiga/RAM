var DS_is_launched = 0;
var DS_canvas;
var DS_ctx;

function DS_init(){
	document.getElementById("right-div").innerHTML = `
		<div id="DS-frame">
			<div class="DS-inout-wrap">
				<textarea id="DS-input" placeholder="Program input ..."></textarea>
				<textarea id="DS-output" placeholder="Program output ..." readonly></textarea>
			</div>
			<hr>
			<canvas id="DS-canvas"></canvas>
		</div>
	`;

	DS_canvas = document.getElementById("DS-canvas");
	DS_ctx = DS_canvas.getContext("2d");

	DS_is_launched = 1;
	PS_is_launched = 0;
}
function DS_dummy_event_play(e) {

	DS_canvas.width  = DS_canvas.offsetWidth;
	DS_canvas.height = DS_canvas.offsetHeight;

	DS_ctx.font = "40px Arial";
	DS_ctx.fillText(e, 10, 80);
}

function DS_get_input() {
	return document.getElementById("DS-input").value;
}
function DS_set_output(out) {
	return document.getElementById("DS-output").value = out;
}
function DS_set_input(inp) {
	return document.getElementById("DS-input").value = inp;
}

function DS_color_output(color) {
	document.getElementById("DS-output").style.borderColor = color;
	document.getElementById("DS-output").style.color       = color;
}

function DS_set_counters(mem, time, ins) {
	N_notify("Not implemented!");
}
function DS_set_alu(value, state, error) {
	N_notify("Not implemented!");
}
function DS_set_instruction(instruction, event) {
	N_notify("Not implemented!");
}

function DS_set_memory(mem) {
	N_notify("Not implemented!");
}
function DS_clear() {
	N_notify("Not implemented!");
}
function DS_set_frame_color(color) {
	N_notify("Not implemented!");
	document.getElementById("DS-frame").style.borderColor = color;
}
