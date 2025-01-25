var A_assets_ready = false;
var A_assets = {};
var A_key_list = [];
function A_load_asset(name) {
	var img = document.createElement("IMG");
	img.src = "assets/" + name + ".png";
	A_assets[name] = img;
	A_key_list.push(name);
	document.getElementById("A-assets-div").appendChild(img);
}

async function A_load_all_assets(){
	/* floor circles */
	A_load_asset("C1");
	A_load_asset("C1A");
	A_load_asset("C1B");
	A_load_asset("C2");
	A_load_asset("C2A");
	A_load_asset("C3");
	A_load_asset("C3A");
	A_load_asset("C3B");
	A_load_asset("C4");
	A_load_asset("C4A");
	A_load_asset("C4B");

	/* floor tiles */
	A_load_asset("D_1A");
	A_load_asset("D_1B");
	A_load_asset("D_1C");
	A_load_asset("D_1D");
	A_load_asset("K_1D");
	A_load_asset("K_1E");
	A_load_asset("K_1J");
	A_load_asset("T_1A");
	A_load_asset("T_1B");
	A_load_asset("T_1C");
	A_load_asset("T_1F");
	A_load_asset("T_1K");
	
	/* memory cells */
	A_load_asset("M_1A");
	A_load_asset("M_1B");
	A_load_asset("M_1C");
	A_load_asset("M_2A");
	A_load_asset("M_2B");
	A_load_asset("M_2C");

	/* walls */
	A_load_asset("W_1");
	A_load_asset("W_1A");
	A_load_asset("W_1B");
	A_load_asset("W_1D");
	A_load_asset("W_1E");
	A_load_asset("W_1F");
	A_load_asset("W_2");
	A_load_asset("W_3");
	A_load_asset("W_4");
	A_load_asset("W_5");
	A_load_asset("W_6A");
	A_load_asset("W_6B");
	A_load_asset("W_6C");
	A_load_asset("W_6D");
	A_load_asset("W_6E");
	A_load_asset("W_6F");

	/* in outs */
	A_load_asset("IN_1");
	A_load_asset("IN_2");
	A_load_asset("OUT_1");
	A_load_asset("OUT_2");

	/* instruction */
	A_load_asset("INS");

	/* instruction */
	A_load_asset("ALU");

	/* cache R */
	A_load_asset("MEM_C");
	

	while (true) {
		var success = true;
		for (var i of A_key_list)
			if (!A_assets[i].complete)
				success = false;
		if (success)
			break;
	    await new Promise(r => setTimeout(r, 300));
	}
    A_assets_ready = true;
}

