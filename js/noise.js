// Funkcja do generowania szumu Perlin'a
function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
  return a + t * (b - a);
}

function grad(hash, x, y) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : (h === 12 || h === 14 ? x : 0);
  return (h & 1 ? -u : u) + (h & 2 ? -v : v);
}

function perlinNoise(x, y, p) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  const u = fade(x);
  const v = fade(y);
  
  const aa = p[X + p[Y]] % 256;
  const ab = p[X + p[Y + 1]] % 256;
  const ba = p[X + 1 + p[Y]] % 256;
  const bb = p[X + 1 + p[Y + 1]] % 256;
  
  const x1 = lerp(grad(aa, x, y), grad(ba, x - 1, y), u);
  const x2 = lerp(grad(ab, x, y - 1), grad(bb, x - 1, y - 1), u);
  
  return lerp(x1, x2, v);
}

function generatePerlinNoise(n, m, p) {
  const noiseArray = [];
  for (let i = 0; i < n; i++) {
    noiseArray[i] = [];
    for (let j = 0; j < m; j++) {
      // Normalizujemy współrzędne, aby nie były równe 0.5 w pierwszej kolumnie
      noiseArray[i][j] = (perlinNoise(i / n * 4, j / m * 4, p) + 1) / 2; // Skala do [0, 1]
    }
  }
  return noiseArray;
}

// Generowanie tablicy perlin noise
function generatePermutation() {
  const p = [];
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 0; i < 256; i++) {
    const j = Math.floor(Math.random() * 256);
    [p[i], p[j]] = [p[j], p[i]];
  }
  return [...p, ...p]; // Podwajamy, żeby uniknąć problemów z indeksowaniem
}

function deNoise(arr, S){
	for (var x = 0; x < arr.length; x++) {
		for (var y = 0; y < arr[x].length; y++) {
			var best = S.length;
			for (var i = S.length-1; i >= 0; i--)
				if (S[i] > arr[x][y])
					best = i;
			arr[x][y] = best;
		}
	}

	return arr;
}

