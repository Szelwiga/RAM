/*
	Author:            Marcel Szelwiga
	Implemented here:  Wrapper for both simulators API
*/

var SA_curr_sim = S_get_simulator(); /* current simulator */
var SA_time_cnt = 0; /* internal time counter to split timer for separate events */
var SA_output   = ""; /* stores the output created during code execution */

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
	else                     DS_update_memory(mem);
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

/* inits new simulation */
function SA_init_sim(){
	SA_clear();
	SA_set_memory(RAM.get_page_state());
	SA_time_cnt = 0;
	SA_output   = "";
}

/* play animation (this is a bridge between driver and PS/DS api) */
async function SA_process_step_result(event, result, time) {
	SA_time_cnt += RAM_DEFAULT_EVENTS_TIMES[event.event];

	if (SA_curr_sim == "PS") {

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

	} else {
		DS_ins = result.ins;
		time *= 0.9;
		if (event.event == "read") {
			var pos;
			var T1 = time * 0.3; /* go to input */
			var T2 = time * 0.2; /* idle at input and change input texture */
			var T3 = time * 0.3; /* go to memory */
			var T4 = time * 0.2; /* idle at memory and change its value */

			/* go to input */
			pos = DS_find_target("input");
			await DS_robot_go(pos.x, pos.y, T1);

			/* idle at input and change input texture */
			DS_reading_input = true;
			await DS_robot_idle(T2);

			/* go to memory */
			DS_reading_input = false;
			DS_robot.text = event.value + "";
			var mem_box = parseInt(event.to % RAM_DEFAULT_CACHE_SIZE);
			pos = DS_find_target("memory-" + mem_box);
			if (event.to == 0) pos = DS_find_target("alu");
			await DS_robot_go(pos.x, pos.y, T3);

			DS_robot.text = "";
			if (event.to == 0) {
				DS_alu_color = DS_active_color;
				DS_alu = event.value + "";
				await DS_robot_idle(T4);
				DS_alu_color = DS_inactive_color;
			} else {
				var mc = parseInt(RAM_DEFAULT_CACHE_SIZE);
				var TC = ((mem_box + mc - 1) % mc);
				DS_memory[TC][2] = DS_active_color;
				DS_update_memory(RAM.get_page_state());
				await DS_robot_idle(T4);
				DS_memory[TC][2] = DS_inactive_color;
			}

		} else if (event.event == "write") {
			var T1 = time * 0.6; /* go to output */
			var T2 = time * 0.4; /* idle at output and change output texture */

			/* go to output */
			DS_robot.text = event.value + "";
			pos = DS_find_target("output");
			await DS_robot_go(pos.x, pos.y, T1);
			DS_robot.text = "";

			/* idle at output and change output texture */
			DS_writing_output = true;
			await DS_robot_idle(T2);
			DS_writing_output = false;

            SA_output += event.value + " ";
            DS_set_output(SA_output);

		} else if (event.event == "get_value") {

			var T1 = time * 0.6; /* go to mem cell */
			var T2 = time * 0.4; /* idle at output and change output texture */

			/* go to memory */
			var mem_box = parseInt(event.from % RAM_DEFAULT_CACHE_SIZE);
			pos = DS_find_target("memory-" + mem_box);
			if (event.from == 0) pos = DS_find_target("alu");
			await DS_robot_go(pos.x, pos.y, T1);

			DS_robot.text = "";
			if (event.from == 0) {
				DS_alu_color = DS_active_color;
				await DS_robot_idle(T2);
				DS_alu_color = DS_inactive_color;
			} else {
				var mc = parseInt(RAM_DEFAULT_CACHE_SIZE);
				var TC = ((mem_box + mc - 1) % mc);
				DS_memory[TC][2] = DS_active_color;
				await DS_robot_idle(T2);
				DS_memory[TC][2] = DS_inactive_color;
			}
		} else if (event.event == "move_cache") {
			var T1 = time * 0.6; /* go to cache spinner */
			var T2 = time * 0.4; /* idle at cache spinner */

			var pos = DS_find_target("cache");
			await DS_robot_go(pos.x, pos.y, T1);

			DS_update_memory(RAM.get_page_state());
			for (var i = 0; i < parseInt(RAM_DEFAULT_CACHE_SIZE); i++)
				DS_memory[i][2] = DS_active_color;
			await DS_robot_idle(T2);
			for (var i = 0; i < parseInt(RAM_DEFAULT_CACHE_SIZE); i++)
				DS_memory[i][2] = DS_inactive_color;
		} else if (event.event == "runtime_error") {

			/* pure panic */
			var T = time * 0.25;

			DS_ins += " - ERROR";
			DS_alu += " - ERROR";
			DS_robot.text = "PANIC";
			SA_output += "\n";
			SA_output += "Runtime error on line: " + (event.line + 1) + "\n" + event.details;
			DS_set_output(SA_output);
			DS_color_output("var(--red)");

			var pos = DS_find_target("memory-0");
			await DS_robot_go(1, 1, T);
			await DS_robot_go(pos.x, pos.y, T);
			await DS_robot_go(1, 1, T);
			await DS_robot_go(pos.x, pos.y, T);

		} else if (event.event == "store") {

			var T1 = time * 0.3; /* go to alu */
			var T2 = time * 0.2; /* idle at alu */
			var T3 = time * 0.3; /* go to memory */
			var T4 = time * 0.2; /* idle at memory */

			var pos = DS_find_target("alu");
			await DS_robot_go(pos.x, pos.y, T1);

			DS_robot.text = event.value + "";
			DS_alu_color = DS_active_color;
			await DS_robot_idle(T2);
			DS_alu_color = DS_inactive_color;

			var mem_box = parseInt(event.to % RAM_DEFAULT_CACHE_SIZE);
			pos = DS_find_target("memory-" + mem_box);
			await DS_robot_go(pos.x, pos.y, T3);

			DS_robot.text = "";
			DS_update_memory(RAM.get_page_state());
			var mc = parseInt(RAM_DEFAULT_CACHE_SIZE);
			var TC = ((mem_box + mc - 1) % mc);
			DS_memory[TC][2] = DS_active_color;
			await DS_robot_idle(T4);
			DS_memory[TC][2] = DS_inactive_color;

		} else if (event.event == "load") {

			var T1 = time * 0.6; /* go to alu */
			var T2 = time * 0.4; /* idle at alu */

			DS_robot.text = event.value + "";

			var pos = DS_find_target("alu");
			await DS_robot_go(pos.x, pos.y, T1);

			DS_alu = event.value + "";
			DS_alu_color = DS_active_color;
			await DS_robot_idle(T2);
			DS_alu_color = DS_inactive_color;
			DS_robot.text = "";

		} else if (event.event in {"add": 1, "sub": 1, "mult": 1, "div": 1}) {

			var T1 = time * 0.6; /* go to alu */
			var T2 = time * 0.4; /* idle at alu */

			DS_robot.text = event.value + "";

			var pos = DS_find_target("alu");
			await DS_robot_go(pos.x, pos.y, T1);

			var niceName = {
				"add": "Addition!",
				"sub": "Substraction!",
				"mult": "Multiplication!",
				"div": "Division!"
			};

			DS_robot.text = niceName[event.event];
			DS_alu = event.new_value + "";
			DS_alu_color = DS_active_color;
			await DS_robot_idle(T2);
			DS_alu_color = DS_inactive_color;
			DS_robot.text = "";

		} else if (event.event == "checkgtz" || event.event == "checkzero") {

			var T1 = time * 0.6; /* go to alu */
			var T2 = time * 0.4; /* idle at alu */

			var pos = DS_find_target("alu");
			await DS_robot_go(pos.x, pos.y, T1);

			var niceName = {
				"checkgtz": "? >0 ?",
				"checkzero": "? =0 ?",
			};

			DS_robot.text = niceName[event.event];
			let old_alu = DS_alu;
			DS_alu = event.result ? "YES" : "NO";
			DS_alu_color = DS_active_color;
			await DS_robot_idle(T2);
			DS_alu_color = DS_inactive_color;
			DS_alu = old_alu;
			DS_robot.text = "";
		} else {
			DS_robot_idle(time);
		}

	}
	if (event == result.events[result.events.length - 1]) {
		SA_time_cnt = RAM.time_counter;
		DS_set_counters(RAM.memory_counter, RAM.time_counter, RAM.instruction_counter);
	}
}
