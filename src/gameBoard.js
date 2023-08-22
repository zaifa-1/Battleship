import { Ship } from "./ship";
// generates a gameboard that has specific boundaries that the ships placed on the gameboard cannot cross
export class GameBoard{
    constructor(){
        //a set that keeps track of all the ships on the board
        this.ships= new Set();

        // a set of all the coords that the enemy fleet has attacked
        this.attacks= new Set();

        // all the available ships
        this.fleet={
            warShip: new Ship(5),
            submarine: new Ship(4),
            pocketShip: new Ship(3),
            destroyer: new Ship(3),
            dummy: new Ship(2)
        }
    }

    // function that checks if certain coordinates are valid or not
    placementIsValid(x,y){
        // if the col number, plus the ship length is less than 8 and >= 0, return true
        if(x<10 && x>=0 && y<10 && y>=0){
            // if the row and col number have not been preoccupied by another ship, return true
            return !this.ships.has([x,y].toString())
        }
        return false
    }


    // while placing the ship on the board, check if the ship can be placed at the desired coords.
    shipIsValid(x,y,ship){
        for(let i=0; i<ship.length; i++){
            if(!this.placementIsValid(x,y+i)){
                return false
            }
        }
        return true
    }


    //place the ship on the board
    placeShip(x,y, ship){
        //if placement is not valid, return
        if(!this.placementIsValid(x, y + (ship.length-1))) return

        //reset the already existing coordinates (helps if u wanna place ships randomly on board)
        ship.coordinates= []

        //place ship and also add some out of bounds coordinates for other ships
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
            if(this.placementIsValid(x, y + (ship.length))){
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

        return true
    }


    //check if the ship has certain coords or no (helper function for checkDamage())
    checkCoordinates(ship,x,y){
        for(let position in ship.coordinates){
          if(ship.coordinates[position][0]===x && ship.coordinates[position][1]===y){
            return true
          }
        }
          return false
      }

      //after receiving an attack, check whether the attack was a hit or no
      checkDamage(fleet,x,y){
  
        for(let ships in fleet){
          if(this.checkCoordinates(fleet[ships], x,y)){
            return fleet[ships]
          }
        }
        return null
        }
    
    // check if all the ships have sunk and the battle is lost 
    checkLoss(){
        for(let ship in this.fleet){
            if(this.fleet[ship].sunk !== true){
                return false
            }
        }
        return true
    }    

    //receive attack from enemy fleet
    receiveAttack(x,y){
        let attackPosition= this.checkDamage(this.fleet, x, y)
      
        //check whether or not the coordinates have already been attacked
        if(attackPosition !== null){
            
          this.attacks.add([x,y].toString())
            
            attackPosition.hit()
            attackPosition.isSunk()
          return true
        } 
        this.attacks.add([x,y].toString())
        return false
        
    }

    // place ships randomly on board
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
