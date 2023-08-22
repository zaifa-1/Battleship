import { GameBoard } from "./gameBoard";
import { Computer } from "./computerMove";


export class GameDOM{
    constructor(playerBoard= new GameBoard() , computerBoard= new GameBoard() ){
        this.pBoard= document.querySelector('#player')
        this.cBoard= document.querySelector('#computer')

        this.currentPlayer= null

        this.playerGameBoard= playerBoard
        this.shipsPlaced= 0

        this.computerGameBoard= computerBoard
        this.comp= new Computer()

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

    getCoords(e){
        let coord= e.target.dataset.cell
        let row= Number (coord.slice(0,1))
        let col= Number (coord.slice(coord.length-1))
        return [row,col]
    }

    initializeBoards(){

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

    switchPlayer(){
        if(this.currentPlayer === 'player'){
            this.currentPlayer= 'computer'
            this.displayComputerAttack()
            this.switchPlayer()
        }else this.currentPlayer= 'player'
    }

    placeShipsManually(){
        
        this.highlightHoveredCells()
        
        this.pBoard.addEventListener('click', (e) => {
            if(!e.target.classList.contains('cell')) return
            
            let fleet= this.playerGameBoard.fleet
            let shipName= Object.keys(this.playerGameBoard.fleet)[this.shipsPlaced] //name of the ship
            let selectedShip= fleet[shipName] //selected ship that will be placed on the board
            
            
            
            let placement = this.getCoords(e);
            
            if(this.playerGameBoard.shipIsValid(placement[0], placement[1], selectedShip)){ //check if the coordinate is valid or not
                
                this.playerGameBoard.placeShip(placement[0], placement[1], selectedShip);
                
                let shipPosition= selectedShip.coordinates
                
                for(let i=0; i< shipPosition.length; i++){
                    let selection= document.querySelector(`.player > [data-cell="${shipPosition[i][0]}-${shipPosition[i][1]}"]`)
                    selection.classList.add('blue')                    
                    selection.classList.remove('hover-clr')                    
                }
                
                this.shipsPlaced++

                shipName= Object.keys(this.playerGameBoard.fleet)[this.shipsPlaced] // updating name of the ship for DOM content
                this.placementText.textContent= `place your ${shipName}`

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

    placeShipsOnBoard(){

        this.computerContainer.classList.remove('hidden')
        this.btnContainer.classList.add('hidden')
        this.shipsPlaced= Object.keys(this.playerGameBoard.fleet).length
        this.placementText.textContent= 'Time for Battle'

        this.removeHighlight()

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

    removeHighlight(){
        let cells= document.querySelectorAll('.player > .cell')
        cells.forEach((cell)=>{
            cell.classList.remove('hover-clr')
            cell.classList.remove('red')
        })
    }

    displayReceivedAttack(x,y, selectedGameBoard, selectedBoard){
        let attack= selectedGameBoard.receiveAttack(x,y)

        let selection= document.querySelector(`${selectedBoard} > [data-cell="${x}-${y}"]`)

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
        else selection.classList.add('green')

    }

    displayComputerAttack(){
        let compAttack= this.comp.playMove(this.playerGameBoard)

        this.displayReceivedAttack(compAttack[0], compAttack[1], this.playerGameBoard, '#player')
    }


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