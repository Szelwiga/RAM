var GE_is_locked    = false;
var GE_locked_code  = "";
var GE_last_update  = 0;
var GE_is_launched  = 0;
var GE_green_frame_timeout = 2000;
var GE_lines_cnt    = 0;

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
				<div class="GE-row">
					<div class="GE-linenumber">3</div>
					<input class="GE-label" type="text" placeholder="label"></input><div class="GE-sep"></div>
					<input class="GE-instruction" type="text" placeholder="instruction"></input><div class="GE-sep"></div>
					<input class="GE-argument" type="text" placeholder="argument"></input>&nbsp
					<button class="GE-comment-btn">#</button>
				</div>
				<hr>
				<div class="GE-row">
					<div class="GE-linenumber">4</div>
					<input class="GE-label" type="text" placeholder="label"></input><div class="GE-sep"></div>
					<input class="GE-instruction" type="text" placeholder="instruction"></input><div class="GE-sep"></div>
					<input class="GE-argument" type="text" placeholder="argument"></input>&nbsp
					<button class="GE-comment-btn">#</button>
				</div>
				<hr>
				<div class="GE-row">
					<div class="GE-linenumber">5</div>
					<input class="GE-label" type="text" placeholder="label"></input><div class="GE-sep"></div>
					<input class="GE-instruction" type="text" placeholder="instruction"></input><div class="GE-sep"></div>
					<input class="GE-argument" type="text" placeholder="argument"></input>&nbsp
					<button class="GE-comment-btn">#</button>
				</div>
			</div>
		</div>
		
	`;
	GE_is_launched = 1;
	GE_lines_cnt = 2;
}

function GE_add_line(){

}
