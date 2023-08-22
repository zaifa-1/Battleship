
export class Computer{
    constructor(){
        //store all the moves in an array,
        this.allMoves= []
        //if the last move was a hit(call the check damage method),
        //then next move should be [x,y+1], else generate a random number
    }

    playMove(opponentBoard){

      if(this.allMoves.length !== 0){
        let lastMove= this.allMoves.pop()
        let nextMove= [lastMove[0],lastMove[1]+1]
        if(opponentBoard.checkDamage(opponentBoard.fleet,lastMove[0], lastMove[1])){

          if(!opponentBoard.attacks.has(nextMove.toString()) && nextMove[1]<=9){
                this.allMoves.push(nextMove)
                return nextMove
            }
          
        }
        
      }


        let xCoordinate= Math.floor(Math.random()*10);
        let yCoordinate= Math.floor(Math.random()*10);
    
        let move= [xCoordinate, yCoordinate]
    
        if(!opponentBoard.attacks.has(move.toString())){
            this.allMoves.push(move)
            return move
        }
        //change the coordinates and check again if the move is valid
        return this.playMove(opponentBoard)
    }

}
