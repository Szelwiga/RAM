var S_editor     = "PE";    /* PE | GE */
var S_simulator  = "PS";    /* PS | DS */
var S_anim_speed = 4;       /* 0-9 */
var S_ins_limit  = 1000000; /* num */

var S_descriptions = {
	"PE": `Plain editor is dedicated for more advanced users. It is standard text editor with simple 
		syntax highlight. One can use any standard shortcuts there.`,
	"GE": `Grid editor is dedicated for new users. It helps keeping the code in proper shape.\n
		You can use <pre>ALT</pre> + <pre>3</pre> or <pre>ALT</pre> + <pre>#</pre> to comment line
		and <pre>ALT</pre> + <pre>Backspace</pre> or <pre>ALT</pre> + <pre>Delete</pre> to delete line.`,
	"PS": `Pure simulator is dedicated for more advanced useres. It provides all necessary 
		informations in compact format.`,
	"DS": `Detailed simulator is pixel art based simulator that visually executes all the instructions
		in fancy way.`,
	"AS": `Select animation speed for simulator.`,
	"IL": `Allows to specify instruction limit that is taken into account <b></b> only for maximum speed 
		runs. It's goal is to save from infinite loops.`,
}

function S_try_cookie(name, curr_value){
	if (get_cookie(name) != "") return get_cookie(name);
	else                        return curr_value;	
}

function S_init() {
	S_editor     = S_try_cookie("S_editor",     S_editor);
	S_simulator  = S_try_cookie("S_simulator",  S_simulator);
	S_anim_speed = S_try_cookie("S_anim_speed", S_anim_speed);
	S_ins_limit  = S_try_cookie("S_ins_limit",  S_ins_limit);

	RAM.instruction_limit = S_ins_limit;
	D_animation_speed_index = S_anim_speed;
}

var G_min_width_viewport = 1200;

function S_get_editor() {
	return S_editor;
}

function S_get_simulator() {
	return S_simulator;
}

function S_get_animation_speed_index() {
	return S_anim_speed;
}

var S_base_html = `
	<div id="S-frame">
		<hr>
			<div class="S-title"># Settings / Help #</div>
		<hr>
		<br>
			<div class="S-option-title">Editor</div>
			<button class="S-flip-button" id="S-editor-button" onclick="S_BTN_editor()"></button>
			<div class="S-description" id="S-editor-desc"></div>
		<hr>
		<br>
			<div class="S-option-title">Simulator</div>
			<button class="S-flip-button" id="S-simulator-button" onclick="S_BTN_simulator()"></button>
			<div class="S-description" id="S-simulator-desc"></div>
		<hr>
		<br>
			<div class="S-option-title">Animation speed</div>
			<div class="S-buttons-box" id="S-buttons-box"></div>
			<div class="S-description" id="S-anim-speed-desc"></div>
		<hr>
		<br>
			<div class="S-option-title">Instruction limit</div>
			<input type="text" id="S-ins-limit" oninput="S_BTN_ins_limit(this.value)">
			<div class="S-description" id="S-ins-limit-desc"></div>
	</div>
`;

function S_run_settings() {
	document.getElementById("right-div").innerHTML = S_base_html;

	document.getElementById("S-editor-desc").innerHTML     = S_descriptions[S_editor];
	document.getElementById("S-simulator-desc").innerHTML  = S_descriptions[S_simulator];
	document.getElementById("S-anim-speed-desc").innerHTML = S_descriptions["AS"];
	document.getElementById("S-ins-limit-desc").innerHTML  = S_descriptions["IL"];

	document.getElementById("S-editor-button").innerHTML    = S_editor;
	document.getElementById("S-simulator-button").innerHTML = S_simulator;

	var box = document.getElementById("S-buttons-box");
	for (let i = 0; i < D_animation_speed_levels; i++) {
		let btn       = document.createElement("BUTTON");
		btn.className = "S-small-btn";
		btn.id        = "S-anim-btn-" + i;
		btn.onclick = function() { S_BTN_anim_level(i) };
		box.appendChild(btn);
	}
	document.getElementById("S-anim-btn-" + S_anim_speed).style.background = "var(--yellow)";

	document.getElementById("S-ins-limit").value = S_ins_limit;
}

function S_BTN_editor() {
	S_editor = S_editor == "GE" ? "PE" : "GE";
	EA_choose_editor(S_editor);
	document.getElementById("S-editor-desc").innerHTML   = S_descriptions[S_editor];
	document.getElementById("S-editor-button").innerHTML = S_editor;
}

function S_BTN_anim_level(x){
	for (let i = 0; i < D_animation_speed_levels; i++)
		document.getElementById("S-anim-btn-" + i).style.background = "var(--black)";
	document.getElementById("S-anim-btn-" + x).style.background = "var(--yellow)";

	S_anim_speed = x;
	D_animation_speed_index = S_anim_speed;
}

function S_BTN_ins_limit(x){
	if (!isNaN(x+"")) {
		document.getElementById("S-ins-limit").style.background = "var(--black)";
		S_ins_limit = parseInt(x);
		RAM.instruction_limit = S_ins_limit;
	} else {
		document.getElementById("S-ins-limit").style.background = "var(--dark_red)";
	}
	
}
function S_BTN_simulator() {
	S_simulator = S_simulator == "DS" ? "PS" : "DS";
	document.getElementById("S-simulator-desc").innerHTML   = S_descriptions[S_simulator];
	document.getElementById("S-simulator-button").innerHTML = S_simulator;
	SA_curr_sim = S_simulator;
}

window.onload = function() {
    window.addEventListener("beforeunload", function (e) {

		set_cookie("S_editor",     S_editor);
		set_cookie("S_simulator",  S_simulator);
		set_cookie("S_anim_speed", S_anim_speed);
		set_cookie("S_ins_limit",  S_ins_limit);

		EA_cook_ie_codes();

		if (D_state == "settings" || D_state == "levels") {
			set_cookie("D_input", EA_code_compress(D_input_cache));
		} else {
			set_cookie("D_input", EA_code_compress(SA_get_input()));
		}

		var confirmationMessage = 'Open codes will disappear after this action.';
		(e || window.event).returnValue = confirmationMessage;
		return confirmationMessage;
	});
};
