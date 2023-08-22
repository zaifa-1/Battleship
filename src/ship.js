
// individual ships that will be placed on the board
export class Ship{
    constructor(length, alignment= "horizontal", hitCount= 0, sunk= false){
        this.length= length
        this.alignment= alignment
        this.hitCount= hitCount;
        this.sunk= sunk;
        this.coordinates= []
    }

    // if the ship is hit by an enemy, increase the hitCount
    hit(){
        this.hitCount+=1
    }

    // check if the ship has sunk or not
    isSunk(){
        if(this.hitCount === this. length) return this.sunk = true
        return this.sunk
    }
}

