Spyboat

Phaser.Js game where players navigate a spy boat, collecting secret intelligence and avoiding obstacles.

Developer setup

Requires a local web server e.g. Live Server extension for VS Code.Clone the repository or download the game files to local machine.

Running the game

Use arrow keys or WASD to control the boat.

Up/W: Move forward
Down/S: Slow down against the current
Left/A: Turn left
Right/D: Turn right

Spacebar or on-screen button: Pause the game

Files

main.js: Contains the Phaser game configuration
game.js: The main game scene with core gameplay logic
player.js: Defines the player boat behavior
setup.js: Handles asset loading and initial game setup
global.js: Contains global variables and utility functions

Testing

To enable developer mode, set developerMode = true in global.js. Set testing = true in global.js. Adjust test parameters like test_zone, test_river_speed, and fuel_for_testing as needed.
