var LD_levels = [
	{
		/* group / level */
		group: "A",
		level: 1,

		/* task image */
		image:    "1-factory.png",

		/* task title */
		title_pl: "Wypisz wejście",
		title_en: "Output the input",

		/* limits */
		memory_limit:      10,
		instruction_limit: 10,
		time_limit:        100,
		
		/* task description */
		desc_pl: `Pierwsze wyzwanie robota Rameide powinno być proste, tak jest i tym razem. 
		Robot postanowił spróbować swoich sił w zadaniu, które wydaje się być łatwe. 
		Ma za zadanie wypisać na wyjście liczbę całkowitą podaną na wejściu. 
		Wystarczy użyć instrukcji <pre>read</pre> oraz <pre>write</pre>, a Rameide z pewnością sobie z tym poradzi!`,

		desc_en: `Robot Rameide's first challenge should be simple, and that's the case this time as well. 
		Rameide decided to test his skills with a task that seems easy. 
		He is supposed to print the integer given in the input to the output. 
		All he needs to do is use the <pre>read</pre> and <pre>write</pre> instructions, and Rameide will surely manage it!`,

		/* tests */
		tests: [
			{ num: 0, in: [3],       out: [3],       hidden: false },
			{ num: 1, in: [2],       out: [2],       hidden: false },
			{ num: 2, in: [4],       out: [4],       hidden: false },
			{ num: 3, in: [-10],     out: [-10],     hidden: false },
			{ num: 4, in: [42],      out: [42],      hidden: false },
			{ num: 5, in: [1048576], out: [1048576], hidden: false },
			{ num: 6, in: [69],      out: [69],      hidden: true },
			{ num: 7, in: [-420],    out: [-420],    hidden: true },
			{ num: 8, in: [101010],  out: [101010],  hidden: true },
			{ num: 9, in: [29834],   out: [29834],   hidden: true },
		]
	},
	{
		/* group / level */
		group: "A",
		level: 2,

		/* task image */
		image:    "2-factory.png",

		/* task title */
		title_pl: "Odwróć mały ciąg",
		title_en: "Reverse short sequence",

		/* limits */
		memory_limit:      10,
		instruction_limit: 10,
		time_limit:        100,
		
		/* task description */
		desc_pl: `Robot Rameide zawsze uwielbiał wyzwania związane z porządkowaniem rzeczy, ale to zadanie go trochę zaskoczyło. 
		Tym razem nie chodzi o porządkowanie według wielkości, lecz o... odwrócenie kolejności! 
		Rameide musi odwrócić ciąg trzech liczb, który otrzyma na wejściu. 
		Na początku dostał trzy liczby całkowite <pre>A</pre>, <pre>B</pre> i <pre>C</pre>, ale żeby nie było zbyt łatwo, 
		teraz jego zadaniem jest wypisać te liczby w odwrotnej kolejności: <pre>C</pre>, <pre>B</pre>, <pre>A</pre>.
		Robot zastanawia się, jak rozwiązać ten problem. Na szczęście, z pomocą instrukcji <pre>read</pre> i <pre>write</pre> 
		da sobie radę i zrobi to szybko!`,

		desc_en: `Robot Rameide has always loved challenges related to sorting things, but this task took him by surprise. 
		This time it's not about sorting by size, but rather... reversing the order! 
		Rameide has to reverse the sequence of three numbers he gets as input. 
		At first, he receives three integers <pre>A</pre>, <pre>B</pre>, and <pre>C</pre>, but to make it a little more interesting, 
		his task is to print these numbers in reverse order: <pre>C</pre>, <pre>B</pre>, <pre>A</pre>.
		The robot wonders how to solve this problem. Luckily, with the help of the <pre>read</pre> and <pre>write</pre> instructions, 
		he will manage it quickly!`,

		/* tests */
		tests: [
			{ num: 0, in: [1, 2, 3],                 out: [3, 2, 1],                hidden: false },
			{ num: 1, in: [2, 3, 4],                 out: [4, 3, 2],                hidden: false },
			{ num: 2, in: [10, 9, 8],                out: [8, 9, 10],               hidden: false },
			{ num: 3, in: [123, 123, 123],           out: [123, 123, 123],          hidden: false },
			{ num: 4, in: [-10, 0, 10],              out: [10, 0, -10],             hidden: false },
			{ num: 5, in: [100, 101, 100],           out: [100, 101, 100],          hidden: false },
			{ num: 6, in: [69, 42, 81],              out: [81, 42, 69],             hidden: true },
			{ num: 7, in: [-420, 21, 37],            out: [37, 21, -420],           hidden: true },
			{ num: 8, in: [1000000, 10000, 100000],  out: [100000, 10000, 1000000], hidden: true },
			{ num: 9, in: [4, 1, 3],                 out: [3, 1, 4],                hidden: true },
		]
	},

	{
		/* group / level */
		group: "A",
		level: 3,

		/* task image */
		image:    "3-factory.png",

		/* task title */
		title_pl: "Dodawanie",
		title_en: "Addition",

		/* limits */
		memory_limit:      10,
		instruction_limit: 10,
		time_limit:        100,
		
		/* task description */
		desc_pl: `Robot Rameide znalazł się przed kolejnym wyzwaniem. Tym razem nie chodzi o sortowanie ani odwracanie liczb, 
		ale o coś bardziej intuicyjnego - dodawanie liczb! Rameide wie, że to zadanie nie sprawi mu większych trudności, 
		bo wystarczy dodać dwie liczby: <pre>A</pre> i <pre>B</pre>. Na wejściu robot otrzymuje dwie liczby, 
		a na wyjściu wystarczy obliczyć ich sumę <pre>A + B</pre>. Rameide nie może się doczekać, 
		aby wykorzystać swoją wiedzę o instrukcjach <pre>read</pre> i <pre>write</pre>, by rozwiązać to zadanie i pokazać, 
		że dodawanie to dla niego bułka z masłem!`,

		desc_en: `Robot Rameide is facing another challenge. This time it's not about sorting or reversing numbers, 
		but something more intuitive – adding numbers! Rameide knows that this task won't be too difficult, 
		because all he needs to do is add two numbers: <pre>A</pre> and <pre>B</pre>. He receives two numbers as input, 
		and all he has to do is calculate their sum <pre>A + B</pre>. Rameide can't wait to use his knowledge of the 
		<pre>read</pre> and <pre>write</pre> instructions to solve this task and show that adding numbers is a piece of cake!`,

		/* tests */
		tests: [
			{ num: 0, in: [1, 2],           out: [1+2],           hidden: false },
			{ num: 1, in: [2, 3],           out: [2+3],           hidden: false },
			{ num: 2, in: [10, 9],          out: [10+9],          hidden: false },
			{ num: 3, in: [123, 1233],      out: [123+1233],      hidden: false },
			{ num: 4, in: [-10, 0],         out: [-10+0],         hidden: false },
			{ num: 5, in: [100, 10],        out: [100+10],        hidden: false },
			{ num: 6, in: [69, 42],         out: [42+69],         hidden: true },
			{ num: 7, in: [-420, 21],       out: [21-420],        hidden: true },
			{ num: 8, in: [1000000, 10000], out: [10000+1000000], hidden: true },
			{ num: 9, in: [4, 1],           out: [1+4],           hidden: true },
		]
	},

	{
		/* group / level */
		group: "A",
		level: 4,

		/* task image */
		image:    "4-factory.png",

		/* task title */
		title_pl: "Wypisz wejście",
		title_en: "Output the input",

		/* limits */
		memory_limit:      10,
		instruction_limit: 10,
		time_limit:        100,
		
		/* task description */
		desc_pl: `Robot Rameide został postawiony przed wyzwaniem, które wydaje się łatwe, ale wymaga trochę myślenia. 
		Tym razem jego zadaniem jest wypisać liczbę, którą otrzyma na wejściu, ale z pewną modyfikacją – pomniejszoną o 16! 
		Na początku dostaje liczbę <pre>X</pre>, ale zamiast po prostu ją wypisać, musi ją najpierw zmniejszyć o 16. 
		Rameide zastanawia się, jak wykonać tę operację, ale przypomina sobie, że z pomocą instrukcji <pre>read</pre> i <pre>write</pre> 
		z łatwością poradzi sobie z tym zadaniem, licząc <pre>X - 16</pre> i wypisując wynik.`,

		desc_en: `Robot Rameide has been given a challenge that seems simple, but requires a bit of thinking. 
		This time, his task is to print the number he receives as input, but with a modification – reduced by 16! 
		At first, he gets a number <pre>X</pre>, but instead of just printing it, he needs to subtract 16 from it first. 
		Rameide is wondering how to perform this operation, but he remembers that with the help of the <pre>read</pre> and <pre>write</pre> instructions, 
		he will easily manage to solve this task, calculating <pre>X - 16</pre> and printing the result.`,


		/* tests */
		tests: [
			{ num: 0, in: [32],      out: [32-16],       hidden: false },
			{ num: 1, in: [2],       out: [2-16],       hidden: false },
			{ num: 2, in: [4],       out: [4-16],       hidden: false },
			{ num: 3, in: [-10],     out: [-10-16],     hidden: false },
			{ num: 4, in: [42],      out: [42-16],      hidden: false },
			{ num: 5, in: [1048576], out: [1048576-16], hidden: false },
			{ num: 6, in: [69],      out: [69-16],      hidden: true },
			{ num: 7, in: [-420],    out: [-420-16],    hidden: true },
			{ num: 8, in: [101010],  out: [101010-16],  hidden: true },
			{ num: 9, in: [29834],   out: [29834-16],   hidden: true },
		]
	},

	{
		/* group / level */
		group: "A",
		level: 5,

		/* task image */
		image:    "5-factory.png",

		/* task title */
		title_pl: "Wyrażenie",
		title_en: "Expression",

		/* limits */
		memory_limit:      10,
		instruction_limit: 10,
		time_limit:        100,
		
		/* task description */
		desc_pl: `Robot Rameide stoi teraz przed nowym wyzwaniem. Ma przed sobą trzy liczby: <pre>A</pre>, <pre>B</pre> i <pre>C</pre>, 
		ale tym razem nie wystarczy ich po prostu wypisać. Musi obliczyć wynik wyrażenia <pre>A - B + C</pre>! 
		Rameide trochę się zastanawia, ale przypomina sobie, że z pomocą odpowiednich instrukcji <pre>read</pre> i <pre>write</pre> 
		z łatwością poradzi sobie z takim zadaniem. Wystarczy tylko dobrze odczytać liczby, wykonać odpowiednie obliczenia 
		i wyświetlić wynik! Czas na rozwiązanie tego wyzwania!`,

		desc_en: `Robot Rameide is now facing a new challenge. He has three numbers in front of him: <pre>A</pre>, <pre>B</pre>, and <pre>C</pre>, 
		but this time, it's not enough to just print them. He needs to calculate the result of the expression <pre>A - B + C</pre>! 
		Rameide pauses for a moment, but then remembers that with the help of the <pre>read</pre> and <pre>write</pre> instructions, 
		he can easily handle this task. All he needs to do is correctly read the numbers, perform the calculations, 
		and print the result! Time to solve this challenge!`,

		/* tests */
		tests: [
			{ num: 0, in: [1, 2, 3],                 out: [3-2+1],                hidden: false },
			{ num: 1, in: [2, 3, 4],                 out: [4-3+2],                hidden: false },
			{ num: 2, in: [10, 9, 8],                out: [8-9+10],               hidden: false },
			{ num: 3, in: [123, 123, 123],           out: [123-123+123],          hidden: false },
			{ num: 4, in: [-10, 0, 10],              out: [10-0-10],              hidden: false },
			{ num: 5, in: [100, 101, 100],           out: [100-101+100],          hidden: false },
			{ num: 6, in: [69, 42, 81],              out: [81-42+69],             hidden: true },
			{ num: 7, in: [-420, 21, 37],            out: [37-21-420],            hidden: true },
			{ num: 8, in: [1000000, 10000, 100000],  out: [100000-10000+1000000], hidden: true },
			{ num: 9, in: [4, 1, 3],                 out: [3-1+4],                hidden: true },
		]
	},
	{
		/* group / level */
		group: "A",
		level: 6,

		/* task image */
		image:    "6-factory.png",

		/* task title */
		title_pl: "Dzielenie",
		title_en: "Division",

		/* limits */
		memory_limit:      10,
		instruction_limit: 10,
		time_limit:        100,
		
		/* task description */
		desc_pl: `Robot Rameide zmaga się z kolejnym wyzwaniem. Tym razem stoi przed trudnym wyrażeniem, w którym musi obliczyć 
		wartość wyrażenia <pre>A / (B * B)</pre>. Rameide ma przed sobą dwie liczby: <pre>A</pre> i <pre>B</pre>, ale nie jest pewien, 
		jak je ze sobą połączyć, żeby uzyskać wynik. W końcu przypomina sobie, że wystarczy pomnożyć <pre>B</pre> przez siebie, 
		a potem podzielić <pre>A</pre> przez wynik. Z pomocą odpowiednich instrukcji <pre>read</pre> i <pre>write</pre>, 
		Rameide oblicza wartość wyrażenia i wypisuje wynik.`,

		desc_en: `Robot Rameide is facing another challenge. This time, he needs to calculate the value of the expression <pre>A / (B * B)</pre>. 
		Rameide has two numbers in front of him: <pre>A</pre> and <pre>B</pre>, but he's not quite sure how to combine them to get the result. 
		Then he remembers that he just needs to multiply <pre>B</pre> by itself and then divide <pre>A</pre> by that result. 
		With the help of the <pre>read</pre> and <pre>write</pre> instructions, Rameide calculates the value of the expression and prints the result.`,

		/* tests */
		tests: [
			{ num: 0, in: [24, 2],          out: [24 / (2 * 2)],          hidden: false },
			{ num: 1, in: [18, 3],          out: [18 / (3 * 3)],          hidden: false },
			{ num: 2, in: [100, 5],         out: [100 / (5 * 5)],         hidden: false },
			{ num: 3, in: [25, 5],          out: [25 / (5 * 5)],          hidden: false },
			{ num: 4, in: [-20, 2],         out: [-20 / (2 * 2)],         hidden: false },
			{ num: 5, in: [1024, 4],        out: [1024 / (4 * 4)],        hidden: false },
			{ num: 6, in: [69*49*7, 7],     out: [69*49*7 / (7 * 7)],     hidden: true },
			{ num: 7, in: [-4200, 10],      out: [-4200 / (10 * 10)],     hidden: true },
			{ num: 8, in: [1000000, 500],   out: [1000000 / (500 * 500)], hidden: true },
			{ num: 9, in: [4, 1],           out: [4 / (1 * 1)],           hidden: true },
		]
	},

	{
		/* group / level */
		group: "A",
		level: 7,

		/* task image */
		image:    "7-factory.png",

		/* task title */
		title_pl: "Trudne wyrażenie",
		title_en: "Difficult expression",

		/* limits */
		memory_limit:      10,
		instruction_limit: 10,
		time_limit:        100,
		
		/* task description */
		desc_pl: `Robot Rameide został poproszony o rozwiązanie wyrażenia matematycznego. Ma przed sobą dwie liczby: <pre>A</pre> i <pre>B</pre>, 
		a jego zadaniem jest obliczenie wartości wyrażenia <pre>A * (B * B) - (3 * A)</pre>. Rameide zaczyna zastanawiać się, jak rozwiązać 
		to zadanie. Zastanawia się, czy najpierw pomnożyć <pre>B</pre> przez siebie, a potem pomnożyć przez <pre>A</pre>, czy może 
		spróbować inaczej. W końcu przypomina sobie, że najpierw musiałby obliczyć <pre>B * B</pre>, potem pomnożyć przez <pre>A</pre>, 
		a na koniec odjąć od tego <pre>3 * A</pre>. Dzięki odpowiednim instrukcjom <pre>read</pre> i <pre>write</pre> Rameide skutecznie 
		rozwiązuje problem i wypisuje wynik.`,

		desc_en: `Robot Rameide has been asked to solve a mathematical expression. He has two numbers in front of him: <pre>A</pre> and <pre>B</pre>, 
		and his task is to calculate the value of the expression <pre>A * (B * B) - (3 * A)</pre>. Rameide starts to think about how to solve 
		this task. He wonders if he should multiply <pre>B</pre> by itself first, and then multiply by <pre>A</pre>, or try a different approach. 
		Eventually, he remembers that he should first calculate <pre>B * B</pre>, then multiply by <pre>A</pre>, and finally subtract <pre>3 * A</pre> from it. 
		With the help of the <pre>read</pre> and <pre>write</pre> instructions, Rameide successfully solves the problem and prints the result.`,

		/* tests */
		tests: [
			{ num: 0, in: [24, 2],          out: [24 * (2 * 2) - (3 * 24)],               hidden: false },
			{ num: 1, in: [18, 3],          out: [18 * (3 * 3) - (3 * 18)],               hidden: false },
			{ num: 2, in: [100, 5],         out: [100 * (5 * 5) - (3 * 100)],             hidden: false },
			{ num: 3, in: [25, 5],          out: [25 * (5 * 5) - (3 * 25)],               hidden: false },
			{ num: 4, in: [-20, 2],         out: [-20 * (2 * 2) - (3 * -20)],             hidden: false },
			{ num: 5, in: [1024, 4],        out: [1024 * (4 * 4) - (3 * 1024)],           hidden: false },
			{ num: 6, in: [69*49*7, 7],     out: [69*49*7 * (7 * 7) - (3 * (69*49*7))],   hidden: true },
			{ num: 7, in: [-4200, 10],      out: [-4200 * (10 * 10) - (3 * -4200)],       hidden: true },
			{ num: 8, in: [1000000, 500],   out: [1000000 * (500 * 500) - (3 * 1000000)], hidden: true },
			{ num: 9, in: [4, 1],           out: [4 * (1 * 1) - (3 * 4)],                 hidden: true }
		]
	},

	{
		/* group / level */
		group: "A",
		level: 8,

		/* task image */
		image:    "8-factory.png",

		/* task title */
		title_pl: "Bardzo trudne wyrażenie",
		title_en: "Very difficult expression",

		/* limits */
		memory_limit:      20,
		instruction_limit: 10,
		time_limit:        100,
		
		/* task description */
		desc_pl: `Robot Rameide stanął przed kolejnym wyzwaniem. Tym razem ma przed sobą dwie liczby: <pre>A</pre> i <pre>B</pre>. 
		Zadanie polega na obliczeniu wartości wyrażenia <pre>4 * (A * A) + (B * B) - 4 * (A * B)</pre>. 
		Robot zastanawia się, jak najlepiej rozwiązać to wyrażenie. 
		Najpierw postanawia obliczyć <pre>A * A</pre>, potem pomnożyć wynik przez 4, następnie wykonać to samo dla <pre>B * B</pre>, 
		a na końcu obliczyć <pre>4 * (A * B)</pre> i dodać do siebie odpowiednie wyniki. Z pomocą instrukcji <pre>read</pre> i <pre>write</pre>, 
		Rameide skutecznie oblicza wartość wyrażenia i wypisuje wynik.`,

		desc_en: `Robot Rameide faces another challenge. This time, he has two numbers in front of him: <pre>A</pre> and <pre>B</pre>. 
		His task is to calculate the value of the expression <pre>4 * (A * A) + (B * B) - 4 * (A * B)</pre>. 
		Rameide thinks about the best approach to solve the expression. 
		First, he decides to calculate <pre>A * A</pre>, then multiply the result by 4, and do the same for <pre>B * B</pre>. 
		Finally, he calculates <pre>4 * (A * B)</pre> and adds the appropriate results. With the help of the <pre>read</pre> and <pre>write</pre> instructions, 
		Rameide successfully calculates the value of the expression and prints the result.`,


		/* tests */
		tests: [
		{ num: 0, in: [24, 2],          out: [4 * 24 * 24 + 2 * 2 - 4 * 24 * 2],                         hidden: false },
		{ num: 1, in: [18, 3],          out: [4 * 18 * 18 + 3 * 3 - 4 * 18 * 3],                         hidden: false },
		{ num: 2, in: [100, 5],         out: [4 * 100 * 100 + 5 * 5 - 4 * 100 * 5],                      hidden: false },
		{ num: 3, in: [25, 5],          out: [4 * 25 * 25 + 5 * 5 - 4 * 25 * 5],                         hidden: false },
		{ num: 4, in: [-20, 2],         out: [4 * -20 * -20 + 2 * 2 - 4 * -20 * 2],                      hidden: false },
		{ num: 5, in: [1024, 4],        out: [4 * 1024 * 1024 + 4 * 4 - 4 * 1024 * 4],                   hidden: false },
		{ num: 6, in: [69*49*7, 7],     out: [4 * (69*49*7) * (69*49*7) + 7 * 7 - 4 * (69*49*7) * 7],    hidden: true },
		{ num: 7, in: [-4200, 10],      out: [4 * -4200 * -4200 + 10 * 10 - 4 * -4200 * 10],             hidden: true },
		{ num: 8, in: [1000000, 500],   out: [4 * 1000000 * 1000000 + 500 * 500 - 4 * 1000000 * 500],    hidden: true },
		{ num: 9, in: [4, 1],           out: [4 * 4 * 4 + 1 * 1 - 4 * 4 * 1],                            hidden: true }
		]
	},

	{
		/* group / level */
		group: "B",
		level: 1,

		/* task image */
		image:    "1-plot.png",

		/* task title */
		title_pl: "Cyfra jedności",
		title_en: "Units digit",

		/* limits */
		memory_limit:      10,
		instruction_limit: 20,
		time_limit:        100,
		
		/* task description */
		desc_pl: `Robot Rameide podziwiał ostatnio dynamicznie zmieniającą się liczbę.
		Niestety cyferki liczby migotały na tyle szybko, że robot często nie był w stanie rozpoznać 
		żadnej z nich. W tym zadaniu musisz napisać dla Ramei program, który wczyta liczbę całkowitą 
		<pre>N</pre> i wyznaczy jej cyfrę jedności.`,
		desc_en: `The robot Rameide has recently been admiring a dynamically changing number.
		Unfortunately, the digits of the number were flickering so quickly that the robot often
		couldn't recognize any of them. In this task, you need to write a program for Rameide
		that will read an integer <pre>N</pre> and determine its units digit.`,

		/* tests */
		tests: [
			{ num: 0, in: [24],          out: [4], hidden: false },
			{ num: 1, in: [18],          out: [8], hidden: false },
			{ num: 2, in: [100],         out: [0], hidden: false },
			{ num: 3, in: [25],          out: [5], hidden: false },
			{ num: 4, in: [20] ,         out: [0], hidden: false },
			{ num: 5, in: [1024],        out: [4], hidden: false },
			{ num: 6, in: [23667],       out: [7], hidden: true },
			{ num: 7, in: [4212],        out: [2], hidden: true },
			{ num: 8, in: [1000000],     out: [0], hidden: true },
			{ num: 9, in: [1],           out: [1], hidden: true }
		]
	},

	{
		/* group / level */
		group: "B",
		level: 2,

		/* task image */
		image:    "2-plot.png",

		/* task title */
		title_pl: "Potworne wyrażenie",
		title_en: "Monsterlike expression",

		/* limits */
		memory_limit:      10,
		instruction_limit: 12,
		time_limit:        100,
		
		/* task description */
		desc_pl: `Robot Rameide napotkał poważny problem. Próbował obliczyć bardzo trudne wyrażenie, ale nie daje sobie z nim rady! 
		Wyrażenie brzmi: <pre>4 * A^8 * B^6 - B^3</pre>, a robot nie jest w stanie rozwiązać go samodzielnie. 
		Na wejściu znajdują się dwie liczby <pre>A</pre> i <pre>B</pre>;
		na wyjściu powinna znaleźć się jedna liczba – wartość zadanego wyrażenia. 
		Pomóż robotowi i oblicz to wyrażenie!`,
		desc_en: `Robot Rameide encountered a serious problem. It tried to calculate a very difficult expression but it can't handle it!
		The expression is: <pre>4 * A^8 * B^6 - B^3</pre>, and the robot can't solve it by itself. 
		Two numbers <pre>A</pre> and <pre>B</pre> are given as input;
		the output should be a single number – the value of the given expression. 
		Help the robot and calculate this expression!`,

		/* tests */
		tests: [
			{ num: 0, in: [2, 1],          out: [4 * Math.pow(2, 8) * Math.pow(1, 6) - Math.pow(1, 3)],   hidden: false },
			{ num: 1, in: [3, 2],          out: [4 * Math.pow(3, 8) * Math.pow(2, 6) - Math.pow(2, 3)],   hidden: false },
			{ num: 2, in: [4, 3],          out: [4 * Math.pow(4, 8) * Math.pow(3, 6) - Math.pow(3, 3)],   hidden: false },
			{ num: 3, in: [2, 3],          out: [4 * Math.pow(2, 8) * Math.pow(3, 6) - Math.pow(3, 3)],   hidden: false },
			{ num: 4, in: [5, 2],          out: [4 * Math.pow(5, 8) * Math.pow(2, 6) - Math.pow(2, 3)],   hidden: false },
			{ num: 5, in: [3, 4],          out: [4 * Math.pow(3, 8) * Math.pow(4, 6) - Math.pow(4, 3)],   hidden: false },
			{ num: 6, in: [1, 2],          out: [4 * Math.pow(1, 8) * Math.pow(2, 6) - Math.pow(2, 3)],   hidden: true },
			{ num: 7, in: [4, 5],          out: [4 * Math.pow(4, 8) * Math.pow(5, 6) - Math.pow(5, 3)],   hidden: true },
			{ num: 8, in: [2, 4],          out: [4 * Math.pow(2, 8) * Math.pow(4, 6) - Math.pow(4, 3)],   hidden: true },
			{ num: 9, in: [3, 1],          out: [4 * Math.pow(3, 8) * Math.pow(1, 6) - Math.pow(1, 3)],   hidden: true }
		]
	},

	{
		/* group / level */
		group: "B",
		level: 3,

		/* task image */
		image:    "3-plot.png",

		/* task title */
		title_pl: "Reszta z dzielenia",
		title_en: "Remainder of division",

		/* limits */
		memory_limit:      10,
		instruction_limit: 20,
		time_limit:        100,
		
		/* task description */
		desc_pl: `Robot Rameide uwielbia cukierki! Pewnego dnia, robot postanowił podzielić swoją kolekcję cukierków na kilka równych paczek.
		Ma on w sumie <pre>A</pre> cukierków i chce podzielić je na paczki po <pre>B</pre> sztuk. 
		Po podzieleniu, kilka cukierków może zostać. Pomóż robotowi i oblicz, ile cukierków zostanie mu po podzieleniu.
		Na wejściu znajdują się dwie liczby <pre>A</pre> (liczba cukierków) i <pre>B</pre> (wielkość jednej paczki);
		na wyjściu powinna znaleźć się liczba, która mówi, ile cukierków zostanie robotowi po podzieleniu.`,

		desc_en: `Robot Rameide loves candies! One day, the robot decided to divide his collection of candies into several equal packets.
		He has a total of <pre>A</pre> candies and wants to divide them into packets with <pre>B</pre> candies each.
		After dividing, some candies might remain. Help the robot and calculate how many candies will remain after dividing.
		Two numbers <pre>A</pre> (the total number of candies) and <pre>B</pre> (the size of one packet) are given as input;
		the output should be the number of remaining candies after the division.`,

		/* tests */
		tests: [
			{ num: 0, in: [10, 3],          out: [10 % 3],    hidden: false },
			{ num: 1, in: [25, 7],          out: [25 % 7],    hidden: false },
			{ num: 2, in: [100, 15],        out: [100 % 15],  hidden: false },
			{ num: 3, in: [56, 8],          out: [56 % 8],    hidden: false },
			{ num: 4, in: [45, 6],          out: [45 % 6],    hidden: false },
			{ num: 5, in: [200, 9],         out: [200 % 9],   hidden: false },
			{ num: 6, in: [33, 4],          out: [33 % 4],    hidden: true },
			{ num: 7, in: [62, 10],         out: [62 % 10],   hidden: true },
			{ num: 8, in: [99, 25],         out: [99 % 25],   hidden: true },
			{ num: 9, in: [7, 2],           out: [7 % 2],     hidden: true }
		]
	},

	{
		/* group / level */
		group: "C",
		level: 1,

		/* task image */
		image:    "1-views.png",

		/* task title */
		title_pl: "Minimum",
		title_en: "Minimum",

		/* limits */
		memory_limit:      10,
		instruction_limit: 20,
		time_limit:        100,
		
		/* task description */
		desc_pl: `Robot Rameide ma dwie liczby i nie potrafi zdecydować, która z nich jest mniejsza. 
		Robot chciałby, abyś pomógł mu znaleźć tę liczbę. Na wejściu znajdują się dwie liczby <pre>A</pre> i <pre>B</pre>;
		Twoim zadaniem jest wypisać mniejszą z nich. 
		Pomóż robotowi i wybierz liczbę, która jest mniejsza!`,

		desc_en: `Robot Rameide has two numbers and can't decide which one is smaller. 
		The robot would like you to help him find the smaller number. 
		Two numbers <pre>A</pre> and <pre>B</pre> are given as input;
		your task is to output the smaller of the two numbers. 
		Help the robot and choose the smaller number!`,

		/* tests */
		tests: [
			{ num: 0, in: [10, 20],        out: [10],   hidden: false },
			{ num: 1, in: [5, 3],          out: [3],    hidden: false },
			{ num: 2, in: [7, 7],          out: [7],    hidden: false },
			{ num: 3, in: [15, 8],         out: [8],    hidden: false },
			{ num: 4, in: [100, 25],       out: [25],   hidden: false },
			{ num: 5, in: [0, 100],        out: [0],    hidden: false },
			{ num: 6, in: [-5, 2],         out: [-5],   hidden: true },
			{ num: 7, in: [-10, -20],      out: [-20],  hidden: true },
			{ num: 8, in: [50, 10],        out: [10],   hidden: true },
			{ num: 9, in: [3, 9],          out: [3],    hidden: true }
		]
	},


	{
		/* group / level */
		group: "C",
		level: 2,

		/* task image */
		image:    "2-views.png",

		/* task title */
		title_pl: "Parzystość",
		title_en: "Pairty",

		/* limits */
		memory_limit:      10,
		instruction_limit: 20,
		time_limit:        100,
		
		/* task description */
		desc_pl: `Robot Rameide ma liczbę i chce sprawdzić, czy jest ona parzysta czy nieparzysta. 
		Jeśli liczba jest parzysta, robot chce otrzymać wynik <pre>1</pre>, a jeśli jest nieparzysta, wynik powinien wynosić <pre>0</pre>. 
		Pomóż robotowi i sprawdź parzystość liczby. Na wejściu znajduje się liczba <pre>A</pre>;
		jeśli jest parzysta, wypisz <pre>1</pre>, a jeśli nieparzysta, wypisz <pre>0</pre>.`,

		desc_en: `Robot Rameide has a number and wants to check if it is even or odd. 
		If the number is even, the robot wants to get the result <pre>1</pre>, and if it is odd, the result should be <pre>0</pre>. 
		Help the robot and check the number's parity. A number <pre>A</pre> is given as input;
		if it's even, print <pre>1</pre>, and if it's odd, print <pre>0</pre>.`,

		/* tests */
		tests: [
		{ num: 0, in: [10],        out: [1],   hidden: false },
		{ num: 1, in: [15],        out: [0],   hidden: false },
		{ num: 2, in: [8],         out: [1],   hidden: false },
		{ num: 3, in: [23],        out: [0],   hidden: false },
		{ num: 4, in: [6],         out: [1],   hidden: false },
		{ num: 5, in: [37],        out: [0],   hidden: false },
		{ num: 6, in: [100],       out: [1],   hidden: true },
		{ num: 7, in: [21],        out: [0],   hidden: true },
		{ num: 8, in: [49],        out: [0],   hidden: true },
		{ num: 9, in: [52],        out: [1],   hidden: true },
		]
	},

	{
		/* group / level */
		group: "C",
		level: 3,

		/* task image */
		image:    "3-views.png",

		/* task title */
		title_pl: "Policz pociągi (wagony)",
		title_en: "Count the trains (cars)",


		/* limits */
		memory_limit:      10,
		instruction_limit: 100,
		time_limit:        200,
		
		/* task description */
		desc_pl: `Robot Rameide pracuje na dworcu kolejowym i liczy wagony pociągu. 
		Każdy wagon jest oznaczony liczbą, ale na końcu ostatniego wagonu znajduje się liczba <pre>0</pre>, 
		która oznacza koniec ciągu. Pomóż robotowi i oblicz, ile wagonów pociągu zostało policzonych. 
		Na wejściu znajduje się ciąg liczb, zakończony liczbą <pre>0</pre>. Na wyjściu robot powinien wypisać liczbę 
		wagony (czyli długość tego ciągu przed liczbą <pre>0</pre>).`,

		desc_en: `Robot Rameide is working at a train station and counting the train cars. 
		Each car is marked with a number, but at the end of the last car, there is a <pre>0</pre>, 
		which marks the end of the sequence. Help the robot and calculate how many cars the train has. 
		The input consists of a sequence of numbers, ending with a <pre>0</pre>. The output should be the number of 
		cars (i.e., the length of the sequence before the <pre>0</pre>).`,

		/* tests */
		tests: [
			{ num: 0, in: [5, 3, 7, 2, 0],     out: [4], hidden: false },
			{ num: 1, in: [1, 2, 0],           out: [2], hidden: false },
			{ num: 2, in: [12, 15, 9, 3, 0],   out: [4], hidden: false },
			{ num: 3, in: [8, 0],              out: [1], hidden: false },
			{ num: 4, in: [10, 20, 30, 40, 0], out: [4], hidden: false },
			{ num: 5, in: [0],                 out: [0], hidden: false },
			{ num: 6, in: [99, 11, 5, 0],      out: [3], hidden: true },
			{ num: 7, in: [25, 50, 75, 0],     out: [3], hidden: true },
			{ num: 8, in: [7, 7, 7, 7, 0],     out: [4], hidden: true },
			{ num: 9, in: [100, 200, 0],       out: [2], hidden: true }
		]
	},

	{
		/* group / level */
		group: "C",
		level: 4,

		/* task image */
		image:    "4-views.png",

		/* task title */
		title_pl: "Liczba cyfr",
		title_en: "Counting digits",


		/* limits */
		memory_limit:      10,
		instruction_limit: 100,
		time_limit:        200,
		
		/* task description */
		desc_pl: `Robot Rameide otrzymał bardzo dłuuugą liczbę i musi obliczyć, ile cyfr ją tworzy. 
		Liczba jest naprawdę dłuuuga, dlatego robot nie jest pewien, jak szybko się z tym uporać. 
		Pomóż robotowi, policz liczbę cyfr tej liczby. Na wejściu znajduje się liczba <pre>X</pre>;
		na wyjściu robot powinien wypisać liczbę cyfr w tej liczbie.`,

		desc_en: `Robot Rameide received a very looong number and needs to calculate how many digits it contains. 
		The number is really looong, so the robot is unsure how quickly it can handle this. 
		Help the robot and count the number of digits in this number. A number <pre>X</pre> is given as input;
		the robot should output the number of digits in this number.`,

		/* tests */
		tests: [
			{ num: 0, in: [12345],     out: [5],  hidden: false },
			{ num: 1, in: [1],         out: [1],  hidden: false },
			{ num: 2, in: [987654],    out: [6],  hidden: false },
			{ num: 3, in: [42],        out: [2],  hidden: false },
			{ num: 4, in: [1000],      out: [4],  hidden: false },
			{ num: 5, in: [200000],    out: [6],  hidden: false },
			{ num: 6, in: [9],         out: [1],  hidden: true },
			{ num: 7, in: [1010101],   out: [7],  hidden: true },
			{ num: 8, in: [123456789], out: [9],  hidden: true },
			{ num: 9, in: [987],       out: [3],  hidden: true }
		]
	},

	{
		/* group / level */
		group: "C",
		level: 5,

		/* task image */
		image:    "5-views.png",

		/* task title */
		title_pl: "Zbiórka kamieni na plaży",
		title_en: "Collecting stones on the beach",

		/* limits */
		memory_limit:      10,
		instruction_limit: 100,
		time_limit:        200,
		
		/* task description */
		desc_pl: `Robot Rameide spędzał dzień na plaży, zbierając kamienie. Każdy kamień, który zbierał, miał swoją wagę. 
		Robot postanowił obliczyć, ile ważą wszystkie kamienie, które udało mu się zebrać. W zadaniu tym będziesz musiał 
		pomóc robotowi policzyć sumę wag kamieni, które zebrał. Na wejściu znajdują się wagi kamieni (liczby),
		a na wyjściu należy wypisać ich sumę. Ostatnia liczba w ciągu to liczba <pre>0</pre>, która oznacza koniec zbierania kamieni.`,

		desc_en: `Robot Rameide was spending the day on the beach, collecting stones. Each stone he collected had its own weight. 
		The robot decided to calculate the total weight of all the stones he collected. In this task, you need to help the robot 
		count the total weight of the stones. A sequence of stone weights (numbers) is given as input, and the output should be 
		the sum of those weights. The last number in the sequence is <pre>0</pre>, indicating the end of stone collection.`,

		/* tests */
		tests: [
			{ num: 0, in: [2, 3, 4, 0],       out: [2 + 3 + 4],         hidden: false },
			{ num: 1, in: [10, 20, 0],        out: [10 + 20],          hidden: false },
			{ num: 2, in: [5, 10, 15, 0],     out: [5 + 10 + 15],      hidden: false },
			{ num: 3, in: [1, 1, 1, 1, 0],    out: [1 + 1 + 1 + 1],    hidden: false },
			{ num: 4, in: [7, 14, 21, 0],     out: [7 + 14 + 21],      hidden: false },
			{ num: 5, in: [100, 200, 300, 0], out: [100 + 200 + 300], hidden: false },
			{ num: 6, in: [50, 75, 25, 0],    out: [50 + 75 + 25],     hidden: true },
			{ num: 7, in: [1, 2, 3, 4, 0],    out: [1 + 2 + 3 + 4],    hidden: true },
			{ num: 8, in: [1000, 2000, 0],    out: [1000 + 2000],      hidden: true },
			{ num: 9, in: [500, 1000, 0],     out: [500 + 1000],       hidden: true }
		]
	},

	{
		/* group / level */
		group: "C",
		level: 6,

		/* task image */
		image:    "6-views.png",

		/* task title */
		title_pl: "Podzielność",
		title_en: "Divisibility",

		/* limits */
		memory_limit:      10,
		instruction_limit: 100,
		time_limit:        200,
		
		/* task description */
		desc_pl: `Robot Rameide natrafił na zadanie, które wymaga sprawdzenia, czy dana liczba spełnia dwa warunki. 
		Pierwszy warunek mówi, że liczba musi być podzielna przez <pre>5</pre>, a drugi, że po podzieleniu przez <pre>7</pre>, powinna dać resztę <pre>2</pre>. 
		Robot zaczyna rozwiązywać problem, wczytując liczbę. 
		Jeśli liczba spełnia oba warunki, wypisuje <pre>1</pre>, w przeciwnym razie <pre>0</pre>.`,

		desc_en: `Robot Rameide came across a task that requires checking if a given number meets two conditions. 
		The first condition is that the number must be divisible by <pre>5</pre>, and the second is that when divided by <pre>7</pre>, it should give a remainder of <pre>2</pre>. 
		Rameide starts solving the problem by reading the number. 
		If the number satisfies both conditions, it prints <pre>1</pre>, otherwise it prints <pre>0</pre>"`,

		/* tests */
		tests: [
			{ num: 0, in: [30],  out: [1], hidden: false },
			{ num: 1, in: [195], out: [0], hidden: false },
			{ num: 2, in: [80],  out: [0], hidden: false }, 
			{ num: 3, in: [16],  out: [0], hidden: false },
			{ num: 4, in: [65],  out: [1], hidden: false }, 
			{ num: 5, in: [32],  out: [0], hidden: false },
			{ num: 6, in: [70],  out: [0], hidden: true },
			{ num: 7, in: [14],  out: [0], hidden: true },
			{ num: 8, in: [275], out: [1], hidden: true }, 
			{ num: 9, in: [52],  out: [0], hidden: true }, 

		]
	},

	{
		/* group / level */
		group: "D",
		level: 1,

		/* task image */
		image:    "1-theme.png",

		/* task title */
		title_pl: "Wysokie drzewa",
		title_en: "Tall trees",

		/* limits */
		memory_limit:      10,
		instruction_limit: 100,
		time_limit:        200,
		
		/* task description */
		desc_pl: `Robot Rameide ma ogród pełen drzew. Chce policzyć, ile z tych drzew jest wyższych niż <pre>100</pre>, ponieważ tylko one są odpowiednio stare i wymagają specjalnej opieki. 
		Na wejściu znajduje się ciąg liczb, które przedstawiają wysokości drzew w ogrodzie. Ciąg kończy się liczbą <pre>0</pre>, która oznacza koniec pomiarów. 
		Należy policzyć, ile z tych drzew ma wysokość większą niż <pre>100</pre>. 
		Na wyjściu powinna znaleźć się liczba odpowiadająca ilości takich drzew.`,

		desc_en: `Robot Rameide has a garden full of trees. He wants to count how many of these trees are taller than <pre>100</pre> because only those trees are old enough and require special care. 
		The input consists of a sequence of numbers representing the heights of trees in the garden. The sequence ends with the number <pre>0</pre>, which marks the end of the measurements. 
		The task is to count how many of these trees have a height greater than <pre>100</pre>. 
		The output should be the number corresponding to the number of such trees.`,
		/* tests */
		tests: [
			{ num: 0, in: [120, 85, 150, 99, 130, 0], out: [3], hidden: false },
			{ num: 1, in: [100, 101, 102, 99, 0],     out: [2], hidden: false },
			{ num: 2, in: [80, 90, 85, 95, 0],        out: [0], hidden: false },
			{ num: 3, in: [110, 105, 115, 0],         out: [3], hidden: false },
			{ num: 4, in: [200, 50, 150, 70, 120, 0], out: [3], hidden: false },
			{ num: 5, in: [60, 80, 90, 100, 0],       out: [0], hidden: false },
			{ num: 6, in: [125, 110, 98, 112, 0],     out: [3], hidden: true  },
			{ num: 7, in: [200, 150, 250, 300, 0],    out: [4], hidden: true  },
			{ num: 8, in: [35, 25, 60, 110, 105, 0],  out: [2], hidden: true  },
			{ num: 9, in: [50, 60, 75, 80, 0],        out: [0], hidden: true  }
		]
	},

];
