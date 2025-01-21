var GE_is_locked    = false;
var GE_locked_code  = "";
var GE_last_update  = 0;
var GE_is_launched  = 0;
var GE_green_frame_timeout = 2000;

var GE_id_ptr        = 1;
var GE_line_cnt      = 0;
var GE_cache         = {};
var GE_input_classes = {
	"GE-comment":     1,
	"GE-label":       1,
	"GE-instruction": 2,
	"GE-argument":    3,
};

var GE_row_template = `
	<div class="GE-linenumber">?</div>
	<input class="GE-label" type="text" placeholder="label"></input><div class="GE-sep"></div>
	<input class="GE-instruction" type="text" placeholder="instruction"></input><div class="GE-sep"></div>
	<input class="GE-argument" type="text" placeholder="argument"></input>&nbsp
	<button class="GE-comment-btn">#</button>
`;

function GE_set_up(){
	/* creates GE HTML on webpage */
	var elem = document.getElementById("left-div");
	elem.innerHTML = `
		<div id="GE-editor-frame">
			<div id="GE-code">
				<div class="GE-row">
					<div class="GE-linenumber">1</div>
					<input class="GE-comment" type="text" placeholder="# Write your code here!"></input>&nbsp
					<button class="GE-comment-btn">#</button>
				</div>
				<hr>
				<div class="GE-row">
					<div class="GE-linenumber">2</div>
					<input class="GE-label" type="text" placeholder="label"></input><div class="GE-sep"></div>
					<input class="GE-instruction" type="text" placeholder="instruction"></input><div class="GE-sep"></div>
					<input class="GE-argument" type="text" placeholder="argument"></input>&nbsp
					<button class="GE-comment-btn">#</button>
				</div>
				<hr>
				<div class="GE-row"><button id="GE-new-line" class="GE-comment-btn" onclick="GE_append_last_line()">v</button></div>
			</div>
		</div>
		
	`;
	GE_reformat();
	
	GE_is_launched = 1;
	PE_is_launched = 0;
}

function GE_gen_id(s){
	return s + GE_id_ptr++;
}

function GE_get_elem_value(elem){
	if (elem.nodeName == "INPUT") return elem.value;
	else                          return elem.innerHTML;
}

function GE_check_focus(){
	var focused_elem = document.activeElement;
	return (focused_elem.className in GE_input_classes);
}

function GE_position_str(x, y){
	return "r" + x + "c" + y;
}

function GE_get_focused_pos(){
	var focused_elem = document.activeElement;
	var code = document.getElementById("GE-code");
	for (var row of code.children) {
		if (row.className == "GE-row") {

			var is_comment = false;

			for (var row_item of row.children) {
				if (row_item.className == "GE-linenumber")	linenumber = parseInt(GE_get_elem_value(row_item));
				if (row_item == focused_elem) {
					if (row_item.className in GE_input_classes)
						return { "row": linenumber, "col": GE_input_classes[row_item.className]};
				}
			}
		}
	}
	return undefined;
}

function GE_set_cache(){

	GE_cache = {};	
	var code = document.getElementById("GE-code");
	var focused_elem = document.activeElement;

	for (var row of code.children) {
		if (row.className == "GE-row") {

			var linenumber;
			for (var row_item of row.children) {

				if (row_item.className == "GE-linenumber")
					linenumber  = GE_get_elem_value(row_item);

				var cur_pos = undefined;
				if (row_item == focused_elem) {
					cur_pos = row_item.selectionStart;
				}
				
				if (row_item.className in GE_input_classes) {
					GE_cache[GE_position_str(linenumber, GE_input_classes[row_item.className])] = {
						"value": GE_get_elem_value(row_item),
						"cur_pos": cur_pos,
						"comment": row_item.className == "GE-comment",
					}
				}
			}
		}
	}

}

function GE_paste_code(text){
	lines = text.split('\n');

	var new_lines = [];
	for (var line of lines) {
		line = line.trim();
		if (line[0] != '#' && line.search('#') != -1) {
			line = line.split('#');
			new_lines.push(line.shift());
			new_lines.push('#' + line.join('#'));
		} else {
			new_lines.push(line);
		}
	}
	lines = new_lines;
	for (var line of lines) line = line.trim();

	while (GE_line_cnt > 1)            { GE_delete_line(2); GE_reformat(); }
	while (GE_line_cnt < lines.length) { GE_append_last_line(); GE_reformat(); }
	GE_append_last_line(); GE_delete_line(1); GE_reformat();

	var code = document.getElementById("GE-code");
	for (var row of code.children) 
		if (row.className == "GE-row")
			for (var row_item of row.children)
				if (row_item.className == "GE-linenumber")
					if (1 <= GE_get_elem_value(row_item) && GE_get_elem_value(row_item) <= GE_line_cnt)
						GE_flip_line_type(row.id);

	for (var row of code.children) 
		if (row.className == "GE-row")
			for (var row_item of row.children)
				if (row_item.className == "GE-comment")
					row_item.value = lines.shift();

	for (var row of code.children)
		if (row.className == "GE-row")
			for (var row_item of row.children)
				if (row_item.className == "GE-comment") {
					if (row_item.value[0] != '#') GE_flip_line_type(row.id);
					else                          row_item.value = row_item.value.substr(1).trim();
				}
	
	GE_reformat();
}

function GE_get_code(){
	var result = "";
	var code = document.getElementById("GE-code");
	for (var row of code.children) {
		if (row.className == "GE-row") {

			var is_comment = false;
			var linenumber = undefined, instruction = undefined, comment = undefined, argument = undefined, label = undefined;

			for (var row_item of row.children) {
				if (row_item.id == "GE-new-line")
					return result.substr(0, result.length - 1);
				if (row_item.className == "GE-comment") {
					is_comment  = true;
					comment     = GE_get_elem_value(row_item);
				} else if (row_item.className == "GE-label") {
					label       = GE_get_elem_value(row_item);
				} else if (row_item.className == "GE-instruction") {
					instruction = GE_get_elem_value(row_item);
				} else if (row_item.className == "GE-argument") {
					argument    = GE_get_elem_value(row_item);
				} else if (row_item.className == "GE-linenumber") {
					linenumber  = GE_get_elem_value(row_item);
				}
			}

			if (is_comment) {
				result += "# " + comment;
			} else {
				if (label != ""       && label != undefined)       result += label + ": ";
				if (instruction != "" && instruction != undefined) result += instruction + " ";
				if (argument != ""    && argument != undefined)    result += argument;
			}
			result += "\n";
		}
	}
}

function GE_try_set_focus(r, c){
	var code = document.getElementById("GE-code");
	for (var row of code.children) {
		if (row.className == "GE-row") {
			var linenumber;
			for (var row_item of row.children) {
				if (row_item.className == "GE-linenumber")
					linenumber = GE_get_elem_value(row_item);

				if (row_item.className == "GE-comment" && r == linenumber) {
					row_item.focus();
					row_item.setSelectionRange(0, 0);
				}
				if (row_item.className in GE_input_classes)
					if (r == linenumber && c == GE_input_classes[row_item.className]) {
						row_item.focus();
						row_item.setSelectionRange(0, 0);
					}
			}
		}
	}

}

function GE_append_line(line){
	var code = document.getElementById("GE-code");
	var to_next = false;
	for (var row of code.children) {
		if (to_next) {
			code.insertBefore(document.createElement("hr"), row);

			var D = document.createElement("div");
			D.className = "GE-row";
			D.innerHTML = GE_row_template;
			code.insertBefore(D, row);

			return;
		}
		if (row.className == "GE-row") {

			var linenumber;
			for (var row_item of row.children)
				if (row_item.className == "GE-linenumber")
					linenumber = GE_get_elem_value(row_item);
			
			if (linenumber == line)
				to_next = true;
		}
	}
}

function GE_flip_line_type(elem_id, ln){
	var code = document.getElementById("GE-code");
	if (elem_id == undefined) {
		for (var row of code.children) {
			for (var row_item of row.children)
				if (row_item.className == "GE-linenumber")
					if (GE_get_elem_value(row_item) == ln)
						elem_id = row.id;
		}
	}
	
	var row = document.getElementById(elem_id);

	var is_comment = false;
	var linenumber, instruction, comment, argument, label;

	for (var row_item of row.children) {
		if (row_item.className == "GE-comment") {
			is_comment  = true;
			comment     = GE_get_elem_value(row_item);
		} else if (row_item.className == "GE-label") {
			label       = GE_get_elem_value(row_item);
		} else if (row_item.className == "GE-instruction") {
			instruction = GE_get_elem_value(row_item);
		} else if (row_item.className == "GE-argument") {
			argument    = GE_get_elem_value(row_item);
		} else if (row_item.className == "GE-linenumber") {
			linenumber  = GE_get_elem_value(row_item);
		}
	}
	
	if (!comment)     comment     = "";
	if (!label)       label       = "";
	if (!instruction) instruction = "";
	if (!argument)    argument    = "";   

	if (is_comment) {
		var splitted_comment = comment.split(" ").filter((s) => (s != ""));
		if (splitted_comment.length != 0) {
			if (splitted_comment[0][splitted_comment[0].length-1] == ":") {
				label = splitted_comment.shift();
				label = label.substr(0, label.length - 1);
			}
			if (splitted_comment.length)
				instruction = splitted_comment.shift();
			argument = splitted_comment.join(" ");
		}

		var D = document.createElement("div");
		D.className = "GE-row";
		D.innerHTML = GE_row_template;
		for (var row_item of D.children){
			if (row_item.className == "GE-label") {
				row_item.value = label;
			} else if (row_item.className == "GE-instruction") {
				row_item.value = instruction;
			} else if (row_item.className == "GE-argument") {
				row_item.value = argument;
			} else if (row_item.className == "GE-linenumber") {
				row_item.innerHTML = linenumber;
			}
		}
		code.replaceChild(D, row);
		GE_try_set_focus(linenumber, 2);
	} else {
		var comment_value = "";
		if (label != "")       comment_value += label + ": ";
		if (instruction != "") comment_value += instruction + " ";
		if (argument != "")    comment_value += argument;

		var first = false;
		var to_remove = [];
		for (var row_item of row.children) {
			if (!first) {
				first = true;
			} else {
				to_remove.push(row_item);
			}
		}

		var btn  = to_remove.pop();
		var repl = to_remove.pop();

		for (var row_item of to_remove) {
			row.removeChild(row_item);
		}

		var comment_elem = document.createElement("input");
		comment_elem.className   = "GE-comment";
		comment_elem.type        = "text";
		comment_elem.value       = comment_value;
		comment_elem.placeholder = "comment";

		row.replaceChild(comment_elem, repl);
		GE_try_set_focus(linenumber, 1);
	}
	GE_reformat();
}

function GE_reformat(){

	var code = document.getElementById("GE-code");
	var linenumber = 0;
	for (var row of code.children) {
		if (row.className == "GE-row") {
			row.id = GE_gen_id("GE-row-");
			linenumber++;

			for (var row_item of row.children)
				if (row_item.className == "GE-linenumber")
					row_item.innerHTML = linenumber;

			for (var row_item of row.children)
				if (row_item.nodeName == "BUTTON" && row_item.innerHTML == "#") {
					let arg = row.id;
					row_item.onclick = function() { GE_flip_line_type(arg) };
				}

			for (var row_item of row.children)
				if (row_item.className != "GE-comment" && row_item.nodeName == "INPUT")
					row_item.value = row_item.value.trim();

			for (var row_item of row.children)
				if (row_item.nodeName == "INPUT")
					row_item.spellcheck = false;
		}	
	}
	GE_line_cnt = linenumber - 1;

	/* color the world */
	
	var colors = {
		"read": "--blue",
		"write": "--blue",

		"load": "--yellow",
		"store": "--yellow",

		"add": "--green",
		"sub": "--green",
		"mult": "--green",
		"div": "--green",

		"jump": "--red",
		"jgtz": "--red",
		"jzero": "--red",

		"halt": "--orange",
	};

	for (var row of code.children) {
		if (row.className == "GE-row") {
			for (var row_item of row.children) {

				var remove_placeholders = false;

				for (var row_item of row.children) {
					if (row_item.className == "GE-comment") {
					
						var comment = GE_get_elem_value(row_item);
						if (comment != undefined && comment != "")
							row_item.style.color = "var(--aqua)";
					
					} else if (row_item.className == "GE-instruction") {

						instruction = GE_get_elem_value(row_item);
						if (instruction in colors)
							row_item.style.color = "var(" + colors[instruction] + ")";
						else
							row_item.style.color = "white";

					}
					if (row_item.className in GE_input_classes)
						if (GE_get_elem_value(row_item) != undefined && GE_get_elem_value(row_item) != "")
							remove_placeholders = true;

				}

				for (var row_item of row.children)
					if (row_item.className in GE_input_classes) {
						if (remove_placeholders) row_item.placeholder = "";
						else                     row_item.placeholder = row_item.className.replace("GE-", "");
					}

			}
		}
	}
}
function GE_append_last_line(){
	GE_append_line(GE_line_cnt);
	GE_reformat();
}

function GE_delete_line(line){
	if (GE_line_cnt == 1) return;

	var code = document.getElementById("GE-code");
	var to_next = false;
	var to_delete;
	for (var row of code.children) {
		if (to_next) {
			code.removeChild(to_delete);
			code.removeChild(row);
			return;
		}
		if (row.className == "GE-row") {

			var linenumber;
			for (var row_item of row.children)
				if (row_item.className == "GE-linenumber")

					linenumber = GE_get_elem_value(row_item);
			
			if (linenumber == line) {
				to_next = true;
				to_delete = row;
			}
		}
	}
}

function GE_clear_highlight(){
	var code = document.getElementById("GE-code");
	for (var row of code.children) {
		if (row.className == "GE-row") {
			for (var row_item of row.children)
				row_item.style.background = "var(--black)";
			row.style.background = "var(--black)";
		}
	}
}
function GE_highlight_line(x){
	GE_clear_highlight();
	var code = document.getElementById("GE-code");
	for (var row of code.children) {
		if (row.className == "GE-row") {
			var color = false;
			for (var row_item of row.children) {
				if (row_item.className == "GE-linenumber" && GE_get_elem_value(row_item) == x)
					color = true;
				if (color) row_item.style.background = "var(--dark_red)";
			}
			if (color) row.style.background = "var(--dark_red)";
		}
	}
}

function GE_lock(){
	/* locks editor editing */
	GE_is_locked    = true;
	GE_locked_code  = GE_get_code();
	document.getElementById("GE-editor-frame").style.borderColor = "var(--dark_red)";

	var code = document.getElementById("GE-code");
	for (var row of code.children)
		if (row.className == "GE-row")
			for (var row_item of row.children)
				if (row_item.className in GE_input_classes)
					row_item.readOnly = true;
}

function GE_unlock(){
	/* unlocks editor editing */
	GE_is_locked = false;
	document.getElementById("GE-editor-frame").style.borderColor = "var(--gray)";

	var code = document.getElementById("GE-code");
	for (var row of code.children)
		if (row.className == "GE-row")
			for (var row_item of row.children)
				if (row_item.className in GE_input_classes)
					row_item.readOnly = false;
}

document.addEventListener("keydown", function GE_navigator(event) {	
	if (!GE_is_launched)	return;
	if (!GE_check_focus())	return;
	if (GE_is_locked)		return;

	var pos = GE_get_focused_pos();
	var focused_elem = document.activeElement;

	if (event.key == "ArrowUp")   GE_try_set_focus(pos.row-1, pos.col);
	if (event.key == "ArrowDown") GE_try_set_focus(pos.row+1, pos.col);
	if (event.key == "ArrowLeft") {

		var value    = GE_cache[GE_position_str(pos.row, pos.col)].value;
		var position = GE_cache[GE_position_str(pos.row, pos.col)].cur_pos;

		var nx = pos.row, ny = pos.col - 1;
		if (ny == 0) { nx = nx - 1; ny = 3; }
		if (position == 0)	GE_try_set_focus(nx, ny);
	}
	if (event.key == "ArrowRight") {

		var value    = GE_cache[GE_position_str(pos.row, pos.col)].value;
		var position = GE_cache[GE_position_str(pos.row, pos.col)].cur_pos;
		var comment  = GE_cache[GE_position_str(pos.row, pos.col)].comment;

		var nx = pos.row, ny = pos.col + 1;
		if (ny == 4 || (ny == 2 && comment)) { nx = nx + 1; ny = 1; }
		if (position == value.length)
			GE_try_set_focus(nx, ny);
	}
	
	if (event.key == "Enter") {
		GE_append_line(pos.row);
		GE_reformat();
		GE_try_set_focus(pos.row+1, 2);
	}

	if ((event.key == "Delete" && (event.ctrlKey || event.altKey))
	     || (event.key == "Backspace" && event.altKey)) {

		GE_delete_line(pos.row);
		GE_reformat();
		GE_try_set_focus(pos.row-1, pos.col);
		GE_try_set_focus(pos.row, pos.col);
	}

	if ((event.key == "3" || event.key == "#") && event.altKey)
		GE_flip_line_type(focused_elem.parentElement.id);

	GE_last_update = Date.now();
	GE_reformat();
	GE_set_cache();
});

function GE_update_frame_color(){
	if (!GE_is_launched)    return;
	if (GE_is_locked)       return;

	if (Date.now()-GE_green_frame_timeout < GE_last_update)
		document.getElementById("GE-editor-frame").style.borderColor = "var(--green)";		
	else
		document.getElementById("GE-editor-frame").style.borderColor = "var(--gray)";
}

setInterval(GE_update_frame_color, 100);
