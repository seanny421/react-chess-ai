import './App.css';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useState } from 'react';
import {miniMaxRoot} from './minimax.js' 

function App() {
  const [game, setGame] = useState(new Chess());
  const pieceValues = new Map([
    ['p', 1],
    ['n', 3],
    ['b', 3],
    ['r', 5],
    ['q', 9],
    ['k', 12]//this might change we'll see
  ])

  function makeMove(move){
    //check if it is a valid move
    try{
      game.move(move)
      setGame(new Chess(game.fen()))
      return true
    }
    catch (err){
      console.log(err)
      return false
    }
  }

  function onDrop(sourceSquare, targetSquare, piece){
    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      piece: piece,
      promotion: "q",
    });

    if(move === false){
      return false;
    } else{//if move was valid
      setTimeout(makeMiniMaxMove, 1000)
      return true
    }
  }

  function makeRandomMove(){
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeMove(possibleMoves[randomIndex]);
  }

  function makeMiniMaxMove(){
    const bestMove = miniMaxRoot(4, game.fen(), true)
    makeMove(bestMove)
    
  }
  
  function betterMove(){//looks 1 move ahead with minmax
    const possibleMoves = game.moves();
    const gameCopy = new Chess(game.fen())
    let bestMoveValue = getNumericalValues(gameCopy);
    let indexOfBestMove = 0;
    for(let i = 0; i < possibleMoves.length; i++){
      console.log('index: ' + i)

      try {
        gameCopy.move(possibleMoves[i]);
        const value = getNumericalValues(gameCopy)
        if(value < bestMoveValue){
          bestMoveValue = value;
          indexOfBestMove = i;
        }
        else {gameCopy.undo()}
      } catch(err){continue}

    }
    if(indexOfBestMove === 0)
      makeRandomMove()
    else
      makeMove(possibleMoves[indexOfBestMove]);
  }
  
  //get numerical value of board black is negative, white is positive (for minimax)
  //see pieceValues hashmap for values
  function getNumericalValues(game){
    // console.log(game.ascii())
    let value = 0;
    const board = game.board(); //get the board as an array
    for(let i = 0; i < board.length; i++){ //keep in mind chessboard is rows 1-8, array is 0-7
      for(let j = 0; j < board[i].length; j++){
        if(board[i][j]?.color === 'w'){
          value += pieceValues.get(board[i][j]?.type)
        }
        if(board[i][j]?.color === 'b')
          value -= pieceValues.get(board[i][j]?.type)
      }
    }
    // console.log(value);
    return value;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div id='controls' className='flex flex-col'>
          <button className='rounded-lg border border-white p-2 px-4 hover:bg-white hover:text-black' onClick={() => setGame(new Chess())}>RESTART</button>
          <button className='rounded-lg border border-white p-2 px-4 hover:bg-white hover:text-black' onClick={() => getNumericalValues(game)}>LOG</button>
          <button className='rounded-lg border border-white p-2 px-4 hover:bg-white hover:text-black' onClick={() => miniMaxRoot(3, game.fen(), false)}>MOVE white</button>
        </div>
        <div className='w-1/2'>
          <Chessboard position={game.fen()} onPieceDrop={onDrop} />
        </div>
        {game.isGameOver() &&
          <div className='p-4 absolute top-50 left-50 bg-black text-white'>
            <h1>GAME OVER</h1>
            <button onClick={() => setGame(new Chess())}>RESTART</button>
          </div>
        }
      </header>
    </div>
  );
}

export default App;
