// computer class that generates moves for the computer to play and attack the players board
export class Computer{
    constructor(){
        //store all the moves in an array,
        //if the last move was a hit(call the checkDamage method)
        this.allMoves= []
        //initial move tracks what the first random attack was to attack any extra coordinates that might have been missed by the computer
        this.initialMove= null;
    }

    //main function that attacks player board
    playMove(opponentBoard){

        //extra steps to produce more accurate attacks 
      if(this.allMoves.length !== 0){
        let lastMove= this.allMoves.pop()
        let nextMove= [lastMove[0],lastMove[1]+1]

        //if last move was a hit on enemy ship, the net move should be the coordinate to the immediate right
        if(opponentBoard.checkDamage(opponentBoard.fleet,lastMove[0], lastMove[1])){

          if(!opponentBoard.attacks.has(nextMove.toString()) && nextMove[1]<=9){
                this.allMoves.push(nextMove)
                return nextMove
            }
            
        }
        //if last move was not a hit, check what the initial attack coords were and hit the coords to its immediate left
        nextMove= [this.initialMove[0], this.initialMove[1]-1]
        if(opponentBoard.checkDamage(opponentBoard.fleet,this.initialMove[0], this.initialMove[1])){
            if(!opponentBoard.attacks.has(nextMove.toString()) && nextMove[1]>=0){
                this.initialMove= nextMove
                this.allMoves.push(nextMove)
                return nextMove
            }

        }
        
      }

        // generate random coords
        let xCoordinate= Math.floor(Math.random()*10);
        let yCoordinate= Math.floor(Math.random()*10);
    
        let move= [xCoordinate, yCoordinate]
        //if the randomly generated coordinates have not been hit yet, then attack that position
        if(!opponentBoard.attacks.has(move.toString())){
            this.allMoves.push(move)
            this.initialMove= move
            return move
        }
        //change the coordinates and check again if the move is valid
        return this.playMove(opponentBoard)
    }

}
