# River Boat

Phaser.js game where player remotely navigates a spy boat along a river, collecting secret intelligence (INTEL) and avoiding obstacles.

## Developer setup

Clone the repository or download game files to your local machine.

Requires a local web server, e.g. the Live Server extension for VS Code. Serve from the repo root, not from a parent directory - index.html sits at the root and all paths are relative to it.

## Running the game

Use arrow keys or WASD to control the boat.

- Up / W: engine to move faster than current flow
- Down / S: slow down against the current
- Left / A: steer left
- Right / D: steer right
- P, or on-screen button: pause
- ESC: quit to the menu, saving score

## Files

- index.html: loads Phaser and every class. The script order is the dependency graph, so a new class needs its tag in the right place
- js/main.js: the Phaser game configuration
- js/scene/game.js: the main game scene with core gameplay logic
- js/object/player.js: the player boat behaviour
- js/scene/setup.js: asset loading and initial game setup
- js/global.js: global variables and utility functions
- public/json/zoneParameters.json: the level design - obstacle mix, spacing and difficulty per zone, tuned here rather than in code

## Testing

Set developerMode = true and testing = true in js/global.js, then adjust the test parameters as needed:

- test_zone: which zone to start in
- test_river_speed: 20 makes reaching the riverbank easier
- test_no_colliders: removes the need to navigate
- fuel_for_testing: replaces the normal 3000 starting fuel
