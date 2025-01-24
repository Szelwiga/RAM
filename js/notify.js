/*
	Author:            Marcel Szelwiga
	Implemented here:  Small notification agent
*/

var N_warning_duration = 5000;
var N_notify_duration  = 3000;
var N_info_time        = 2000;

function N_hash(msg) {
    var res = 0;
    for (var i = 0; i < msg.length; i++) 
        res = ((res << 5) - res + msg.charCodeAt(i)) | 0;
    return res;
}

async function N_universal(msg, type, play_time) {
	var id = "N-" + type + "-" + N_hash(msg);

	if (document.getElementById(id))
		return;

	var B = document.getElementById("N-notify-box");
	var notification = document.createElement("DIV");

	notification.id = id;
	notification.className = "N-" + type;
	notification.innerHTML = msg;

	B.appendChild(notification);
	await new Promise(r => setTimeout(r, play_time));
	B.removeChild(notification);
}

function N_warn(msg) {
	N_universal(msg, "warn", N_warning_duration);
}

function N_notify(msg) {
	N_universal(msg, "notify", N_notify_duration);
}

function N_info(msg) {
	if (S_show_help)
		N_universal(msg, "info", N_info_time);
}
