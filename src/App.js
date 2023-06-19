import './App.css';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useState } from 'react';

function App() {
  const [game, setGame] = useState(new Chess());

  function makeMove(move){
    //check if it is a valid move
    try{
      game.move(move)
      setGame(new Chess(game.fen()))
      return true
    }
    catch (err){
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
      setTimeout(makeRandomMove, 1000)
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

  return (
    <div className="App">
      <header className="App-header">
        <Chessboard position={game.fen()} onPieceDrop={onDrop} />
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
