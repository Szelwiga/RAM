/*
	Author:            Marcel Szelwiga
	Implemented here:  PixelArt RAM machine animator / simulator
*/

var DS_is_launched = 0;
var DS_canvas;
var DS_ctx;

var DS_W; /* canvas width */
var DS_H; /* canvas height */
var DS_P; /* Pixel Size in Pixels :) */
var DS_T = 16; /* Tile size */
var DS_GW; /* width in tiles */
var DS_GH; /* height in tiles */

var DS_board;
var DS_board_objects;

function RA(x, y) {
	return Math.floor(Math.random() * (y - x + 1)) + x;
}

var DS_versions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function DS_tile_position(x, y) {
	return {"x": x * DS_T * DS_P, "y": DS_T * DS_P * y};
}


async function DS_init(){
	document.getElementById("right-div").innerHTML = `
		<div id="DS-frame">
			<div class="DS-inout-wrap">
				<textarea id="DS-input" placeholder="Program input ..."></textarea>
				<pre id="DS-counters"></pre>
				<textarea id="DS-output" placeholder="Program output ..." readonly></textarea>
			</div>
			<hr>
			<canvas id="DS-canvas" crossorigin="anonymous"></canvas>
		</div>
	`;

	DS_canvas = document.getElementById("DS-canvas");
	DS_ctx = DS_canvas.getContext("2d");

	DS_is_launched = 1;
	PS_is_launched = 0;
	DS_set_counters(0, 0, 0);
	DS_window_resize();
}

function setPixelated(context){
	context["imageSmoothingEnabled"]       = false; /* standard */
	context["mozImageSmoothingEnabled"]    = false; /* Firefox */
	context["oImageSmoothingEnabled"]      = false; /* Opera */
	context["webkitImageSmoothingEnabled"] = false; /* Safari */
	context["msImageSmoothingEnabled"]     = false; /* IE */
}

function DS_redraw(){
	if (!DS_board) return;

	var SZ = DS_P * DS_T;
	setPixelated(DS_ctx);
	/* draw base board */
	DS_ctx.drawImage(DS_board, 0, 0, DS_W, DS_H);
	
	/* draw memory boxes */
	var memory   = DS_get_with_prefix("M_2");
	var memory_a = DS_get_with_prefix("M_1");
	for (var x = 0; x < DS_GW; x++) {
		for (var y = 0; y < DS_GH; y++) {
			if (DS_board_objects[x][y].type == "memory") {
				var pos = DS_tile_position(x, y);
				var img = memory[DS_board_objects[x][y].version];

				DS_ctx.drawImage(img, pos.x, pos.y, SZ, SZ * 2);
			}
		}
	}

	/* draw in outs */
	for (var x = 0; x < DS_GW; x++) {
		for (var y = 0; y < DS_GH; y++) {
			var pos = DS_tile_position(x, y);
			if (DS_board_objects[x][y].type == "input") {
				var img = A_assets["IN_1"];
				DS_ctx.drawImage(img, pos.x, pos.y, SZ * 2, SZ * 2);				
			}
			if (DS_board_objects[x][y].type == "output") {
				var img = A_assets["OUT_1"];
				DS_ctx.drawImage(img, pos.x, pos.y, SZ * 2, SZ * 2);				
			}
		}
	}
}
setInterval(DS_redraw, 100);

function DS_get_with_prefix(name) {
	var res = [];
	for (var i of DS_versions)
		if (A_assets[name + i] != undefined)
			res.push(A_assets[name + i]);
	if (A_assets[name] != undefined)
		res.push(A_assets[name]);

	return res;
}

async function DS_gen_board() {
    while (!A_assets_ready)
		await new Promise(r => setTimeout(r, 100));

	setPixelated(DS_ctx);

	/* draw random tiles on the floor */
	var noise = deNoise(generatePerlinNoise(DS_GW, DS_GH, generatePermutation()), [0.44, 0.57]);
	let arr = [DS_get_with_prefix("T_1"), DS_get_with_prefix("K_1"), DS_get_with_prefix("D_1")];

	var SZ = DS_T * DS_P;

	for (var x = 0; x < DS_GW; x++) {
		for (var y = 0; y < DS_GH; y++) {
			var img = arr[noise[x][y]][RA(0, arr[noise[x][y]].length-1)];
			var pos = DS_tile_position(x, y);
			DS_ctx.drawImage(img, pos.x, pos.y, SZ, SZ);
		}
	}

	/* draw circles somewhere*/
	arr = [DS_get_with_prefix("C1"), DS_get_with_prefix("C2"), DS_get_with_prefix("C3"), DS_get_with_prefix("C4")];

	for (var i = 0; i <= (DS_GW * DS_GH * 0.2); i += 4) {

		var x = RA(0, DS_GW - 1);
		var y = RA(0, DS_GH - 1);
		var pos = DS_tile_position(x, y);

		DS_ctx.drawImage(arr[0][RA(0, arr[0].length-1)], pos.x,      pos.y,      SZ, SZ);
		DS_ctx.drawImage(arr[2][RA(0, arr[2].length-1)], pos.x,      pos.y + SZ, SZ, SZ);
		DS_ctx.drawImage(arr[1][RA(0, arr[1].length-1)], pos.x + SZ, pos.y,      SZ, SZ);
		DS_ctx.drawImage(arr[3][RA(0, arr[3].length-1)], pos.x + SZ, pos.y + SZ, SZ, SZ);		
	}

	/* generate the grid */
	DS_board_objects = [];
	for (var x = 0; x < DS_GW; x++) {
		let sub_arr = [];
		for (var y = 0; y < DS_GH; y++)
			sub_arr.push({ type: "floor" });
		DS_board_objects.push(sub_arr);
	}

	/* insert memory boxes */
	let S = Math.floor((DS_GW - 10) / 2);
	for (var x = S; x < S + parseInt(RAM_DEFAULT_CACHE_SIZE); x++) {
		var y = DS_GH - 2;
		DS_board_objects[x][y].type    = "memory";
		DS_board_objects[x][y].version = RA(0, 2);
		DS_board_objects[x][y+1].type  = "busy";
	}

	/* generate horizontal frame */
	arr = DS_get_with_prefix("W_1");
	for (var y of [0, DS_GH-1]){
		for (var x = 1; x < DS_GW - 1; x++) {
			if (DS_board_objects[x][y].type == "floor") {

				var pos = DS_tile_position(x, y);
				DS_ctx.drawImage(arr[RA(0, arr.length-1)], pos.x, pos.y, SZ, SZ);
        		DS_board_objects[x][y].type = "wall";
			}
		}
	}

    pos = DS_tile_position(0, DS_GH-1);
    DS_ctx.drawImage(A_assets["W_2"], pos.x, pos.y, SZ, SZ);
    DS_board_objects[x][y].type = "wall";

    pos = DS_tile_position(DS_GW-1, DS_GH-1);
    DS_ctx.drawImage(A_assets["W_3"], pos.x, pos.y, SZ, SZ);
    DS_board_objects[x][y].type = "wall";

    pos = DS_tile_position(0, 0);
    DS_ctx.drawImage(A_assets["W_4"], pos.x, pos.y, SZ, SZ);
    DS_board_objects[x][y].type = "wall";

    pos = DS_tile_position(DS_GW-1, 0);
    DS_ctx.drawImage(A_assets["W_5"], pos.x, pos.y, SZ, SZ);
    DS_board_objects[x][y].type = "wall";

	arr = DS_get_with_prefix("W_6");
	for (var x of [0, DS_GW-1]){
		for (var y = 1; y < DS_GH - 1; y++) {
			if (DS_board_objects[x][y].type == "floor") {

				var pos = DS_tile_position(x, y);
				DS_ctx.drawImage(arr[RA(0, arr.length-1)], pos.x, pos.y, SZ, SZ);
        		DS_board_objects[x][y].type = "wall";
			}
		}
	}

    /* draw memory outline */
   	DS_ctx.fillStyle = "#181425";
	for (var x = 1; x < DS_GW - 1; x++) {
		for (var y = 1; y < DS_GH - 1; y++) {
		    var pos = DS_tile_position(x, y);
			if (DS_board_objects[x][y+1].type == "memory")
			    DS_ctx.fillRect(pos.x - DS_P, pos.y + SZ - DS_P, SZ + 2 * DS_P, DS_P);
			if (DS_board_objects[x+1][y].type == "memory")
			    DS_ctx.fillRect(pos.x + SZ - DS_P, pos.y, DS_P, SZ);
			if (DS_board_objects[x-1][y].type == "memory")
			    DS_ctx.fillRect(pos.x, pos.y, DS_P, SZ);
		}
	}

	/* draw in out */
	x = 2; y = 0;
	pos = DS_tile_position(x, y);
	DS_board_objects[x][y].type = "input";
	DS_board_objects[x+1][ y ].type = "busy";
	DS_board_objects[ x ][y+1].type = "busy";
	DS_board_objects[x+1][y+1].type = "busy";
	if (DS_GW >= 14)
		DS_board_objects[x+2][y+1].target = "input";
	else
		DS_board_objects[x+1][y+2].target = "input";

	x = DS_GW - 4; y = 0;
	pos = DS_tile_position(x, y);
	DS_board_objects[x][y].type = "output";
	DS_board_objects[x+1][ y ].type = "busy";
	DS_board_objects[ x ][y+1].type = "busy";
	DS_board_objects[x+1][y+1].type = "busy";
	if (DS_GW >= 14)
		DS_board_objects[x-1][y+1].target = "output";
	else
		DS_board_objects[x][y+2].target   = "output";

	/* draw ins unit */
	x = Math.floor((DS_GW+1)/2) - 2; y = 0;
	pos = DS_tile_position(x, y);
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 2; j++)
			DS_board_objects[x+i][y+j].type = "busy";
	DS_ctx.drawImage(A_assets["INS"], pos.x, pos.y, 4 * SZ, 2 * SZ);

	/* draw alu unit */
	x = Math.floor((DS_GW)/2) - 2; y = Math.floor((DS_GH)/2) - 2;
	pos = DS_tile_position(x, y);
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++)
			DS_board_objects[x+i][y+j].type = "busy";
	DS_ctx.drawImage(A_assets["ALU"], pos.x, pos.y, 4 * SZ, 4 * SZ);
	DS_board_objects[x][y+4].target = "alu";

	/* draw ins unit */
	
	x = 1; y = Math.floor(DS_GH/2);
	pos = DS_tile_position(x, y);
	for (var i = 0; i < 2; i++)
		for (var j = 0; j < 2; j++)
			DS_board_objects[x+i][y+j].type = "busy";
	DS_ctx.drawImage(A_assets["MEM_C"], pos.x, pos.y, 2 * SZ, 2 * SZ);
	DS_board_objects[x+3][y].target = "alu";

	var blob = await new Promise((resolve) => { DS_canvas.toBlob(resolve); });
	var bitmap = await createImageBitmap(blob);

	DS_board = bitmap;
}
						
function DS_dummy_event_play(e) {

	DS_canvas.width  = DS_canvas.offsetWidth;
	DS_canvas.height = DS_canvas.offsetHeight;

	DS_ctx.font = "40px Arial";
	DS_ctx.fillText(e, 10, 80);

//	DS_gen_board();
}

function DS_get_input() {
	return document.getElementById("DS-input").value;
}
function DS_set_output(out) {
	return document.getElementById("DS-output").value = out;
}
function DS_set_input(inp) {
	return document.getElementById("DS-input").value = inp;
}

function DS_color_output(color) {
	document.getElementById("DS-output").style.borderColor = color;
	document.getElementById("DS-output").style.color       = color;
}

function DS_set_counters(mem, time, ins) {
	var text = "";
	if (window.innerWidth <= G_min_width_viewport){
		document.getElementById("DS-counters").style.fontSize   = "10pt";
		document.getElementById("DS-counters").style.lineHeight = "11pt";
	} else {
		document.getElementById("DS-counters").style.fontSize   = "16pt";
		document.getElementById("DS-counters").style.lineHeight = "17pt";
	}

	var text = "";
	if (window.innerHeight >= 800 && window.innerWidth > G_min_width_viewport)
		text += "Counters";
	text += "Instructions: " + ins + "<br>";
	text += "Time:         " + time + "<br>";
	text += "Memory:       " + mem;
	text += "</pre>";
	text = text.replaceAll("Counters", PS_color("Counters", "--light_purple"));
	document.getElementById("DS-counters").innerHTML = text;
}

function DS_set_alu(value, state, error) {
	N_notify("Not implemented!");
}
function DS_set_instruction(instruction, event) {
	N_notify("Not implemented!");
}
function DS_set_memory(mem) {
	N_notify("Not implemented!");
}
function DS_clear() {
	N_notify("Not implemented!");
}
function DS_set_frame_color(color) {
	N_notify("Not implemented!");
	document.getElementById("DS-frame").style.borderColor = color;
}

var DS_window_update_cnt = 0;

async function DS_window_resize() {
	if (DS_is_launched) {
		DS_window_update_cnt++;

		DS_canvas.width        = "auto";
		DS_canvas.offsetWidth  = "auto";
		DS_canvas.height       = "auto";
		DS_canvas.offsetHeight = "auto";

		await new Promise(r => setTimeout(r, 300));

		DS_window_update_cnt--;
		if (DS_window_update_cnt == 0) {
			DS_canvas.width  = DS_canvas.offsetWidth;
			DS_canvas.height = DS_canvas.offsetHeight;

			DS_W = DS_canvas.width;
			DS_H = DS_canvas.height;

			DS_update_dims();
		}
	}
}
window.onresize = DS_window_resize;

function DS_update_dims(){
	for (var P = 1; P <= 30; P += 0.25)
		if (DS_W / (DS_T * P) >= 12 && DS_H / (DS_T * P) >= 10 && Math.floor(DS_W / (DS_T * P)) % 2 == 0)
			DS_P = P;

	DS_GW = Math.floor(DS_W / (DS_T * DS_P));
	DS_GH = Math.floor(DS_H / (DS_T * DS_P));

	DS_W = (DS_T * DS_P) * DS_GW;
	DS_H = (DS_T * DS_P) * DS_GH;

	DS_canvas.width  = DS_W;
	DS_canvas.height = DS_H;
	DS_gen_board();
}
