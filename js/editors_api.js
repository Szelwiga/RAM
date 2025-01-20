var EA_localfiles        = {};
var EA_current_editor    = S_get_preffered_editor();
var EA_current_localfile = 0;

function EA_choose_localfile(x) {
	EA_localfiles[EA_current_localfile] = EA_get_code();
	EA_paste_code(EA_localfiles[x]);
	EA_current_localfile = x;
	EA_regenerate_buttons();
	N_notify("Opened file " + x)
}

function EA_init(x) {
	if (EA_current_editor == "GE") GE_set_up();
	else                           PE_set_up();

	EA_localfiles[x]     = "";
	EA_current_localfile = x;
	EA_regenerate_buttons();
}

function EA_paste_code(code) {
	if (EA_current_editor == "GE") GE_paste_code(code);
	else                           PE_paste_code(code);
}

function EA_get_code() {
	if (EA_current_editor == "GE") return GE_get_code();
	else                           return PE_get_code();
}

function EA_lock() {
	if (EA_current_editor == "GE") GE_lock();
	else                           PE_lock();
}

function EA_unlock() {
	if (EA_current_editor == "GE") GE_unlock();
	else                           PE_unlock();
}

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

function BTN_copy() {
	navigator.clipboard.writeText(EA_get_code());
	N_notify("Copied to clipboard");
}

function BTN_editor_upload() {
	document.getElementById("EA_code_uploader").click();
}
async function EA_load_file(){
	EA_paste_code(await document.getElementById("EA_code_uploader").files[0].text());
	N_notify("Opened file");
}

function BTN_editor_new() {
	EA_localfiles[EA_current_localfile] = EA_get_code();
	var i = 1;
	while (i in EA_localfiles) i++;
	EA_init(i);
	N_notify("File " + i + " created");
}

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

/* TODO: rearange btn's on small screen css :/ */
