var L_is_launched = false;
var L_current_level = "";
var L_levels_data = "";

/* mangage level cookies */
function L_get_level_code(level) {

	return level.group + level.level;
}
function L_accept(level_code) {
	var new_levels_data = "";
	for (var level of L_levels_data.split("#")) {
		if (new_levels_data != "")
			new_levels_data += '#'

		var curr_level_code   = level.split("|")[0];
		var curr_level_status = level.split("|")[1];

		if (curr_level_code == level_code)
			curr_level_status = "OK";
		
		new_levels_data += curr_level_code + "|" + curr_level_status;
	}
	L_levels_data = new_levels_data;
}
function L_is_accepted(level_code) {
	if (L_levels_data == "") return false;

	for (var level of L_levels_data.split("#")) {
		var curr_level_code   = level.split("|")[0];
		var curr_level_status = level.split("|")[1];
		if (curr_level_code == level_code && curr_level_status == "OK")
			return true;
	}
	return false;
}
function L_is_present(level_code) {
	if (L_levels_data == "") return false;

	for (var level of L_levels_data.split("#")) {
		var curr_level_code   = level.split("|")[0];
		if (curr_level_code == level_code)
			return true;
	}
	return false;
}
function L_init_levels_data(){
	for (var level of LD_levels) {
		var code = L_get_level_code(level);
		if (!L_is_present(code)) {
			if (L_levels_data != "")
				L_levels_data += '#';
			L_levels_data += code + "|WA";
		}		
	}
}
function L_init(){
	document.getElementById("right-div").innerHTML = `
		<div id="L-frame">
			<div class="L-T1-wrap">
				<div id="L-level-buttons"></div>
				<div id="L-problem-desc">
					<br><br><hr>
						<div id="L-title"></div>
					<hr>
						<img id="L-problem-img">
					<hr><br>
						<div class="L-limits"><div id="L-limits" class="L-long-text"></div></div>
						<div id="L-problem-text" class="L-long-text"></div>
					<br>
				</div>
			</div>
			<div class="L-T2-wrap">
				<div class="L-T3-wrap">
					<button class="L-submit-btn" onclick="L_BTN_submit()">Submit</button>
					<div class="L-T4-wrap">
						<div id="L-open-tests"></div>
						<div id="L-hidden-tests"></div>
					</div>
				</div>
				<div class="L-T5-wrap">
					<div class="L-inout">Test input</div>
					<textarea id="L-input"  placeholder="Test input ..."  readonly></textarea>
				</div>
				<div class="L-T5-wrap">
					<div class="L-inout">Expected output</div>
					<textarea id="L-output" placeholder="Test expected output ..." readonly></textarea>
				</div>
			</div>
		</div>
	`;

	L_init_levels_data();
	for (var level of LD_levels)
		if (!L_is_accepted(L_get_level_code(level)) && L_current_level == "")
			L_current_level = L_get_level_code(level)

	L_draw_levels_bar();
	L_is_launched = true;
	L_print_level();
}

function L_close() {
	document.getElementById("right-div").innerHTML = "";
	L_is_launched = false;
}

function L_locked(code) {
	return false; /* TODO uncomment me */
	for (var level of LD_levels) {
		if (level.group == code[0])
			return false;
		else if (!L_is_accepted(L_get_level_code(level)))
			return true;
	}
	return false;
}

function L_get_level_btn_class(code) {
	if (L_is_accepted(code))     return "L-accepted-level";
	if (L_locked(code))          return "L-locked-level";

	return "L-unsolved-level";
}
function L_draw_levels_bar() {

	var bar = document.getElementById("L-level-buttons");
	bar.innerHTML = "";

	for (var level of LD_levels) {
		let g = level.group;
		let c = level.level;
		let code = L_get_level_code(level);

		let group_box = document.getElementById("L-G-" + g);
		if (!group_box) {

			group_box = document.createElement("DIV");

			group_box.id        = "L-G-" + g;
			group_box.className = "L-level-group";

			bar.appendChild(group_box);
		}

		let btn = document.createElement("BUTTON");

		btn.id        = code;
		btn.innerHTML = code;
		btn.className = L_get_level_btn_class(code);

		if (!L_locked(code))
			btn.onclick = function() { L_choose_level(code) };

		if (L_current_level == code) btn.style.color = "var(--orange)";

		group_box.appendChild(btn);
	}
	
}

function L_choose_level(code) {
	document.getElementById(L_current_level).style.color = "var(--white)";
	document.getElementById(code).style.color            = "var(--orange)";	
	L_current_level = code;
	L_print_level();
}

function L_print_level(){
	var desc = document.getElementById("L-problem-desc");

	var code = L_current_level;
	var level = undefined;
	for (var c_level of LD_levels)
		if (L_get_level_code(c_level) == code)
			level = c_level;
	
	var OT = document.getElementById("L-open-tests");
	var HT = document.getElementById("L-hidden-tests");
	OT.innerHTML = "", HT.innerHTML = "";

	for (var test of level.tests) {
		var test_box  = document.createElement("DIV");
		var test_icon = document.createElement("BUTTON");

		test_box.className   = "L-test-box";
		test_icon.className  = "L-test-icon";
		test_icon.id         = "L-test-" + test.num;
		test_icon.innerHTML  = test.num;

		test_box.appendChild(test_icon);
		
		if (test.hidden) HT.appendChild(test_box);
		else             OT.appendChild(test_box);

		let hidden   = test.hidden;
		let test_inp = test.in;
		let test_out = test.out;
		
		test_icon.onclick = () => {
			if (!hidden) {
				document.getElementById("L-input").value  = test_inp.join(" ");
				document.getElementById("L-output").value = test_out.join(" ");
			}
		};
	}

	document.getElementById("L-input").value  = level.tests[0].in.join(" ");
	document.getElementById("L-output").value = level.tests[0].out.join(" ");

	document.getElementById("L-problem-img").src = "images/" + level.image;
	if (S_lang == "PL") {
		document.getElementById("L-title").innerHTML        = "# " + level.title_pl + " #";
		document.getElementById("L-problem-text").innerHTML = level.desc_pl;
	} else {
		document.getElementById("L-title").innerHTML        = "# " + level.title_en + " #";
		document.getElementById("L-problem-text").innerHTML = level.desc_en;
	}

	document.getElementById("L-limits").innerHTML =
		"<div class='L-right'>Instruction limit: <pre>" + level.instruction_limit + "</pre></div>" + 
		"<div class='L-right'>Time limit: <pre>" + level.time_limit + "</pre></div>" + 
		"<div class='L-right'>Memory limit: <pre>" + level.memory_limit + "</pre></div>";
	document.getElementById("L-limits").style.width = "auto";
	document.getElementById("L-limits").style.float = "right";

	if (L_is_accepted(code)) document.getElementById("L-problem-desc").style.borderColor = "var(--green)";
	else                     document.getElementById("L-problem-desc").style.borderColor = "var(--gray)";
}


function L_shuffle_array(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function L_set_output(text){
	document.getElementById("L-output").value = text;
}

function L_set_input(text){
	document.getElementById("L-input").value = text;
}

async function L_blink_output(color){
	document.getElementById("L-output").style.borderColor = color;
	document.getElementById("L-output").style.color = color;
	await new Promise(r => setTimeout(r, 1000));
	document.getElementById("L-output").style.borderColor = "var(--gray)";
	document.getElementById("L-output").style.color = "var(--white)";
}

function L_color_test(num, color){
	document.getElementById("L-test-" + num).style.background = color;
}

function L_compare(s1, s2) {
	return s1.trim() == s2.trim();
}

var L_submit_lock = false;
async function L_BTN_submit(){
	if (L_submit_lock)
		return;
	L_submit_lock = true;

	L_set_input("");
	L_set_output("");

	var level_code = L_current_level;
	var level = undefined;
	for (var c_level of LD_levels)
		if (L_get_level_code(c_level) == level_code)
			level = c_level;
		
	var tests = [...level.tests];
//	L_shuffle_array(tests);

	var code = EA_get_code();
	var RAM_L = new ram_machine();	
	RAM_L.instruction_limit = level.instruction_limit;
	RAM_L.time_limit        = level.time_limit;
	RAM_L.memory_limit      = level.memory_limit;

	var result = RAM_L.parse_code(code);
	
	if (result.status != "ok") {
		N_warn("Compilation error in line: " + (result.line_number + 1) + "\n" + result.description);
		L_set_output("Error in line: " + (result.line_number + 1) + "\n" + result.description);
		await L_blink_output("var(--red)");
		L_set_input("");
		L_submit_lock = false;
		return;
	}
	var failed = false;

	for (var test of tests) {

		await new Promise(r => setTimeout(r, 300));	

		RAM_L.clear_state();
		RAM_L.set_input(test.in.join(" "));

		result = RAM_L.run_full();

		if (result.status == "ok") {

			if (L_compare(RAM_L.get_output(), test.out.join(" "))) {

				L_color_test(test.num, "var(--green)");
				if (!failed)
					L_set_output("Test: " + test.num + " passed.");

			} else {

				L_color_test(test.num, "var(--red)");
				if (!failed) {
					N_warn("Wrong answer on test: " + test.num);

					if (!test.hidden) {
						var text = "Wrong answer on test: " + test.num + "\n";
						text += "Input:           " + test.in.join(" ") + "\n";
						text += "Expected output: " + test.out.join(" ") + "\n";
						text += "User output:     " + RAM_L.get_output(); + "\n";
						L_set_output(text);
					}

					await L_blink_output("var(--red)");
					failed = true;
				}
			}

		} else if (result.status == "re") {
			L_color_test(test.num, "var(--red)");
			if (!failed) {
				N_warn("Runtime error on test: " + test.num);
				L_set_output("Runtime error on line: " + (result.details.line + 1) + "\n" + result.details.details);
				await L_blink_output("var(--red)");
				failed = true;
			}
		} else {
			L_color_test(test.num, "var(--red)");
			if (!failed) {
				N_warn("One of limits exceeded on test: " + test.num);
				L_set_output("Limit exceeded: " + result.status);
				await L_blink_output("var(--red)");
				failed = true;
			}
		}
	}
	if (!failed) {

		N_notify("Level: " + level_code + " completed!");
		L_set_output("Success");
		document.getElementById("L-problem-desc").style.borderColor = "var(--green)";
		L_accept(level_code);
		L_draw_levels_bar();
		await L_blink_output("var(--green)");
		
	} else {
		await new Promise(r => setTimeout(r, 1000));
	}

	for (var test of tests)
		L_color_test(test.num, "var(--dark_gray)");

	L_submit_lock = false;
}
