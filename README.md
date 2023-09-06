# BattleShip

<a href="https://zaifa-1.github.io/Battleship/" target= "blank">Live preview</a>

A classic Battleship game developed using JavaScript, HTML, and CSS, featuring Test-Driven Development (TDD) to ensure the logic's correctness before implementation.

## Table of Contents
- [About](#about)
- [Game Logic](#game-logic)
  - [Ship Class](#ship-class)
  - [GameBoard Class](#gameboard-class)
  - [GameDOM Class](#gamedom-class)
  - [Computer Class](#computer-class)
- [How to Play](#how-to-play)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

## About
This project implements the classic Battleship game, providing a user interface (UI) for gameplay while maintaining a solid logic foundation. The game consists of several JavaScript classes to manage ships, game boards, user interactions, and computer opponent moves.

## Game Logic

### Ship Class
The `Ship` class creates ships placed on the game board. It includes methods to handle hits and check if the ship has sunk.

```javascript

// individual ships that will be placed on the board
class Ship{
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
```

### GameBoard Class
The GameBoard class manages individual game boards, tracks ships, and receives attacks from opponents. It also handles ship placement on the board, validates coordinates, and more.

```javascript
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

```

### GameDOM Class
The GameDOM class is responsible for the game's UI and initialization of the boards. It allows players to place ships manually or randomly, switch turns, and displays attack results.

```javascript
import { GameBoard } from "./gameBoard";
import { Computer } from "./computerMove";

// this helps with the UI of the game and initializes the boards
// GameDom class uses ALL the logic that was implemented in the gameBoard file and provides UI for the user
export class GameDOM{
    constructor(playerBoard= new GameBoard() , computerBoard= new GameBoard() ){
        //boards
        this.pBoard= document.querySelector('#player')
        this.cBoard= document.querySelector('#computer')

        //player that will make the move
        this.currentPlayer= null

        //players board where all the ships will be placed
        this.playerGameBoard= playerBoard

        // No. of ships that have been placed
        this.shipsPlaced= 0

        //computers board where all the ships will be placed
        this.computerGameBoard= computerBoard

        //computers AI that will make the moves (players opponent)
        this.comp= new Computer()


        //query selectors and event listeners that need to be set up
        this.randomSelection= document.querySelector('.random-btn')

        this.btnContainer= document.querySelector('.btn-container')

        this.computerContainer= document.querySelector('.computer-container')

        this.placementText= document.querySelector('.ship-placement')

        this.modal= document.querySelector('.overlay')
        this.announceWinner= document.querySelector('.overlay-text')

        this.restartBtn= document.querySelector('.restart')
        this.restartBtn.addEventListener('click', ()=>{
            this.restartGame()
        })

    }


    //get the coordinates of the cell that was clicked 
    getCoords(e){
        let coord= e.target.dataset.cell
        let row= Number (coord.slice(0,1))
        let col= Number (coord.slice(coord.length-1))
        return [row,col]
    }


    //initialize both boards and add the ability to attack the computers board
    initializeBoards(){
        //eventlistener
        this.cBoard.addEventListener('click',(e)=>{
            if(!e.target.classList.contains('cell')) return
            let attack= this.getCoords(e)
            if(this.currentPlayer === 'player' && !this.computerGameBoard.attacks.has([attack[0], attack[1]].toString()) ){
                
                this.displayReceivedAttack(attack[0], attack[1], this.computerGameBoard, '#computer')
    
                let cell= document.querySelector(`.computer > [data-cell="${attack[0]}-${attack[1]}"]`)
                cell.classList.remove('valid')
                cell.classList.add('invalid')
                this.switchPlayer()

            } 
            return
        })

        //initializing the boards  
        for(let i= 0; i< 10; i++){
            for(let j= 0; j< 10; j++){
                let div= document.createElement('div')
                div.classList.add('cell')
                div.setAttribute('data-cell', `${i}-${j}`)
                
                let div2= document.createElement('div')
                div2.classList.add('cell')
                div2.classList.add('valid')
                div2.setAttribute('data-cell', `${i}-${j}`)

                this.pBoard.appendChild(div)
                this.cBoard.appendChild(div2)
            }
        }

    }

    //start the game
    playGame(){
        this.btnContainer.classList.remove('hidden')
        this.computerContainer.classList.add('hidden')
        this.pBoard.classList.remove('invalid')

        this.shipsPlaced= 0

        this.initializeBoards()

        this.computerGameBoard.placeRandomShips()

        this.placeShipsManually()

        this.currentPlayer= 'player'

        this.randomSelection.addEventListener('click', ()=>{
            this.placeShipsOnBoard()
        })
    }

    //switch player after each turn
    switchPlayer(){
        if(this.currentPlayer === 'player'){
            this.currentPlayer= 'computer'
            this.displayComputerAttack()
            this.switchPlayer()
        }else this.currentPlayer= 'player'
    }


    //place ships one by one on the board
    placeShipsManually(){
        
        this.highlightHoveredCells()
        
        this.pBoard.addEventListener('click', (e) => {
            if(!e.target.classList.contains('cell')) return
            
            let fleet= this.playerGameBoard.fleet
            let shipName= Object.keys(this.playerGameBoard.fleet)[this.shipsPlaced] //name of the ship
            let selectedShip= fleet[shipName] //selected ship that will be placed on the board
            
            
            
            let placement = this.getCoords(e);
            
            if(this.playerGameBoard.shipIsValid(placement[0], placement[1], selectedShip)){ //check if the coordinate is valid or not
                
                this.playerGameBoard.placeShip(placement[0], placement[1], selectedShip); //place ship on the given coords
                
                let shipPosition= selectedShip.coordinates
                
                for(let i=0; i< shipPosition.length; i++){
                    let selection= document.querySelector(`.player > [data-cell="${shipPosition[i][0]}-${shipPosition[i][1]}"]`)
                    selection.classList.add('blue')                    
                    selection.classList.remove('hover-clr')                    
                }
                
                this.shipsPlaced++

                shipName= Object.keys(this.playerGameBoard.fleet)[this.shipsPlaced] // updating name of the ship for DOM content
                this.placementText.textContent= `place your ${shipName}` //update the ship name on DOM

                //check if all ships have been placed and start the game
                if(this.shipsPlaced === (Object.keys(this.playerGameBoard.fleet).length)){

                    this.computerContainer.classList.remove('hidden')
                    this.btnContainer.classList.add('hidden')
                    this.placementText.textContent= 'Time for Battle'
                    this.pBoard.classList.add('invalid')
                    this.removeHighlight()
                    return
                }
            }


        });
        
    }

    //randomly place all the ships
    placeShipsOnBoard(){

        this.computerContainer.classList.remove('hidden')
        this.btnContainer.classList.add('hidden')
        this.shipsPlaced= Object.keys(this.playerGameBoard.fleet).length
        this.placementText.textContent= 'Time for Battle'

        //remove any extra highlighted cells
        this.removeHighlight()

        //remove any ships that were placed manually
        let cells= document.querySelectorAll('.player > .cell')
        cells.forEach((cell)=>{
            cell.classList.remove('blue')
        })

        this.playerGameBoard.ships= new Set()
        this.playerGameBoard.placeRandomShips()
        let fleet= this.playerGameBoard.fleet;
        for(let ships in fleet){
            let ship= fleet[ships]
            let shipPosition= ship.coordinates
            for(let i=0; i< shipPosition.length; i++){
                let selection= document.querySelector(`.player > [data-cell="${shipPosition[i][0]}-${shipPosition[i][1]}"]`)
                selection.classList.add('blue')                    
            }
        }
    }


    //highlight the ships position for users convenience to know if the coords are valid or no
    highlightHoveredCells(){
        
        this.pBoard.addEventListener('mouseover', (e)=>{
            if(!e.target.classList.contains('cell')) return
            let selection= this.getCoords(e);

            let fleet= this.playerGameBoard.fleet
            let shipName= Object.keys(this.playerGameBoard.fleet)[this.shipsPlaced] //name of the ship
            let selectedShip= fleet[shipName] //selected ship that will be placed on the board
            let size= selectedShip.length


            let x= selection[0]
            let y= selection[1]

            this.removeHighlight()
            for(let i= 0; i < size && y + i <=9 ; i++){

                let cell= document.querySelector(`.player > [data-cell="${x}-${y+i}"]`)

                if(this.playerGameBoard.shipIsValid(x, y, selectedShip)){
                    
                    cell.classList.add('hover-clr')

                }

                else cell.classList.add('red')

            }
        })

    }

    //mainly a helper function for highlightHoveredCells(), it updates the currently highlighted cells in real time
    removeHighlight(){
        let cells= document.querySelectorAll('.player > .cell')
        cells.forEach((cell)=>{
            cell.classList.remove('hover-clr')
            cell.classList.remove('red')
        })
    }

    //the attack received by the board is displayed 
    displayReceivedAttack(x,y, selectedGameBoard, selectedBoard){
        let attack= selectedGameBoard.receiveAttack(x,y)

        let selection= document.querySelector(`${selectedBoard} > [data-cell="${x}-${y}"]`)

        //if attack was successful then mark the ship
        if(attack){
            selection.classList.add('red')
            if(selectedGameBoard.checkLoss()){
                this.modal.showModal()
                if(selectedGameBoard === this.computerGameBoard){
                    this.announceWinner.textContent= 'YOU WON :D'
                }
                else this.announceWinner.textContent= 'YOU LOST :('
                
            }
        }
        //if attack was a miss then mark the coords
        else selection.classList.add('green')

    }

    //display the attack made by the computer
    displayComputerAttack(){
        let compAttack= this.comp.playMove(this.playerGameBoard)

        this.displayReceivedAttack(compAttack[0], compAttack[1], this.playerGameBoard, '#player')
    }

    // restart the game and play again
    restartGame(){
        this.pBoard.innerHTML= ''
        this.cBoard.innerHTML= ''
        this.placementText.textContent= 'place your warShip'
        this.playerGameBoard= new GameBoard()
        this.computerGameBoard= new GameBoard()
        
        this.modal.close()
        this.playGame()

    }
}
```
### Computer Class
The Computer class generates computer moves for attacking the player's board. It employs strategies to make more accurate attacks.
```javascript
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

```
## How to Play
To play the BattleShip game, follow these steps:

1. **Ship Placement:**
   - The game starts with ship placement. You can choose to place your ships manually or let the computer place them randomly.

   - If you want to place ships manually, follow these steps:
     - Click on your game board cells to select ship positions.
     - Ensure that the chosen coordinates are valid, and the ship fits within the boundaries of the board.
     - Place all your ships on the board.

   - If you prefer random placement, click the "Random Placement" button.

2. **Gameplay:**
   - After ship placement, the game begins.
   - Click on the computer's game board cells to attack your opponent.
   - Hits and misses are displayed on the board, and you'll see the outcome of your attacks.

3. **Winning the Game:**
   - The game continues until one player's fleet is entirely sunk.
   - If you sink all the computer's ships, you win!
   - If the computer sinks all your ships, you lose.

## Getting Started
Follow these steps to get started with BattleShip on your local machine:

1. **Clone the Repository:**
   - Clone this repository to your local machine using the following command:
     ```
     git clone https://github.com/zaifa-1/Battleship
     ```

2. **Open the Game:**
   - Open the project folder in your preferred code editor.

3. **Launch the Game:**
   - Open the `index.html` file in a web browser to start playing BattleShip.

4. **Enjoy the Game:**
   - Follow the on-screen instructions to play the game.

## Contributing
We welcome contributions from the open-source community to enhance BattleShip. If you'd like to contribute, please follow these guidelines:

1. **Fork the Repository:**
   - Fork this repository to your GitHub account.

2. **Create a Branch:**
   - Create a feature branch for your contribution.

3. **Make Changes:**
   - Implement your desired features or improvements.

4. **Testing:**
   - Ensure that your changes are tested thoroughly.

5. **Commit and Push:**
   - Commit your changes and push them to your forked repository.

6. **Create a Pull Request:**
   - Create a pull request to submit your changes.

7. **Review and Collaborate:**
   - Collaborate with the project maintainers to review and refine your contribution.

8. **Contribution Accepted:**
   - Once your contribution is accepted, it will be merged into the main repository.

Thank you for contributing to BattleShip!


