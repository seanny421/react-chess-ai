import { Chess } from "chess.js";

export function miniMaxRoot(depth, gamestring, isAIPlayer){//AI player is black
  const gameCopy = new Chess(gamestring);
  let moves = gameCopy.moves({verbose: true});
  let bestEval = -9999;
  let bestMove;
  for(let i = 0; i < moves.length; i++){
    let move = moves[i]
    gameCopy.move(move)
    var value = minimax(depth - 1, gameCopy, !isAIPlayer)
    gameCopy.undo();
    if(value >= bestEval){
      bestEval = value;
      bestMove = move;
    }
  }
  console.log(bestMove)
  return bestMove;
}

function minimax(depth, game, isAIPlayer){
  // console.log(depth)
  if(depth === 0){
    return -getNumericalValues(game);
  }
  var moves = game.moves({verbose: true});
  if(isAIPlayer){
    let bestEval = 9999;
    for(let i = 0; i < moves.length; i++){
      // console.log(moves[i])
      game.move(moves[i]);
      bestEval = Math.min(bestEval, minimax(depth - 1, game, !isAIPlayer))
      game.undo()
    }
    return bestEval;
  }
  else {
    let bestEval = -9999;
    for(let i = 0; i < moves.length; i++){
      game.move(moves[i]);
      bestEval = Math.max(bestEval, minimax(depth - 1, game, !isAIPlayer))
      game.undo()
    }
    return bestEval;
  }

}

const pieceValues = new Map([
  ['p', 1],
  ['n', 3],
  ['b', 3],
  ['r', 5],
  ['q', 9],
  ['k', 12]//this might change we'll see
])

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
