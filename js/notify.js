
var N_warning_duration = 3000;
var N_notify_duration  = 1500;

var N_warn_time   = 0;
var N_notify_time = 0;
var N_info_time   = 0;

function N_update() {
	var W = document.getElementById("N-warn");
	var N = document.getElementById("N-notify");
	var D = Date.now();

	if (N_warn_time   < D) W.style.visibility = "hidden";
	if (N_notify_time < D) N.style.visibility = "hidden";
}

setInterval(N_update, 100);

function N_warn(msg) {
	var W = document.getElementById("N-warn");
	N_warn_time = Date.now() + N_warning_duration;
	W.style.visibility = "visible"; W.innerHTML = msg;
}

function N_notify(msg) {
	var N = document.getElementById("N-notify");
	N_notify_time = Date.now() + N_notify_duration;
	N.style.visibility = "visible"; N.innerHTML = msg;
}

function N_info(msg) {
	var N = document.getElementById("N-info");
	N.style.visibility = "visible"; N.innerHTML = msg;
	
}

function N_info_clear(){
	document.getElementById("N-info").style.visibility = "hidden";
}

/* TODO uncomment, */
//window.onload = function() {
//    window.addEventListener("beforeunload", function (e) {
//        var confirmationMessage = 'Open codes will disappear after this action.'
//        (e || window.event).returnValue = confirmationMessage;
//        return confirmationMessage;
//    });
//};
