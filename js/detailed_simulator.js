/*
	Author:            Marcel Szelwiga
	Implemented here:  PixelArt RAM machine animator / simulator
*/

var DS_is_launched = 0;
var DS_canvas;
var DS_ctx;

var FPS = 30;

var DS_W; /* canvas width */
var DS_H; /* canvas height */
var DS_P; /* Pixel Size in Pixels :) */
var DS_T = 16; /* Tile size */
var DS_GW; /* width in tiles */
var DS_GH; /* height in tiles */

var DS_board;
var DS_board_objects;

var DS_inactive_color = "#FF2244";
var DS_active_color   = "#22FF44";

var DS_ins = "";
var DS_alu = "";
var DS_ins_color = DS_inactive_color;
var DS_alu_color = DS_inactive_color;
var DS_memory = [];
var DS_reading_input = false;
var DS_writing_output = false;

/* robot */
var DS_robot = { x: 2, y: 2, state: 0, w: 16, h: 18, text: "", text_color: "#FABD2F"};
var DS_robot_states = [
	/* idle */
	[0,  0],
	[16, 0],
	[32, 0],
	[48, 0],

	/* move down */
	[0,  18],
	[16, 18],
	[32, 18],
	[48, 18],

	/* move right */
	[0,  36],
	[16, 36],
	[32, 36],
	[48, 36],

	/* move left */
	[0,  54],
	[16, 54],
	[32, 54],
	[48, 54],

	/* move up */
	[0,  72],
	[16, 72],
	[32, 72],
	[48, 72],
];

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
	DS_memory = [];
	for (var i = 1; i <= RAM_DEFAULT_CACHE_SIZE; i++)
		DS_memory.push([i, undefined, "#FF2244"]);
}

function DS_find_target(t) {
	for (var x = 0; x < DS_GW; x++)
		for (var y = 0; y < DS_GH; y++)
			if (DS_board_objects[x][y].target == t)
				return { x: x, y: y };
	return undefined;
}

function DS_draw_text(x, y, w, h, text, color) {
	text = text.trim();

	let text_width;
	let low = 1, high = h;
	while (low+1 != high) {
		font_size = Math.floor((low + high) / 2);
		DS_ctx.font = font_size + 'px "PixelFont"';
		if (DS_ctx.measureText(text).width > w)
			high = font_size;
		else
			low = font_size;
	}
	font_size = low;

	DS_ctx.font = font_size + 'px "PixelFont"';
	DS_ctx.fillStyle = color;

	x += (w - DS_ctx.measureText(text).width) / 2;
	y -= (h - font_size) / 2 + font_size / 6;

	DS_ctx.fillText(text, x, y);
}

function DS_setPixelated(context){
	context["imageSmoothingEnabled"]       = false; /* standard */
	context["mozImageSmoothingEnabled"]    = false; /* Firefox */
	context["oImageSmoothingEnabled"]      = false; /* Opera */
	context["webkitImageSmoothingEnabled"] = false; /* Safari */
	context["msImageSmoothingEnabled"]     = false; /* IE */
}

function DS_redraw() {
	if (!DS_board) return;

	var SZ = DS_P * DS_T;
	DS_setPixelated(DS_ctx);
	/* draw base board */
	DS_ctx.drawImage(DS_board, 0, 0, DS_W, DS_H);

	/* draw memory boxes */
	/* draw in outs */
	let cnt = 0;
	var memory   = DS_get_with_prefix("M_2");
	var memory_a = DS_get_with_prefix("M_1");
	for (var x = 0; x < DS_GW; x++) {
		for (var y = 0; y < DS_GH; y++) {
			var pos = DS_tile_position(x, y);
			if (DS_board_objects[x][y].type == "input") {
				var img = A_assets[DS_reading_input ? "IN_2" : "IN_1"];
				DS_ctx.drawImage(img, pos.x, pos.y, SZ * 2, SZ * 2);
			}
			if (DS_board_objects[x][y].type == "output") {
				var img = A_assets[DS_writing_output ? "OUT_2" : "OUT_1"];
				DS_ctx.drawImage(img, pos.x, pos.y, SZ * 2, SZ * 2);
			}
			if (DS_board_objects[x][y].type == "memory") {
				var img = memory[DS_board_objects[x][y].version];
				DS_ctx.drawImage(img, pos.x, pos.y, SZ, SZ * 2);
				var text1 = DS_memory[cnt][0];
				var text2 = DS_memory[cnt][1];
				if (text1 == undefined) text1 = "?";
				if (text2 == undefined) text2 = "?";
				DS_draw_text(pos.x + DS_P, pos.y + DS_P * 19, 14 * DS_P, 8 * DS_P, text1 + "", DS_memory[cnt][2]);
				DS_draw_text(pos.x + DS_P, pos.y + DS_P * 30, 14 * DS_P, 8 * DS_P, text2 + "", DS_memory[cnt][2]);
				cnt++;
			}
			if (DS_board_objects[x][y].type == "alu") {
				DS_draw_text(pos.x + DS_P * 8, pos.y + DS_P * 20, 24 * DS_P, 12 * DS_P, DS_alu, DS_alu_color);
			}
			if (DS_board_objects[x][y].type == "ins") {
				DS_draw_text(pos.x + DS_P * 11, pos.y + DS_P * 15, 42 * DS_P, 12 * DS_P, DS_ins, DS_ins_color);
			}
//			if (DS_board_objects[x][y].type == "floor") {
//				DS_ctx.fillRect(pos.x, pos.y, SZ, SZ);
//			}
		}
	}

	/* draw rameide */
	var img = A_assets["rameide"];
	var pos = DS_tile_position(DS_robot.x, DS_robot.y);
	var RSW = DS_robot_states[DS_robot.state][0];
	var RSH = DS_robot_states[DS_robot.state][1];

	DS_ctx.drawImage(img, RSW, RSH, DS_robot.w, DS_robot.h, pos.x, pos.y - 2 * DS_P, SZ, SZ + 2 * DS_P);
	DS_draw_text(pos.x - DS_P * 4, pos.y - DS_P * 1, DS_P * 24, DS_P * 8, DS_robot.text, DS_robot.text_color);
}

setInterval(DS_redraw, 1000 / FPS);

function DS_bfs(sx, sy, dx, dy) {
	var dist = [];
	for (let x = 0; x < DS_GW; x++) {
		let sub_arr = [];
		for (let y = 0; y < DS_GH; y++)
			sub_arr.push(DS_GW * DS_GH);
		dist.push(sub_arr);
	}

	let moves = [
		{x:  1, y:  0, s: "l"},
		{x:  0, y:  1, s: "u"},
		{x: -1, y:  0, s: "r"},
		{x:  0, y: -1, s: "d"},
	];

	let Q = [{x: sx, y: sy, d: 0}];
	while (Q.length != 0) {
		let C = Q.shift();

		if (dist[C.x][C.y] <= C.d)
			continue;

		dist[C.x][C.y] = C.d;
		for (let move of moves) {
			let nx = C.x + move.x;
			let ny = C.y + move.y;

			if (!(0 <= nx && nx < DS_GW && 0 <= ny && ny < DS_GH))
				continue;

			if (DS_board_objects[nx][ny].type == "floor")
				Q.push({x: nx + 0, y: ny + 0, d: C.d + 1});
		}
	}

	if (dist[dx][dy] == DS_GW * DS_GH) {
		N_warn("Internal error: there is no path from robot to its target!");
		return undefined;
	}

	let res = [];
	while (dist[dx][dy] != 0) {
		for (let move of moves) {
			let nx = dx + move.x;
			let ny = dy + move.y;

			if (!(0 <= nx && nx < DS_GW && 0 <= ny && ny < DS_GH))
				continue;

			if (dist[nx][ny] + 1 == dist[dx][dy]) {
				dx = nx; dy = ny;
				res.push(move.s);
				break;
			}
		}
	}
	return res.reverse();
}

async function DS_robot_go(x, y, time) {
	if (DS_robot.x < 0 || DS_robot.x >= DS_GW) DS_robot.x = 1;
	if (DS_robot.y < 0 || DS_robot.y >= DS_GH) DS_robot.x = 1;
	if (DS_board_objects[DS_robot.x][DS_robot.y].type != "floor") {
		DS_robot.x = 1;
		DS_robot.y = 1;
	}

	var shortest_path = DS_bfs(DS_robot.x, DS_robot.y, x, y);

	if (shortest_path.length == 0) {
		await DS_robot_idle(time);
		return;
	}

	var T = (time / shortest_path.length) / 4;
	for (let dir of shortest_path) {
		let cx = DS_robot.x;
		let cy = DS_robot.y;
		let S, nx, ny;
		if (dir == "r") {
			S = 8, nx = cx + 1; ny = cy;
		} else if (dir == "l") {
			S = 12, nx = cx - 1; ny = cy;
		} else if (dir == "d") {
			S = 4, nx = cx; ny = cy + 1;
		} else if (dir == "u") {
			S = 16, nx = cx; ny = cy - 1;
		}

		for (var i = S; i < S + 4; i++) {
			DS_robot.state = i;
			DS_robot.x = nx * ((i-S) / 3.0) + cx * ((3.0 - (i-S)) / 3.0);
			DS_robot.y = ny * ((i-S) / 3.0) + cy * ((3.0 - (i-S)) / 3.0);
			await new Promise(r => setTimeout(r, T));
		}
	}
}
async function DS_robot_idle(time) {
	var T = 200;
	while (T) {
		if (DS_robot.state > 4) {
			DS_robot.state = 0;
		} else {
			DS_robot.state++;
			DS_robot.state %= 4;
		}
		if (time > T) {
			time -= T;
			await new Promise(r => setTimeout(r, T));
		} else {
			await new Promise(r => setTimeout(r, time));
			break;
		}
	}
}

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

	DS_setPixelated(DS_ctx);

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
		DS_board_objects[x][y-1].target = "memory-" + ((x - S + 1) % parseInt(RAM_DEFAULT_CACHE_SIZE));
		DS_board_objects[x][y].type     = "memory";
		DS_board_objects[x][y].version  = RA(0, 2);
		DS_board_objects[x][y+1].type   = "busy";
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
	if (DS_GW >= 14) {
		DS_board_objects[x+2][y+1].target = "input";
	} else {
		DS_board_objects[x+1][y+2].target = "input";
	}
	x = DS_GW - 4; y = 0;
	pos = DS_tile_position(x, y);
	DS_board_objects[x][y].type = "output";
	DS_board_objects[x+1][ y ].type = "busy";
	DS_board_objects[ x ][y+1].type = "busy";
	DS_board_objects[x+1][y+1].type = "busy";
	if (DS_GW >= 14) {
		DS_board_objects[x-1][y+1].target = "output";
	} else {
		DS_board_objects[x][y+2].target   = "output";
	}

	/* draw ins unit */
	x = Math.floor((DS_GW+1)/2) - 2; y = 0;
	pos = DS_tile_position(x, y);
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 2; j++)
			DS_board_objects[x+i][y+j].type = "busy";
	DS_ctx.drawImage(A_assets["INS"], pos.x, pos.y, 4 * SZ, 2 * SZ);
	DS_board_objects[x][y].type = "ins";

	/* draw alu unit */
	x = Math.floor((DS_GW)/2) - 2; y = Math.floor((DS_GH)/2) - 2;
	pos = DS_tile_position(x, y);
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++)
			DS_board_objects[x+i][y+j].type = "busy";

	DS_board_objects[x][y].type = "alu";
	DS_ctx.drawImage(A_assets["ALU"], pos.x, pos.y, 4 * SZ, 4 * SZ);
	DS_board_objects[x][y+4].target = "alu";

	/* draw mem_C unit */
	x = 1; y = Math.floor(DS_GH/2);
	pos = DS_tile_position(x, y);
	for (var i = 0; i < 2; i++)
		for (var j = 0; j < 2; j++)
			DS_board_objects[x+i][y+j].type = "busy";
	DS_ctx.drawImage(A_assets["MEM_C"], pos.x, pos.y, 2 * SZ, 2 * SZ);
	DS_board_objects[x+1][y-1].target = "cache";

	var blob = await new Promise((resolve) => { DS_canvas.toBlob(resolve); });
	var bitmap = await createImageBitmap(blob);

	DS_board = bitmap;
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

function DS_update_memory(mem) {
	for (var i = 0; i < mem.length; i++)
		for (var j = 0; j < 2; j++)
			DS_memory[i][j] = mem[i][j];
}
