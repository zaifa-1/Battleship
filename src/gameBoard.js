import { Ship } from "./ship";

export class GameBoard{
    constructor(){
        this.ships= new Set();
        this.attacks= new Set()

        // add the fleet in the board
        this.fleet={
            warShip: new Ship(5),
            submarine: new Ship(4),
            pocketShip: new Ship(3),
            destroyer: new Ship(3),
            dummy: new Ship(2)
        }
    }


    placementIsValid(x,y){
        // if the col number, plus the ship length is less than 8 and >= 0, return true
        if(x<10 && x>=0 && y<10 && y>=0){
            // if the row and col number have not been preoccupied by another ship, return true
            return !this.ships.has([x,y].toString())
        }
        return false
    }

    placeShip(x,y, ship){
        if(!this.placementIsValid(x, y + (ship.length-1))) return
        for(let i=0; i<ship.length; i++){
            let values= [x,y+i]
            let values2= [x+1, y+i]
            let values3= [x-1, y+i]
            //ship
            this.ships.add(values.toString())

            //upper
            if(this.placementIsValid(values3[0],values3[1])){
                this.ships.add(values3.toString())
            }

            //lower
            if(this.placementIsValid(values2[0],values2[1])){
                this.ships.add(values2.toString())
            }

            //-1
            if(this.placementIsValid(x, y-1)){
                this.ships.add([x, y-1].toString())
            }

            //+1
            if(!this.placementIsValid(x, y + (ship.length-1))){
                this.ships.add([x, y + (ship.length)].toString())
            }

            //upper right diagonal
            if(this.placementIsValid(x-1, y+ship.length)){
                this.ships.add([x-1, y+ship.length].toString())
            }

            //lower right diagonal
            if(this.placementIsValid(x+1, y+ship.length)){
                this.ships.add([x+1, y+ship.length].toString())
            }

            //lower left diagonal
            if(this.placementIsValid(x+1, y-1)){
                this.ships.add([x+1, y-1].toString())
            }

            //upper left diagonal
            if(this.placementIsValid(x-1, y-1)){
                this.ships.add([x-1, y-1].toString())
            }
            
            ship.coordinates.push(values)
        }

        return ship.coordinates
    }

    placeShipVertical(x,y, ship){
        if(!this.placementIsValid(x + (ship.length-1), y)) return
        for(let i=0; i<ship.length; i++){
            let values= [x+i,y]
            let values2= [x+i, y+1]
            let values3= [x-i, y+1]
            //ship
            this.ships.add(values.toString())

            //previous cells
            if(this.placementIsValid(values3[0],values3[1])){
                this.ships.add(values3.toString())
            }

            //next cells
            if(this.placementIsValid(values2[0],values2[1])){
                this.ships.add(values2.toString())
            }

            //-1
            if(this.placementIsValid(x, y-1)){
                this.ships.add([x-1, y].toString())
            }

            //+1
            if(!this.placementIsValid(x, y + (ship.length-1))){
                this.ships.add([x + (ship.length), y].toString())
            }

            //upper right diagonal
            if(this.placementIsValid(x-1, y+1)){
                this.ships.add([x-1, y+1].toString())
            }

            //lower right diagonal
            if(this.placementIsValid(x + ship.length, y+1)){
                this.ships.add([x + ship.length, y+1].toString())
            }

            //lower left diagonal
            if(this.placementIsValid(x + ship.length, y-1)){
                this.ships.add([x + ship.length, y-1].toString())
            }

            //upper left diagonal
            if(this.placementIsValid(x-1, y-1)){
                this.ships.add([x-1, y-1].toString())
            }
            
            ship.coordinates.push(values)
        }
        
        return ship.coordinates
    }







    checkCoordinates(ship,x,y){
        for(let position in ship.coordinates){
          if(ship.coordinates[position][0]===x && ship.coordinates[position][1]===y){
            return true
          }
        }
          return false
      }

      checkDamage(a,x,y){
  
        for(let ships in a){
          if(this.checkCoordinates(a[ships], x,y)){
            return a[ships]
          }
        }
        return null
        }

    checkLoss(){
        for(let ship in this.fleet){
            if(this.fleet[ship].sunk !== true){
                return false
            }
        }
        return true
    }    

    receiveAttack(x,y){
        let attackPosition= this.checkDamage(this.fleet, x, y)
      
        //check whether or not the coordinates have already been attacked
        if(attackPosition !== null){
            
          this.attacks.add([x,y].toString())
            
            attackPosition.hit()
            attackPosition.isSunk()

            if(this.checkLoss()){
              console.log('game over')
            }
          return true
        } 
        this.attacks.add([x,y].toString())
        return false
        
    }


    placeRandomShips(){
        let fleetLength= Object.keys(this.fleet).length

        for (let i= 0; i < fleetLength; i++){
            let xCoordinate= Math.floor(Math.random()*10);
            let yCoordinate= Math.floor(Math.random()*10);

            let selection= [xCoordinate, yCoordinate];

            if(!this.ships.has(selection.toString())){

                let ship= Object.keys(this.fleet)[i]
              if(this.placementIsValid(xCoordinate, yCoordinate + (this.fleet[ship].length -1))){
                
                this.placeShip(xCoordinate, yCoordinate, this.fleet[ship])
                
              }
              else i--
            }
            else i--
        }
    }

}
