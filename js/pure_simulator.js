
var PS_is_launched = 0;

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
			<textarea id="PS-output" placeholder="Program output ..."></textarea>
		</div>
	`;
	PS_is_launched = 1;
}
