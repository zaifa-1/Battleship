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