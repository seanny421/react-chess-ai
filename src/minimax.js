import { Chess } from "chess.js";
const pieceValues = new Map([
  ['p', 1],
  ['n', 3],
  ['b', 3],
  ['r', 5],
  ['q', 9],
  ['k', 12]//this might change we'll see
])

export function miniMaxRoot(depth, gamestring, isAIPlayer){//AI player is black
  //create copy so we don't mess with original game
  const gameCopy = new Chess(gamestring);
  let moves = gameCopy.moves({verbose: true});
  let bestEval = -9999;
  //init bestMove to be decided later
  let bestMove;
  //loop through each move, create recursion until depth has been met
  for(let i = 0; i < moves.length; i++){
    let move = moves[i]
    gameCopy.move(move)
    let value = minimaxAlphaBetaPruning(depth - 1, gameCopy, -Infinity, Infinity, !isAIPlayer)
    // let value = minimax(depth - 1, gameCopy, !isAIPlayer)
    gameCopy.undo();//move game back to original state
    if(value >= bestEval){
      bestEval = value;
      bestMove = move;
    }
  }
  return bestMove;
}

function minimaxAlphaBetaPruning(depth, game, alpha, beta, isAIPlayer){
  //base case
  if(depth === 0){
    return -getNumericalValues(game);
  }
  let moves = game.moves({verbose: true});
  if(isAIPlayer){//minimising
    let bestEval = 9999;
    for(let i = 0; i < moves.length; i++){
      game.move(moves[i]);
      bestEval = Math.min(bestEval, minimaxAlphaBetaPruning(depth - 1, game, alpha, beta, !isAIPlayer))
      game.undo()
      //alpha-beta pruning
      beta = Math.min(beta, bestEval);
      if(beta <= alpha){
        break;
      }
    }
    return bestEval;
  }
  else {
    let bestEval = -9999;
    for(let i = 0; i < moves.length; i++){
      game.move(moves[i]);
      bestEval = Math.max(bestEval, minimaxAlphaBetaPruning(depth - 1, game, alpha, beta, !isAIPlayer))
      game.undo()

      //alpha beta pruning
      alpha = Math.max(alpha, bestEval)
      if(beta <= alpha){
        break;
      }
    }
    return bestEval;
  }

}


function minimax(depth, game, isAIPlayer){//basic minimax
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

function getNumericalValues(game){
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
  return value;
}
