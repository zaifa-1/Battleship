export class Ship{
    constructor(length, alignment= "horizontal", hitCount= 0, sunk= false){
        this.length= length
        this.alignment= alignment
        this.hitCount= hitCount;
        this.sunk= sunk;
        this.coordinates= []
    }

    hit(){
        this.hitCount+=1
    }

    isSunk(){
        if(this.hitCount === this. length) return this.sunk = true
        return this.sunk
    }
}

