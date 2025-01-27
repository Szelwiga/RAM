/*
	Author:            Marcel Szelwiga
	Implemented here:  Settings backend; and main cookies management
*/

/* global constant adjustable for internal purposes */
var G_min_width_viewport = 1200;

var S_editor     = "GE";    /* PE | GE */ /* default editor */
var S_simulator  = "DS";    /* PS | DS */ /* default simulator */
var S_anim_speed = 6;       /* 0-9 */ /* default animation speed */
var S_ins_limit  = 1000000; /* num */ /* default instruction limit */
var S_show_help  = "YES";   /* YES | NO */ /* should blue help messages be present? */
var S_lang       = "PL";    /* PL | EN */ /* default language for RAM */

/* detailed descriptions */
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
	"AS": `Select animation speed for simulator. Note that it also affects speed of one step clicks as
		one instruction may be composed out of multiple events.`,
	"IL": `Allows to specify instruction limit that is taken into account <b></b> only for maximum speed
		runs. It's goal is to save from infinite loops.`,
	"NS": `Allows to select whether help (blue) notifications should be active.`,
	"LN": `Allows to select if problem descriptions should be written in english or in polish.`,
}

/* helper function for reading cookie value */
function S_try_cookie(name, curr_value){
	if (get_cookie(name) != "") return get_cookie(name);
	else                        return curr_value;
}

/* read cookies and set limits */
function S_init() {
	S_editor     = S_try_cookie("S_editor",     S_editor);
	S_simulator  = S_try_cookie("S_simulator",  S_simulator);
	S_anim_speed = S_try_cookie("S_anim_speed", S_anim_speed);
	S_ins_limit  = S_try_cookie("S_ins_limit",  S_ins_limit);
	S_show_help  = S_try_cookie("S_show_help",  S_show_help) == "YES" ? true : false;
	S_lang       = S_try_cookie("S_lang",       S_lang);

	L_levels_data = S_try_cookie("L_data", "");

	RAM.instruction_limit = S_ins_limit;
	D_animation_speed_index = S_anim_speed;
}


/* TODO remove uses of this functions and use variables instead */
/* function wrappers for settings variables */
function S_get_editor() {
	return S_editor;
}
function S_get_simulator() {
	return S_simulator;
}
function S_get_animation_speed_index() {
	return S_anim_speed;
}

/* default view for settings */
var S_base_html = `
	<div id="S-frame">
		<br><br>
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
		<hr>
		<br>
			<div class="S-option-title">Show help</div>
			<button class="S-flip-button" id="S-show-help-button" onclick="S_BTN_show_help()"></button>
			<div class="S-description" id="S-show-help-desc"></div>
		<hr>
		<br>
			<div class="S-option-title">Language</div>
			<button class="S-flip-button" id="S-lang-button" onclick="S_BTN_lang()"></button>
			<div class="S-description" id="S-lang-desc"></div>
		<br>
		<br>
	</div>
`;


/* opens settings window on page */
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

	document.getElementById("S-show-help-desc").innerHTML   = S_descriptions["NS"];
	document.getElementById("S-show-help-button").innerHTML = S_show_help ? "YES" : "NO";

	document.getElementById("S-lang-desc").innerHTML   = S_descriptions["LN"];
	document.getElementById("S-lang-button").innerHTML = S_lang;
}

/* actions triggered on settings changes */
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

function S_BTN_ins_limit(x) {
	if (!isNaN(x + "")) {
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

function S_BTN_show_help() {
	S_show_help = !S_show_help;
	document.getElementById("S-show-help-desc").innerHTML   = S_descriptions["NS"];
	document.getElementById("S-show-help-button").innerHTML = S_show_help ? "YES" : "NO";
}

function S_BTN_lang() {
	S_lang = S_lang == "PL" ? "EN" : "PL";
	document.getElementById("S-lang-desc").innerHTML   = S_descriptions["LN"];
	document.getElementById("S-lang-button").innerHTML = S_lang;
}

function S_save_cookies() {
		set_cookie("S_editor",      S_editor);
		set_cookie("S_simulator",   S_simulator);
		set_cookie("S_anim_speed",  S_anim_speed);
		set_cookie("S_ins_limit",   S_ins_limit);
		set_cookie("S_show_help",   S_show_help ? "YES" : "NO");
		set_cookie("S_lang",        S_lang);

		EA_cook_ie_codes();

		set_cookie("L_data", L_levels_data);

		if (D_state == "settings" || D_state == "levels") {
			set_cookie("D_input", EA_code_compress(D_input_cache));
		} else {
			set_cookie("D_input", EA_code_compress(SA_get_input()));
		}
}

/* save cookies and ask for confirmation on page exit */
window.onload = function() {
	window.addEventListener("beforeunload", function (e) {
		S_save_cookies();

		var confirmationMessage = 'Open codes will disappear after this action.';
		(e || window.event).returnValue = confirmationMessage;
		return confirmationMessage;
	});
};

setInterval(S_save_cookies, 5000);

