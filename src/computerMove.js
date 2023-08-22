
export class Computer{
    constructor(){
        //store all the moves in an array,
        this.allMoves= []
        //if the last move was a hit(call the check coordinates method),
        //then next move should be [x,y+1], else generate a random number
    }

    playMove(opponentBoard){

        // let lastMove= this.allMoves.pop()

        // if(this.allMoves.length !== 0 && opponentBoard.checkCoordinates()  ){

        // }

        let xCoordinate= Math.floor(Math.random()*10);
        let yCoordinate= Math.floor(Math.random()*10);
    
        let move= [xCoordinate, yCoordinate]
    
        if(!opponentBoard.attacks.has(move.toString())){
            return move
        }
        //change the coordinates and check again if the move is valid
        return this.playMove(opponentBoard)
    }

}
