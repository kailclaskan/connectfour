/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 0; // active player: 1 or 2
let click = 0; //track the number of clicks that have been made
let nullcount = 0;
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard(WIDTH, HEIGHT) {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  //Had to use a standard for loop. For...of required an iterable object,
  //which int's are not.
  //For the width of the board
  for(let y = 0; y < HEIGHT; y++){
    //Add an array to board for the length of height.
    board.push([]);
    //THEN loop through the width for each column
    for (let x = 0; x < WIDTH; x++){
      //Add an empty object to fill the space.
      board[y].push(null);
    }
  }
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');
  // TODO: add comment for this code
  //Create the top portion of the board, where the user clicks.
  const top = document.createElement("tr");
  //Set the id of the top to column-top
  top.setAttribute("id", "column-top");
  //add click event listener and run the handle click function
  top.addEventListener("click", handleClick);

  //Loop through the width of the board
  for (let x = 0; x < WIDTH; x++) {
    //create a column x wide for the top buttons
    const headCell = document.createElement("td");
    //give it the id of the current x location
    headCell.setAttribute("id", x);
    //add cell's to the row
    top.append(headCell);
  }
  //add top buttons to the page
  htmlBoard.append(top);

  // TODO: add comment for this code
  //loop through the height variable
  //this was set to a minus function because
  //when it populated it was setting the 0-0
  //cell in the top left corner instead of the 
  //bottom right.
  for (let y = HEIGHT-1; y > -1; y--) {
    //create a row y high.
    const row = document.createElement("tr");
    //loop through the width variable
    //this was set this way so it would increase from
    //left to right, instead of right to left.
    for (let x = 0; x < WIDTH; x++) {
      //create a group of columns x wide
      const cell = document.createElement("td");
      //set the id to the cell's y,x coordinate
      cell.setAttribute("id", `${y}-${x}`);
      //add cells to each row.
      row.append(cell);      
    }
    //add board to the game.
    htmlBoard.append(row);
  }
  makeBoard(WIDTH, HEIGHT);
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  //This was the only place I was lost. I had to look at the solution for
  //this.
  for(let y = 0; y <= HEIGHT; y++){
    //not sure what this means exactly. If it's not at the y x coordinate
    //then it can create the div.
    if(!board[y][x]){
      //I understand this returns a y coordinate for x.
      return y;
    }
  }
  //otherwise it simply returns null.
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  //find the next available open spot
  //querySelctor would not work for this.
  const nextAvailable = document.getElementById(`${y}-${x}`);
  //create a div
  const addPiece = document.createElement('div');
  //if the player is 2
  if(currPlayer === 2){
    //give the div class of piece and p2
    addPiece.setAttribute('class', 'piece p2');
  }else{
    //otherwise the class is piece and p1
    addPiece.setAttribute('class', 'piece p1');
  }
  //add piece to the td
  nextAvailable.append(addPiece);
}
//function created to check if it's player one or
//player two's turn based on the number of clicks.
const playerCheck = (click) => click % 2 !== 0? currPlayer = 2 : currPlayer = 1;

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  window.alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // get next spot in column (if none, ignore click)

  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  //checks to see which player's turn it is based on the number of clicks
  //moved this up because it never updated the player at the bottom.
  playerCheck(click);
  //after the token is placed in the table it adds to the click count so
  //the player will update.
  click++;
  // place piece in board and add to HTML table
  placeInTable(y, x);
  // TODO: add line to update in-memory board
  board[y][x] = `P${currPlayer}`;
  // check for win
  if (checkForWin()) {
    setTimeout(function(){
      endGame(`Player ${currPlayer} Wins!`);
    },250)
    setTimeout(function(){
      window.location = 'connect4-gameover.html';
    }, 750)
  }
  // check for tie
  // TODO: check if all cells in board are filled; if so, call endGame
  //TEMPORARY
  nullcount = 0;
  for(h of board){
    for (w of board){
      if(board[h][w] === null){
        nullcount++;
      }
    }
  }
/** checkForWin: check board cell-by-cell for "does a win start here?" */
}
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === `P${currPlayer}`
    );
    
  }

  // TODO: read and understand this code. Add comments to help you.
  //Looping through each of the vertical positions.
  for (let y = 0; y < HEIGHT; y++) {
    //Looping through each of the horizontal positions.
    for (let x = 0; x < WIDTH; x++) {
      //This checks to see if there is a match on the Horizontal line.
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      //This checks to see if there is a match on the Vertical line.
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      //This checks if there is a match diagonally and to the right.
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      //This checks if there is a match diagonally and to the left
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
        
      }
    }
  }
}

makeBoard();
makeHtmlBoard();