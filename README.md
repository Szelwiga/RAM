## RAM Engine IDE

An Integrated Development Environment (IDE) for the RAM Machine programming language, featuring 
built-in simulators and a problem set.

----------

### About

This project implements the RAM Machine Integrated Development Environment (IDE) as an online 
website, accessible at: https://szelwiga.github.io/RAM/

The website uses cookies to store user settings, accepted levels, and opened code.

### Features

The project includes the following features:

* a grid-based editor that helps maintain correct code formatting;
* a plain text editor with basic syntax highlighting;
* a pure simulator that shows the effects of each instruction;
* a detailed simulator, an artistic version of the simulator with pixel art;
* multiple RAM Machine-specific problems, with statements written in both Polish and English.

### Future Extensions and To-Do List

* **Bug:** I am unsure how the text selection range API for input fields works in browsers (I 
believe this might be a Chrome bug). This causes some issues with copy-pasting in the plain editor 
and navigation with arrow keys in the grid editor.
* Add more levels.
* Improve the performance of both the grid and plain text editors.
* Implement idle animations for the detailed simulator.
* Implement macros as an expansion to the RAM language.
* Add the ability to paste into the grid editor.
* **Bug:** Fix style issues in the plain text editor.

### Running Locally

To run the website locally, you cannot simply clone the repository and open `index.html` in a browser 
due to cross-origin policies related to the canvas element and the lack of cookie support. However, 
it can be easily run using the localhost mechanism. To clone the repository, use:

```bash
git clone https://github.com/Szelwiga/RAM.git
```

To run the webpage, you can use any file server. Here is an example using Python 3's built-in HTTP server:

First, run:

```bash
python3 -m http.server
```

Then, open `http://localhost:8000` in your browser.

Note: Opening index.html directly will work for most features, but some oft them require running the 
site via a local server.

---

## Contributors and Bug Reports

Contributors are always welcome! If you have suggestions, improvements, or would like to contribute 
to the project, feel free to open a pull request. Bug reports are also appreciated and can be 
submitted via the GitHub issues page.

