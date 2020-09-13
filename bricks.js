const brickboard =document.getElementById("brickboard");
const brickboard_ctx=brickboard.getContext("2d");

const board_bg="WHITE";
const board_border="BLACK";
const paddle_bg="lightblue";
const paddle_border="darkblue";
const framePerSecond=50;

//create the paddle
const paddle={
    x:brickboard.clientWidth/2-100/2,
    y:brickboard.clientHeight-10,
    width: 75,
    height: 10,
    color:"lightblue",
    border:"darkblue",
    score:0
}

//create the ball
const ball={
    x:brickboard.clientWidth/2,
    y:brickboard.clientHeight-50,
    radius: 10,
    speed:5,
    velocityX:5,
    velocityY:-5,
    color:"black"
}

//draw a rectangle 
function drawRect(x,y,w,h,bg,border){
    brickboard_ctx.fillStyle=bg;
    brickboard_ctx.strokeStyle=border;
    brickboard_ctx.fillRect(x,y,w,h);
    brickboard_ctx.strokeRect(x,y,w,h);
}

//draw a circle
function drawCircle(x,y,radius,bg){
    brickboard_ctx.fillStyle=bg;
    brickboard_ctx.beginPath();
    brickboard_ctx.arc(x,y,radius,0,Math.PI*2,false);
    brickboard_ctx.closePath();
    brickboard_ctx.fill();
}

//render function
function render(){
    //clear the canvas
    drawRect(0,0,brickboard.clientWidth,brickboard.clientHeight,board_bg,board_border);

    //draw paddle
    drawRect(paddle.x,paddle.y,paddle.width,paddle.height,paddle.color,paddle.border);

    //draw ball
    drawCircle(ball.x,ball.y,ball.radius,ball.color);

    //draw bricks
    drawBricks();
}
function update(){
    ball.x+=ball.velocityX;
    ball.y+=ball.velocityY;
    if(ball.y-ball.radius<0){
        ball.velocityY=-ball.velocityY;
    }
    if(ball.x-ball.radius<0 || ball.x+ball.radius>brickboard.clientWidth){
        ball.velocityX=-ball.velocityX;
    }
    if(collision(ball,paddle)){
        ball.velocityY=-ball.velocityY;
    }
    for(var c=0;c<brickColumn;c++){
        for(var r=0;r<brickRow;r++){
            if(bricks[c][r].status===1){
                    if(collision(ball,bricks[c][r])){
                    paddle.score++;
                    ball.velocityY=-ball.velocityY;
                    bricks[c][r].status=0;
                }
            }
        }
    }
}

brickboard.addEventListener("mousemove",movePaddle)
function movePaddle(evt){
    let rect=brickboard.getBoundingClientRect();
    paddle.x=evt.clientX-rect.left-paddle.width/2;
}

//collision detection
function collision(ball,object){
    ball.top=ball.y-ball.radius;
    ball.bottom=ball.y+ball.radius;
    ball.left=ball.x-ball.radius;
    ball.right=ball.x+ball.radius;

    object.top=object.y;
    object.bottom=object.y+object.height;
    object.left=object.x;
    object.right=object.x+object.width;
    
    return object.top<ball.bottom && object.bottom>ball.top && object.left< ball.right && object.right>ball.left;    
}

// create the bricks
const brickWidth=75;
const brickHeight=10;
const brickPadding=10;
const brickColumn=6;
const brickRow=4;
const brickOffsetLeft=30;
const brickOffsetTop=30;
const brickColor="lightblue";
const brickBorder="darkblue";
var bricks=[];
for(var c=0;c<brickColumn;c++){
    bricks[c]=[];
    for(var r=0;r<brickRow;r++){
        bricks[c][r]={x:0,y:0,status:1,width:brickWidth,height:brickHeight};
    }
}
function drawBricks(){
    for(let c=0;c<brickColumn;c++){
        for(let r=0;r<brickRow;r++){
            var brickX=(c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY=(r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x=brickX;
            bricks[c][r].y=brickY;
            if(bricks[c][r].status===1){
                drawRect(brickX,brickY,brickWidth,brickHeight,brickColor,brickBorder);
            }
        }
    }
}
function has_ended_game(){
    if(ball.y+ball.radius>brickboard.clientHeight){
        alert("game over");
        document.location.reload();
        clearInterval(interval);
    }
    if(paddle.score===brickColumn*brickRow){
        alert("you win");
        document.location.reload();
        clearInterval(interval);
    }
}
//start game()
function game(){
    has_ended_game();
    update();
    render();

}

var interval=setInterval(game,1000/framePerSecond);



