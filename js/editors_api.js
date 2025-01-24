/*
	Author:            Marcel Szelwiga
	Implemented here:  Wraper for APIs of plain text editor and grid editor; multiple codes management
*/

var EA_localfiles        = {}; /* stores codes in different tabs */
var EA_current_editor    = S_get_editor(); /* current editor either PE or GE */
var EA_current_localfile = 0; /* number of current tab*/
var EA_cookie_limit      = 3600; /* single cookie limit */

/* swap between editors */
function EA_choose_editor(editor){
	if (EA_current_editor == editor) return;
	if (editor == "GE") {
		var code = PE_get_code();
		GE_set_up();
		GE_paste_code(code);
	} else {
		var code = GE_get_code();
		PE_set_up();
		PE_paste_code(code);
	}
	EA_current_editor = editor;
}

/* opens selected file in curretn editor */
function EA_choose_localfile(x) {
	EA_localfiles[EA_current_localfile] = EA_get_code();
	EA_paste_code(EA_localfiles[x]);
	EA_current_localfile = x;
	EA_regenerate_buttons();
	N_notify("Opened file " + x);
}

/* inits editor (and creates file) */
function EA_init(x) {
	EA_current_editor = S_get_editor();

	if (EA_current_editor == "GE") GE_set_up();
	else                           PE_set_up();

	EA_localfiles[x]     = "";
	EA_current_localfile = x;
	EA_regenerate_buttons();
}

/* wrappers to editors functions */
/* pastes code to editor */
function EA_paste_code(code) {
	if (EA_current_editor == "GE") GE_paste_code(code);
	else                           PE_paste_code(code);
}

/* extracts code from editor */
function EA_get_code() {
	if (EA_current_editor == "GE") return GE_get_code();
	else                           return PE_get_code();
}

/* locks editor */
function EA_lock() {
	if (EA_current_editor == "GE") GE_lock();
	else                           PE_lock();
}

/* unlocks editor */
function EA_unlock() {
	if (EA_current_editor == "GE") GE_unlock();
	else                           PE_unlock();
}

/* highlights line */
function EA_highlight_line(x){
	if (EA_current_editor == "GE") GE_highlight_line(x);
	else                           PE_highlight_line(x);
}

/* clears highlight */
function EA_clear_highlight(x){
	if (EA_current_editor == "GE") GE_clear_highlight(x);
	else                           PE_clear_highlight(x);
}

/* redraw code tabs buttons */
function EA_regenerate_buttons(){
	var btns = document.getElementById("codes_btns");
	btns.innerHTML = "";
	for (let i in EA_localfiles) {
		let f = function() { EA_choose_localfile(i); }
		var btn = document.createElement("BUTTON");
		if (i == EA_current_localfile) {
			btn.style.color = "var(--green)"; 
			btn.style.border_color = "var(--green)";
		} else {
			btn.className = "green-btn";
		}
		btn.onclick = f;
		btn.innerHTML = i;
		btns.appendChild(btn);
	}
}

/* download code to local device */
function BTN_editor_download() {
	var filename = "ram_code_" + EA_current_localfile + ".txt";
	var dl_elem = document.createElement("a");
	dl_elem.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(EA_get_code()));
	dl_elem.setAttribute("download", filename);

	dl_elem.style.display = "none";
	document.body.appendChild(dl_elem);

	dl_elem.click();

	document.body.removeChild(dl_elem);
	N_notify("Saved");
}

/* copy code to clipboard */
function BTN_copy() {
	navigator.clipboard.writeText(EA_get_code());
	N_notify("Copied to clipboard");
}

/* upload to editor from local device */
function BTN_editor_upload() {
	document.getElementById("EA_code_uploader").click();
}
async function EA_load_file(){
	EA_paste_code(await document.getElementById("EA_code_uploader").files[0].text());
	N_notify("Opened file");
}

/* create new local file */
function BTN_editor_new() {
	EA_localfiles[EA_current_localfile] = EA_get_code();
	var i = 1;
	while (i in EA_localfiles) i++;
	EA_init(i);
	N_notify("File " + i + " created");
}

/* delete localfile tab */
var BTN_delete_time = 0;
function BTN_editor_delete() {
	if (Object.keys(EA_localfiles).length == 1) {
		N_warn("Cannot delete last file");
		return;
	}

	if (BTN_delete_time + N_warning_duration < Date.now()) {
		N_warn("Click again to confirm");
		BTN_delete_time = Date.now();
		return;
	}

	for (var i in EA_localfiles) {
		if (i != EA_current_localfile) {
			var to_remove = EA_current_localfile;
			EA_choose_localfile(i);
			delete EA_localfiles[to_remove];
			EA_regenerate_buttons();
			N_notify("Deleted file " + to_remove);
			return;
		}
	}
	
}

/* TODO This should be change to compression */
/* currently this only escapes cookie sensitive characters */
function EA_code_compress(code){
	return code.replaceAll("\n", "/ENTER").replaceAll(";", "/SEMICOLON");
}

function EA_code_decompress(code){
	return code.replaceAll("/ENTER", "\n").replaceAll("/SEMICOLON", ";");	
}

/* split code so that it fits into multiple cookies */
function EA_split_code(code) {
	var current = "";
	var res = [];

	for (var i of code) {
		current += i;
		if (current.length > EA_cookie_limit) {
			res.push(current);
			current = "";
		}
	}

	if (current != "") res.push(current);
	return res;
}
/* generate id for code fragment in cookie */
function EA_part_code(x, y){
	return "EA_code_frag_" + x + "_" + y;
}

/* store codes in cookies */
function EA_cook_ie_codes() {
	EA_localfiles[EA_current_localfile] = EA_get_code();
	var codes_cnt = 0;
	for (var i in EA_localfiles) {
		codes_cnt++; 

		var code = EA_split_code(EA_code_compress(EA_localfiles[i]));

		var frag_cnt = 0;
		for (var code_frag of code){
			frag_cnt++;
			set_cookie(EA_part_code(codes_cnt, frag_cnt), code_frag);
		}
		
	}
	set_cookie("EA_codes_cnt", codes_cnt);
}

/* restore codes from cookeis */
function EA_cook_ie_restore(){
	if (get_cookie("EA_codes_cnt") == "")
		return;
	var cnt = get_cookie("EA_codes_cnt");
	for (var i = 1; i <= cnt; i++) {

		if (i!=1) EA_init(i);

		var j = 1, code = "";
		while (get_cookie(EA_part_code(i, j))) {
			code += get_cookie(EA_part_code(i, j));
			set_cookie(EA_part_code(i, j), "");
			j++;
		}

		EA_paste_code(EA_code_decompress(code));
		EA_localfiles[i] = EA_get_code();
	}
	EA_choose_localfile(1);
}
