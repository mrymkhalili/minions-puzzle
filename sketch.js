let my_width = 100;
let my_height = 100;
let my_puzzle;
let game_state = 0;

function board_setup(){
  my_puzzle = new Puzzle(4, 4);
  my_puzzle.createBoard();
}

function setup () {
  createCanvas(600, 600);
  board_setup();
  bg = loadImage ("resources/bg1.png");
}

function welcome() {
  clear();
  // background("#FFEA00");
  image(bg, 0, 0, width, height);
  
  // textSize(20);
  // fill(0, 102, 153);
  // text("welcome to the minions puzzle!", 50, 50);
  // text("this is a 4x4 puzzle", 50, 80);
  // text("click on the button when you are ready!", 50, 110);
}

function draw () {
  if (game_state == 0) {  // 0 is i or instructions page
    welcome();
  }
  
  if (game_state == 1) {
      background("#FFEA00");
      my_puzzle.display();

    if (my_puzzle.win == true) {
      display_win_pic(my_puzzle);
      textSize(40);
      fill(0, 102, 153);
      text("YOU WON!", 50, 50);
    }
  }
}


function play_sound() {
  if (game_state == 2) {
    my_puzzle.bg_sound.amp(0.5);
    my_puzzle.sound();
  }
  else if (game_state == 3) {
    my_puzzle.bg_sound.amp(0);
  }
}

function display_win_pic(p) {
  print("we here");  // print winning message
  background(255);
  image(p.win_img, 0, 0, width, height);
  noLoop();
}


class Puzzle {
    constructor(num_rows, num_cols) {
      this.numRows = num_rows;
      this.numCols = num_cols;
      // print(this.num_rows);
      this.gameover = false;
      this.win = false;
      this.win_sound = loadSound ("resources/TaDa.mp3");
      this.bg_sound = loadSound ("resources/banana.mp3");
      this.bg_sound.amp(0.05);
      this.win_img = loadImage ("resources/win.png");
    }
        
        
    createBoard () {
      this.board = [];
      
      for (var r=0; r<this.numRows; r++) {
        // for each row create a temp list
        var tempList = [];
        
        // add numCols tiles to the list
        for (var c=0; c<this.numCols; c++) {
          // r*c is the image index
          var new_tile = new Tile(r, c, r*this.numCols+c, this.numRows, this.numCols);
          tempList.push(new_tile);
        }
        
        // push the list to the board
        this.board.push(tempList);
      }
      this.shuffle_tiles();
    }

    // shuffle debug
    
    shuffle_tiles () {
      
      // var current_r = this.numRows-1;
      // var current_c = this.numCols-1;
      var current_r = int(random(0,4));  // initially 0-3, left most cells or right most? 
      var current_c = int(random(0,4));      

      var neighbors = [[0,-1], [1,0], [0,1], [-1,0]];
      
      // increase s to have a more standard shuffle - was 20 initially
      for (var s=0; s<10; s++) {
        var empty_tile = this.board[current_r][current_c];
        var shuffling = random(neighbors);

        var destination_r = current_r + shuffling [0];
        var destination_c = current_c + shuffling [1];

        while (destination_r < 0 || destination_c < 0 || destination_r > this.numRows-1 || destination_c > this.numCols-1) {
          shuffling = random(neighbors);
          destination_r = current_r + shuffling [0];
          destination_c = current_c + shuffling [1];
        }

        var new_tile = this.board[destination_r][destination_c];
        
        // print("Before swap: " + str(this.board [current_r][current_c].img_index) + ", " + str(this.board [destination_r][destination_c].img_index));
        
        var temp = empty_tile.img_index;
        empty_tile.img_index = new_tile.img_index;
        new_tile.img_index = temp;

        // print("After swap: " + str(this.board [current_r][current_c].img_index) + ", " + str(this.board [destination_r][destination_c].img_index));

        current_r = destination_r;
        current_c = destination_c;

        for (var r=0; r<this.numRows; r++) {
          for (var c=0; c<this.numCols; c++) {
              var the_tile = this.board[r][c];
              the_tile.img = loadImage ('resources/'+str(the_tile.img_index)+'.png');
          }
        }
      }
    }
    
    // shuffle debug
                
// SWAP START

    swap(nonempty, empty) {
      // takes coordinates of two tiles, swap their index
      var empty_tile = this.board[empty[0]][empty[1]];
      // print("this is empty tile & img index: ", empty_tile, empty_tile.img_index);
      var new_tile = this.board [nonempty[0]][nonempty[1]];
      // print("this is new tile & img index: ", new_tile, new_tile.img_index);

      var temp = empty_tile.img_index;
      empty_tile.img_index = new_tile.img_index;
      new_tile.img_index = temp;


      var tmp=new_tile.img;
      new_tile.img = empty_tile.img;
      // loadImage ('resources/'+str(new_tile.img_index)+'.png');
      empty_tile.img = tmp;
      // loadImage ('resources/'+str(empty_tile.img_index)+'.png');
      
      // print("after swap: ", empty_tile, empty_tile.img_index);
      // print("after swap: ", new_tile, new_tile.img_index);

      for (var r=0; r<this.numRows; r++) {            
        for (var c=0; c<this.numCols; c++) {
          // print(r,c, this.board[r][c].img_index);
          if (this.board[r][c].img_index != r*4 + c) {
              return false;
          }
        }
      }

      this.win = true;
      print ("won game!");
      this.win_sound.play();
    }


    display() {
      var i,j, the_tile;
      for (i=0; i<this.numRows; i++) {
        for (j=0; j<this.numCols; j++) {
          the_tile = this.board[i][j];
          // print(the_tile, the_tile.img_index);
          the_tile.display_tile();
        }
      }
    }
  
  sound() {
    this.bg_sound.play();
  }

    tile_empty_adj () {
      // Returns a list of coordinates of empty tile and all 2~4 tiles that are adjacent to the empty tile
      var adj = []

      for (var r=0; r<this.numRows; r++) {
        for (var c=0; c<this.numCols; c++) {
          // if r,c is empty
          if (this.board[r][c].img_index == (this.numRows*this.numCols-1)) {
            var neighbors = [[0,-1], [1,0], [0,1], [-1,0]];
            // print("THIS IS LENGTH: ", neighbors.length);
            var empty_tile = this.board[r][c];
            for (var n=0; n<neighbors.length; n++) {
              // print("properties: ", r, c, neighbors[n][0], neighbors[n][1]);
              if (r + neighbors[n][0] < this.numRows && c + neighbors[n][1] < this.numCols) {
                adj.push([r + neighbors[n][0], c + neighbors[n][1]]);
              }
            }
            // return empty tile and list of adjacent tiles
            return [[r, c], adj];
          }
        }
      }
    }
}
// class definition ends

class Tile {
  
  constructor (r, c, img_index, numRows, numCols) {   
    this.r = r;
    this.c = c;
    this.numRows = numRows;
    this.numCols = numCols;
    this.img_index = img_index;
    this.img = loadImage ('resources/' + this.img_index+ '.png');
    // print("image index is: ", this.img_index);
  }

  display_tile () {        
    if (this.img_index != (this.numRows*this.numCols) - 1) {
      // print("image index is: ", this.img_index)
      image(this.img, this.c*my_width, this.r*my_height, my_width, my_height);
    }
  }
}


function mouseClicked () {
  
  var empty, adj, empty_adj; 
  empty_adj = my_puzzle.tile_empty_adj();

  empty = empty_adj[0];
  adj = empty_adj[1];
  // print("adjacent cells: ", adj);

  mouse = [int(mouseY/my_height), int(mouseX/my_width)];

  // print(mouse);
  for(var i=0; i<adj.length;i++) {
    if(mouse[0] == adj[i][0] && mouse[1] == adj[i][1]) {
      // print("we are here in the swap call\n");
      // switch the empty and non-empty slots
      my_puzzle.swap(mouse, empty);
      // my_puzzle.display();
    }
  }
}


function keyPressed() {
  switch (key) {
    case "i": // back to the game instructions
      game_state = 0;
      break;
    case "p":  // start the puzzle or back to the puzzle from instructions
      game_state = 1;
      break;
    case "s": // reshuffle
      board_setup();
      break;
    case "m": // m to mute
      my_puzzle.bg_sound.amp(0);
      break;
    case "u": // u to unmute
      my_puzzle.sound();
      my_puzzle.bg_sound.amp(0.05);
      break;
  }
}

