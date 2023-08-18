
export class Computer{
    constructor(){
        //store all the moves in an array,
        //if the last move was a hit(call the check coordinates method),
        //then next move should be [x,y+1], else generate a random number
    }

    playMove(opponentBoard){

        let xCoordinate= Math.floor(Math.random()*9);
        let yCoordinate= Math.floor(Math.random()*9);
    
        let move= [xCoordinate, yCoordinate]
    
        if(!opponentBoard.attacks.has(move.toString())){
            return move
        }
        //change the coordinates and check again if the move is valid
        this.playMove(opponentBoard)
    }

}
