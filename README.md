# Goal
This project will consist of building a battleship game.

Again, there are intentionally no visuals and no assets provided with this project, and many aspects of the UI are left intentionally vague. We are leaving you freedom to get creative with the UI. We encourage you to make the game look presentable and even add extra flair with things like CSS transitions and animations.

# Battleship Rules
Each player has a 10x10 board on which the player is able to place 5 ships:

A Carrier, which is 5 tiles long
A Battleship, which is 4 tiles long
A Cruiser, which is 3 tiles long
A Submarine, which is 3 tiles long
A Destroyer, which is 2 tiles long
Each ship can be placed either horizontally or vertically on the board, and cannot be placed partially off the board.

Each tile is denoted by a coordinate, A-J for columns and 1-10 for rows

i.e. the top left corner would be at coordinate A1
Each player then takes turns picking a tile on the opposing player’s grid, taking a shot at that tile.

If the tile contains a ship, the shot is a HIT
If the tile does not contain a ship, the shot is a MISS
A ship is sunk if all the tiles for that ship have been marked as a HIT.

The game ends when one player has sunk all of the opposing players ships.

# Functional Requirements
Allow the player to start a new game.
This should reset the board and allow the user to place new ships onto the board.

Ships should be able to be rotated so they can be either vertically or horizontally placed. Once the player is content with the ship positioning, they should be able to start the game. Picking a starting player at random or through an option. Come up with a creative way for this to work.

Allow the player to take a shot on their turn only.
Allow the player to play against an AI.
It’s up to you on how complicated to make this AI player.

Have a leaderboard for games against the AI
This should show how many games the current player has won against the AI, compared to all players. There is no need to have the user log in to accomplish this, just let them pick a username to use.

# Display Requirements
Players should be able to see the other players board and their own.
The players board should show the following:

The players ship placement
Any shots the opposing player has made.
The opponents board should show the following:

Any shots made by the player, and whether it was a HIT or a MISS
Both boards should show:

Coordinates of the cells, up to you on how this should be displayed
The game should show who’s turn it currently is, the player or the opponent.
Show a list of ships for each player
When a ship is destroyed, indicate this in the list of ships

Show a log of shots and messages to the player.
This log should show:

All the shots taken by each player
A message when a player sinks another ship
e.g.:

# Stretch Goals
Allow the player to save a replay of the game
You should also allow a player to load a replay and step through each turn.

Allow the player to setup options before starting the game
Number of ships
Number of shots per turn
Board size
Allow the user to pick the difficulty of the AI player.
Allow the player to play against another person on a different computer
This will require you to extend your server-side application which will allow for connection between players.