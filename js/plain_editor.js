/*
	The code makes plain text editor (PE) work propertly
*/

/* globals of PE */

var PE_is_locked    = false;
var PE_locked_code  = "";
var PE_last_update  = 0;
var PE_is_launched  = 0;
var PE_green_frame_timeout = 2000;


/* outside dedicated functions */
function PE_set_up(){
	/* creates PE HTML on webpage */
	var elem = document.getElementById("left-div");
	elem.innerHTML = `
		<div id="PE-editor-frame">
			<pre id="PE-linenumbers-pre"><code id="PE-linenumbers">1<br></code></pre>
			<div id=PE-coding-box>
				<textarea cols="auto" wrap="hard" id="PE-editor" placeholder="write your code here" spellcheck="false" oninput="PE_editor_update(this.value); PE_sync_scroll(this);" onscroll="PE_sync_scroll(this);" onkeydown="PE_check_tab(this, event);"></textarea>
				<pre id="PE-highlighting" aria-hidden="true"><code id="PE-highlighting-content"></code></pre>
			</div>
		</div>
	`;
}

function PE_get_code(){
	/* returns code currently stored in editor */
	return document.querySelector("#PE-editor").value;
}

function PE_paste_code(text){
	/* allows to insert code to editor */
	document.querySelector("#PE-editor").value = text;
	PE_editor_update(text);
}

function PE_lock(){
	/* locks editor editing */
	PE_is_locked    = true;
	PE_locked_code  = PE_get_code();
	document.getElementById("PE-editor-frame").style.borderColor = "var(--dark_red)";
}

function PE_unlock(){
	/* unlocks editor editing */
	PE_is_locked = false;
	document.getElementById("PE-editor-frame").style.borderColor = "var(--gray)";
}

function PE_highlight_line(line_number){
	/* highlights given linenumber in PE editor */
	if (line_number == 0)	return;

	var text  = document.getElementById("PE-highlighting-content").innerHTML;
	var lines = text.split("<br>");


	var line = lines[line_number - 1];
	
	line = line.split("display:inline;");
	if (line.length == 1)
		line = "<p style=\"background-color:var(--dark_red);display:inline;\">" + line[0] + "</p>";
	else 
		line[0] += "background-color:var(--dark_red);";
		line     = line.join("display:inline;");

	lines[line_number - 1] = line;
	var text  = document.getElementById("PE-highlighting-content").innerHTML = lines.join("<br>");
}

/* below functions are responsible for the backend of plain text editor*/


/* update frame color to green or gray depending on activity */
function PE_update_frame_color(){
	if (!PE_is_launched)    return;
	if (PE_is_locked)       return;

	if (Date.now()-PE_green_frame_timeout < PE_last_update)
		document.getElementById("PE-editor-frame").style.borderColor = "var(--green)";		
	else
		document.getElementById("PE-editor-frame").style.borderColor = "var(--gray)";
}
setInterval(PE_update_frame_color, 100);

function PE_editor_update(text){

	/* treats updates of textrea, expands newlines and colors keywords */
	PE_last_update = Date.now();

	if (PE_is_locked) {
		document.querySelector("#PE-editor").value = PE_locked_code;
		return;
	}

	var elem = document.querySelector("#PE-highlighting-content");

	if (text[text.length-1] == '\n') text += " ";

	elem.innerHTML = PE_editor_color_html(text);

	var linenumbers = "1<br>";
	var cnt         = 2;

	for (var i=0; i<text.length; i++)
		if (text[i] == "\n")
			linenumbers += (cnt++) + "<br>";

	document.querySelector("#PE-linenumbers").innerHTML = linenumbers;
}

function PE_editor_gen_html(text, color){
	/* generates colored line html */
	return "<p style=\"color:var(" + color + ");display:inline;\">" + text + "</p>";
}

function PE_editor_color_html(text){
	/* eats text (code) and returns colored html */
	var style = [
		["read", "--blue"],
		["write", "--blue"],

		["load", "--yellow"],
		["store", "--yellow"],

		["add", "--green"],
		["sub", "--green"],
		["mult", "--green"],
		["div", "--green"],

		["jump", "--red"],
		["jgtz", "--red"],
		["jzero", "--red"],

		["halt", "--orange"]
	];

	text = text.replaceAll("&", "&amp;");
	text = text.replaceAll("<", "&lt;");
	text = text.replaceAll(">", "&gt;");
	text = text.replaceAll("\n", "<br>");
	text = text.replaceAll(" ", "&nbsp");

	for (var i of style)
		text = text.replaceAll(i[0], PE_editor_gen_html(i[0], i[1]));

	return text;
}

function PE_sync_scroll(element){
	/* scroll support for linenumbers and code */
	var elem1 = document.querySelector("#PE-highlighting");
	var elem2 = document.querySelector("#PE-linenumbers-pre");

	elem1.scrollTop  = element.scrollTop;
	elem1.scrollLeft = element.scrollLeft;

	elem2.scrollTop  = element.scrollTop;
}

function PE_check_tab(element, event){
	/* adds support for tabulation */
	var code = element.value;
	if (event.key == "Tab"){
		event.preventDefault();

		var before_tab = code.slice(0, element.selectionStart);
		var after_tab  = code.slice(element.selectionEnd, element.value.length);
		var cur_pos    = element.selectionEnd + 1;

		element.value          = before_tab + "\t" + after_tab;
		element.selectionStart = cur_pos;
		element.selectionEnd   = cur_pos;

		PE_editor_update(element.value);
	}
}


