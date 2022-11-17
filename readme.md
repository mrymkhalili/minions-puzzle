
<br>
<a href="https://intro.nyuadim.com/wp-content/uploads/2022/10/Screen-Shot-2022-10-14-at-12.16.00-AM-e1665991513756.png"><img class="wp-image-11788 size-medium" src="https://intro.nyuadim.com/wp-content/uploads/2022/10/Screen-Shot-2022-10-14-at-12.16.00-AM-e1665991513756-300x300.png" alt="" width="600" height="600" /><br>
</a> a snapshot from the puzzle[/caption]
<h2 class="p1">Inspiration:</h2>
<p class="p1">My inspiration for this game was my puzzle assignments from Intro to CS that involved matrices calculations and boards (tik tac to, connect 4, etc.) and also this artwork in the Arts Center hallway:</p>
<a href="https://intro.nyuadim.com/wp-content/uploads/2022/10/IMG_7172-scaled.jpeg"><img class="alignnone wp-image-11790" src="https://intro.nyuadim.com/wp-content/uploads/2022/10/IMG_7172-225x300.jpeg" alt="" width="717" height="956" /></a>
<p class="p1">The idea of the game is very simple. Just like the frame above, there is only one empty tile (randomly placed as a result of shuffling). Click on any empty tile’s adjacent cell to swap the two. Continue till all the pieces are in place!</p>

<h2 class="p1">Implementation:</h2>
<p class="p1">Two (huge) classes Puzzle and Tile, seven methods, eight functions, 292 lines, and lots of debugging prints in between.<span class="Apple-converted-space"> </span></p>
<p class="p1">The basic idea is how you think about any puzzle; we need to create a board, divide it into cells (that can be replaced or swapped), assign each tile a pattern in such a way that the whole board represents a complete photo, then shuffle the cells and try to solve the puzzle. Each puzzle has a different set of rules; in this puzzle, you have one empty cell and are allowed to swap it with an adjacent cell.</p>

<h4 class="p1">The tiles:</h4>
<p class="p1">It starts with a single tile. The tile class creates an object Tile with the appropriate properties. Each tile object has a specific position on the board tile[row][column]:</p>

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="dracula">// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
}
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%</pre>
<p class="p1">Each tile object is also assigned an image index ranging from 0-15, and the way we are displaying it is by multiplying the tile’s row and column number by its size (defined at the beginning of the program):</p>

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="dracula">// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
display_tile () { 
  if (this.img_index != (this.numRows*this.numCols) - 1) {
  // print("image index is: ", this.img_index)
  image(this.img, this.c*my_width, this.r*my_height, my_width, my_height);
  }
}
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%</pre>
<h4 class="p1">The board (matrix):</h4>
<p class="p1">We are now ready to populate an array of arrays with our tile objects. The Puzzle class has a createBoard() method that loops through the range of numRows and numCols (passed as arguments in the Puzzle object constructor). A temporary array is created for each row in numRows, and then numCols arrays (numbers of columns) are pushed into the temp array. Then a new Tile object is created for each cell. Then we push this temporary list to the board (every tile is in the correct place at this point). Now before you exit the function, you shuffle all the tiles.</p>

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="dracula">// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    createBoard () {
      this.board = [];
      
      for (var r=0; r&lt;this.numRows; r++) {
        // for each row create a temp list
        var tempList = [];
        
        // add numCols tiles to the list
        for (var c=0; c&lt;this.numCols; c++) {
          // r*c is the image index
          var new_tile = new Tile(r, c, r*this.numCols+c, this.numRows, this.numCols);
          tempList.push(new_tile);
        }
        
        // push the list to the board
        this.board.push(tempList);
      }
      this.shuffle_tiles();
    }
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
</pre>
<h4 class="p1">Shuffling tiles:</h4>
<p class="p1">Picking random values for any tile’s [r] and [c] values (ranging from 0 to 4). Identify its neighbors -&gt; [[0,-1], [1,0], [0,1], [-1,0]]. Swap the tile with a neighbor from this list (also random).<span class="Apple-converted-space"> </span></p>

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="dracula">// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    shuffle_tiles () {
      
      // var current_r = this.numRows-1;
      // var current_c = this.numCols-1;
      var current_r = int(random(0,4));  // initially 0-3, left most cells or right most? 
      var current_c = int(random(0,4));      

      var neighbors = [[0,-1], [1,0], [0,1], [-1,0]];
      
      // increase s to have a more standard shuffle - was 20 initially
      for (var s=0; s&lt;10; s++) {
        var empty_tile = this.board[current_r][current_c];
        var shuffling = random(neighbors);

        var destination_r = current_r + shuffling [0];
        var destination_c = current_c + shuffling [1];

        while (destination_r &lt; 0 || destination_c &lt; 0 || destination_r &gt; this.numRows-1 || destination_c &gt; this.numCols-1) {
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

        for (var r=0; r&lt;this.numRows; r++) {
          for (var c=0; c&lt;this.numCols; c++) {
              var the_tile = this.board[r][c];
              the_tile.img = loadImage ('resources/'+str(the_tile.img_index)+'.png');
          }
        }
      }
    }
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%</pre>
<h4 class="p1">Swapping tiles:</h4>
<p class="p1">Method tile_empty_adj() returns two important values: the current empty tile (empty tile has a fixed index of [3][3], but it moves around as a result of shuffle), and also a list of empty tile’s neighbors.</p>
<p class="p1">We record mouse[x][y] when a click happens on the empty cell’s neighbors and swap their img_index so at the next iteration of draw() when the display() method is called, the tiles would be switched and now you have a new empty cell. Repeat process.</p>

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="dracula">// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    swap(nonempty, empty) {
      // takes coordinates of two tiles, swap their index
      var empty_tile = this.board[empty[0]][empty[1]];
      // print("this is empty tile &amp; img index: ", empty_tile, empty_tile.img_index);
      var new_tile = this.board [nonempty[0]][nonempty[1]];
      // print("this is new tile &amp; img index: ", new_tile, new_tile.img_index);

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

      for (var r=0; r&lt;this.numRows; r++) {            
        for (var c=0; c&lt;this.numCols; c++) {
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
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%</pre>
<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="dracula">// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function mouseClicked () {
  
  var empty, adj, empty_adj; 
  empty_adj = my_puzzle.tile_empty_adj();

  empty = empty_adj[0];
  adj = empty_adj[1];
  // print("adjacent cells: ", adj);

  mouse = [int(mouseY/my_height), int(mouseX/my_width)];

  // print(mouse);
  for(var i=0; i&lt;adj.length;i++) {
    if(mouse[0] == adj[i][0] &amp;&amp; mouse[1] == adj[i][1]) {
      // print("we are here in the swap call\n");
      // switch the empty and non-empty slots
      my_puzzle.swap(mouse, empty);
      // my_puzzle.display();
    }
  }
}
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%</pre>
<h4 class="p1">Win conditions:</h4>
<p class="p1">You win if ALL the tiles in the board have the img_index initially assigned to them e.g. tile[0][0] -&gt; img_index 0, tile[2][3] -&gt; img_index 12 and so on. The empty cell belongs to the last tile (tile[4][4]) and that’s where it should end up for the win condition to be true.</p>

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="dracula">// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      for (var r=0; r&lt;this.numRows; r++) {            
        for (var c=0; c&lt;this.numCols; c++) {
          // print(r,c, this.board[r][c].img_index);
          if (this.board[r][c].img_index != r*4 + c) {
              return false;
          }
        }
      }

      this.win = true;
      print ("won game!");
      this.win_sound.play();
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
</pre>
<h4 class="p1">Gameplay:</h4>
<p class="p1">I tried to keep the instructions very minimal:</p>
<p class="p1">1) User is presented with an instructions screen that they can go back to at any point in the game by pressing <em><strong>i</strong></em> (i = instructions)</p>
<p class="p1">2) User can start the game by pressing <em><strong>p</strong></em> (p = puzzle)</p>
<p class="p1">3) User has the choice to play the minions' music or mute it while they solve the puzzle (it has a low amplitude anyway). (<em><strong>m</strong></em> = mute, <strong><em>u</em> </strong>= unmute)</p>
<p class="p1">4) In some rounds the shuffling is very complicated (due to randomness) and the user might not want to spend a lot of time on solving it (e.g. for playtesting purposes). The user has the option to reshuffle the board by pressing <strong>s</strong> (<strong>s</strong> = shuffle).</p>

<h2>Embedded sketch:</h2>
<iframe style="width: 410px; height: 530px; overflow: hidden;" src="https://editor.p5js.org/maryami/full/VHX53WX0S"><span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start">﻿</span></iframe>
<h4 class="p1">Improvements:</h4>
<p class="p1">Currently, I’m working on writing a function that slices any image into X equal parts (very useful for puzzle purposes). This can extend the current program from a minion puzzle to any puzzle of the user’s choosing. While this function is easy to implement, the next step that involves saving each slice (of image) back to the assets folder is a bit tricky and needs some research. But overall I think the createBoard()/swap()/shuffle()/display() methods are very extendible and are basic foundations for many board games.</p>
[the end]
