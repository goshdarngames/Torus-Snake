HTML Canvas Game
================

This project provides a template that can be cloned when creating a new
game targeting the HTML canvas.

The project includes the Babylon 3D Javascript library for rendering.

The game's canvas is created in the index.html file.

The HTML file includes the local javascript file 'game-logic/main.js'.

Tests are provided using the Jest testing framework.

The Jest packages were installed using the Yarn dependency manager.

To run the tests and build the game use 'grunt' with the provided 
Gruntfile.js

Game Logic
==========

The javascript logic for the game can be found in:

    ./game_logic

After running the tests the grunt file concatenates all of the 
game logic code into:

    ./game_logic.min.js

Minification is not currently implemented.
