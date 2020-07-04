/////////////////variables///////////////////////////////
var resetbutton=document.getElementById('play-again');
var boardWrap=document.querySelector('#board_wrap');
var board=document.querySelector('#board');
var allSquares=document.querySelectorAll('.square');
var winnerDisplay=document.getElementById('winner');
var winningMessege=document.querySelector('.winning-messege');
var squares= document.querySelectorAll(".square");

var winningCombination=[-1,-1,-1];
var filled=0;
var movesPlayed=0;
var player1='X';
var player2='O';
var currentPlayer=1;
var winningCombos=
[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];
////////////////////////////////////////////////////////////



/////////////////// Event Listeners////////////////////////

resetbutton.addEventListener('click',resetBoard);
for (var i = 0 ; i < squares.length; i++) {
    squares[i].addEventListener('click' , playerMoved ) ; 
}

///////////////////////////////////////////////////////////


////////////////////Functions/////////////////////////////

function resetBoard()
{
    allSquares.forEach(resetToNull);
    winnerDisplay.innerHTML="";
    movesPlayed=0;
    winningMessege.classList.remove("show-winning-messege");
}
function resetToNull(item)
{
    item.innerHTML="";
    for(var i=0;i<3;i++)
        winningCombination[i]=-1;
    item.classList.remove("blur","not-allowed","unhover","highlight-winning-square");
}
function highlightWinningSquares(item,index)
{
    if(index!=winningCombination[0] && index!=winningCombination[1] && index!=winningCombination[2])
        item.classList.add("blur","not-allowed","unhover");
    else
        item.classList.add("highlight-winning-square");
}   
function playerMoved(event)
{
    if(currentPlayer===1 && event.target.innerHTML==="")
    {
        event.target.innerHTML=player1;
        currentPlayer++;
        movesPlayed++;
    }
    else if(currentPlayer===2 && event.target.innerHTML===""){
        event.target.innerHTML=player2;
        currentPlayer--;
        movesPlayed++;
    }
    if(movesPlayed>4 && checkIfWinnerExist())
    {
        var winner;
        currentPlayer===2?winner="X wins!!":winner="O wins!!"; 
        winnerDisplay.innerHTML=winner;
        winningMessege.classList.add("show-winning-messege");
        allSquares.forEach(highlightWinningSquares);
    }
    else if(movesPlayed===9)
        declareDraw();
}
function checkIfWinnerExist()
{
    var moves=Array.prototype.slice.call(squares);
    var results=moves.map(function(square){
        return square.innerHTML;
    });
    return winningCombos.find(function(combo,index) {
        if (results[combo[0]] !== "" && results[combo[1]] !== "" && results[combo[2]] !== "" && results[combo[0]] === results[combo[1]] && results[combo[1]] === results[combo[2]]) {
        {
            winningCombination[0]=combo[0];
            winningCombination[1]=combo[1];
            winningCombination[2]=combo[2];
            return true;
        }
        }
        else 
            return false;
        
    });
}
function declareDraw(){
    winnerDisplay.innerHTML="It's a Draw :/";
    winningMessege.classList.add("show-winning-messege");
    allSquares.forEach(highlightWinningSquares);
}
////////////////////////////////////////////////////////////////////////////