/*
states:
	running:
		editor is locked
		simulator is opened

	editing:
		editor is not locked
		simulator is opened but inactive

	levels:
		editor is not locked
		levels are opened

	settings:
		editor is not locked
		settings are opened
	
running states:

	
	auto:
		simulation is running automatically

	noauto:
		simulation is running not automatically

	stopped:
		simualtion is ready to be launched / finished

*/

var RAM = new ram_machine();

var D_running_state;
var D_state;
var D_events                 = [];
var D_current_result         = undefined;
var D_pressed_step           = false;
var D_animation_speeds_ps    = [5, 10, 25, 50, 100, 250, 500, 1000, 2000, 2500];
var D_animation_speed_index  = S_get_animation_speed_index();
var D_animation_speed_levels = 10;

function D_req_cache_next_page() {
	var t = BigInt(PS_current_mem[0][0]) + BigInt(RAM.cache_size);
	PS_set_memory(RAM.get_page_state(t));
}

function D_req_cache_prev_page() {
	var t = BigInt(PS_current_mem[0][0]) - BigInt(RAM.cache_size);
	if (t < 1n) t = 1n;
	PS_set_memory(RAM.get_page_state(t));
}

function D_global_init() {
	S_init();

	EA_init(1);
	SA_init();

	EA_cook_ie_restore();

	if (get_cookie("D_input"))
		SA_set_input(EA_code_decompress(get_cookie("D_input")));
	D_state = "editing";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function D_try_enter_running() {
	/* load code to machine; compile and optionally change D_state to running */
	var result = RAM.parse_code(EA_get_code());
	if (result.status == "ok") {
		D_state = "running";
		D_running_state = "stopped";
		EA_lock();
		SA_set_frame_color("var(--green)");
		N_notify("Code loaded to simulator; press run to start execution.")
		SA_color_output("var(--gray)");

	} else {
		SA_set_output("Error in line: " + (result.line_number + 1) + "\n" + result.description);
		N_warn("Compilation error");
		SA_color_output("var(--red)");
	}
}
function D_init_RAM(){
	var inp = SA_get_input();
	if (inp == undefined)
		inp = "";
	
	D_events = [];
	D_current_result = undefined;
	RAM.clear_state();
	RAM.set_input(inp);
	SA_init_sim();
	SA_color_output("var(--gray)");
}

function BTN_code_run(){
	if (D_state == "running") {
		if (D_running_state == "stopped") {

			D_init_RAM();
			D_running_state = "auto";

		} else if (D_running_state == "noauto") {
			D_running_state = "auto";
		} else if (D_running_state == "auto") {
			/* ignore */
		}
		return;
	} else if (D_state == "levels") {
		D_show_hide_simulator();
		D_state = "editing";
	} else if (D_state == "settings") {
		D_show_hide_simulator();
		D_state = "editing";
	}

	D_try_enter_running();
}

function BTN_code_stop() {
	if (D_state == "running") {
		if (D_running_state == "stopped" || D_running_state == "noauto") {

			D_state = "editing";
			EA_unlock();
			SA_color_output("var(--gray)");
			SA_set_frame_color("var(--gray)");

		} else if (D_running_state == "auto") {
			D_running_state = "noauto";
		}
	}
}

function BTN_code_run_step() {
	if (D_state == "running") {
		if (D_running_state == "stopped") {

			D_init_RAM();
			D_running_state = "noauto"

		} else if (D_running_state == "noauto") {
			D_pressed_step = true;
			D_running_state = "noauto";
		} else if (D_running_state == "auto") {
			D_running_state = "noauto";
		}
		return;
	} else if (D_state == "levels") {
		D_show_hide_simulator();
		D_state = "editing";
	} else if (D_state == "settings") {
		D_show_hide_simulator();
		D_state = "editing";
	}

	D_try_enter_running();
}

function BTN_code_run_full(){
	if (D_state == "running" || D_state == "editing") {
		D_init_RAM();

		var result = RAM.parse_code(EA_get_code());
		if (result.status != "ok") {
			SA_set_output("Error in line: " + (result.line_number + 1) + "\n" + result.description);
			N_warn("Compilation error");
			SA_color_output("var(--red)");
		}

		result = RAM.run_full();

		if (result.status == "ok") {

			SA_set_output(RAM.get_output());
			SA_set_alu(RAM.memory[0], 0);

		} else if (result.status == "re") {

			SA_set_output(RAM.get_output() + "\nRuntime error on line: " + (result.details.line + 1) + "\n" + result.details.details);
			SA_color_output("var(--red)");
			SA_set_alu(RAM.memory[0], 1);

		} else {

			SA_set_output(RAM.get_output() + "\nLimit exceeded: " + result.status);
			SA_color_output("var(--red)");
			SA_set_alu(RAM.memory[0], 0);

		}

		SA_set_counters(RAM.memory_counter, RAM.time_counter, RAM.instruction_counter);
		SA_set_memory(RAM.get_page_state());
		N_notify("Executed at maximum speed");
	} else {
		D_show_hide_simulator();
		D_state = "editing";
	}
}

var D_refresh_rate = 5;
var D_counter = 0;
function D_update(){
//	if (PS_is_launched) {
		var mod = D_animation_speeds_ps[D_animation_speed_index];

		D_counter += D_refresh_rate;
		D_counter %= mod;

		if (D_counter != 0) return;

		if (D_state == "running" && (D_running_state == "auto" || D_running_state == "noauto")) {
			if (D_events.length == 0) {
				if (D_current_result != undefined && D_current_result.status != "ok") {

					D_running_state = "stopped";
					EA_clear_highlight();

					return;
				} else if (D_pressed_step || D_running_state == "auto") {
					var result = RAM.run_one_step();
					D_pressed_step = false;

					EA_highlight_line(result.line+1);

					D_events         = [...result.events];
					D_current_result = result;
		}
			}
			if (D_events.length != 0)
				SA_process_step_result(D_events.shift(), D_current_result);
		}
//	}
}

setInterval(D_update, D_refresh_rate);

var D_input_cache;
function D_show_hide_simulator(){
	if (SA_is_launched()) {
		D_input_cache = SA_get_input();
		SA_close();
	} else {
		SA_init();
		SA_set_input(D_input_cache);
	}
}

function BTN_animator(){
	if (D_state == "levels" || D_state == "settings") {
		D_state = "editing";
		D_show_hide_simulator();
	}
}

function BTN_settings(){
	if (D_state == "running") {
		BTN_code_stop();
		BTN_code_stop();
		D_show_hide_simulator();
		D_state = "settings";
	} else if (D_state == "editing") {
		D_show_hide_simulator();
		D_state = "settings";
	}
	D_state = "settings";
	S_run_settings();
}

function BTN_levels(){
	if (D_state == "running") {
		BTN_code_stop();
		BTN_code_stop();
		D_show_hide_simulator();
		D_state = "levels";
	} else if (D_state == "editing") {
		D_show_hide_simulator();
	}
	D_state = "levels";
	N_notify("TODO Run levels\n");
}
