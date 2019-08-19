var x = 200;
var y = 150;
var dx = 1;
var dy = -3;
var ctx, width, height, paddlex, bricks, brickWidth;
var paddleh = 10;
var paddlew = 75;
var canvasMinX = 0;
var canvasMaxX = 0;
var intervalId = 0;
var nrows = 5;
var ncols = 5;
var brickHeight = 15;
var padding = 1;

function init() {
  //get a reference to the canvas
  ctx = $('#canvas')[0].getContext("2d");
  width = $("#canvas").width();
  height = $("#canvas").height();
  paddlex = width / 2;
  brickWidth = (width/ncols) - 1;
  canvasMinX = $("#canvas").offset().left;
  canvasMaxX = canvasMinX + width;
  //run draw function every 10 milliseconds to give the illusion of movement
  intervalId = setInterval(draw, 10);
}

function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, width, height);
  rect(0,0,width,height);
}

function onMouseMove(evt) {
  //set the paddle position if the mouse position is within the borders of the canvas
  if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
    paddlex = Math.max(evt.pageX - canvasMinX - (paddlew/2), 0);
    paddlex = Math.min(width - paddlew, paddlex);
  }
}

function initbricks() {
    bricks = new Array(nrows);
    for (i=0; i < nrows; i++) {
        bricks[i] = new Array(ncols);
        for (j=0; j < ncols; j++) {
            bricks[i][j] = 1;
        }
    }
}

function drawbricks() {
  for (i=0; i < nrows; i++) {
    ctx.fillStyle = rowcolors[i];
    for (j=0; j < ncols; j++) {
      if (bricks[i][j] == 1) {
        rect((j * (brickWidth + padding)) + padding, 
             (i * (brickHeight + padding)) + padding,
             brickWidth, brickHeight);
      }
    }
  }
}

var ballRadius = 10;
var rowcolors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];
var paddlecolor = "#000";
var ballcolor = "#000";
var backcolor = "#fff";

function draw() {
  ctx.fillStyle = backcolor;
  clear();
  ctx.fillStyle = ballcolor;
  //draw the ball
  circle(x, y, ballRadius);
  ctx.fillStyle = paddlecolor;
  //draw the paddle
  rect(paddlex, height-paddleh, paddlew, paddleh);
  drawbricks();

  //check if we have hit a brick
  rowheight = brickHeight + padding;
  colwidth = brickWidth + padding;
  row = Math.floor(y/rowheight);
  col = Math.floor(x/colwidth);
  //if so reverse the ball and mark the brick as broken
  if (y < nrows * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
    dy = -dy;
    bricks[row][col] = 0;
  }
 
  //contain the ball by rebouding it off the walls of the canvas
  if (x + dx > width || x + dx < 0)
    dx = -dx;

  if (y + dy < 0)
    dy = -dy;
  else if (y + dy > height - paddleh) {
    //checking if the ball is hitting the paddle and if it is rebound it
    if (x > paddlex && x < paddlex + paddlew) {
      dy = -dy;
    }
    else if (y + dy > height)
      //game over, so stop the animation
      clearInterval(intervalId);
  }
  x += dx;
  y += dy;
}

//#when the user moves the mouse it calls the onMouseMove function
$(document).mousemove(onMouseMove);
init();
initbricks();