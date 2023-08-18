import { GameBoard } from "./gameBoard";
import { Computer } from "./computerMove";


export class GameDOM{
    constructor(playerBoard= new GameBoard() , computerBoard= new GameBoard() ){
        this.pBoard= document.querySelector('#player')
        this.cBoard= document.querySelector('#computer')

        this.currentPlayer= 'player'
        this.gameStatus= "prepare"

        this.playerGameBoard= playerBoard

        this.computerGameBoard= computerBoard
        this.computerGameBoard.placeRandomShips()
        this.comp= new Computer()
    }

    getCoords(e){
        let coord= e.target.dataset.cell
        let row= Number (coord.slice(0,1))
        let col= Number (coord.slice(coord.length-1))
        return [row,col]
    }

    initializeBoards(){

        this.cBoard.addEventListener('click',(e)=>{
            let attack= this.getCoords(e)
            if(this.currentPlayer !== 'player' && this.computerGameBoard.attacks.has([attack[0], attack[1]].toString()) ) return

                this.displayReceivedAttack(attack[0], attack[1], this.computerGameBoard, '#computer')
    
                // let cell= document.querySelector(`.computer > [data-cell="${attack[0]}-${attack[1]}"]`)
                // cell.classList.add('invalid')
                this.switchPlayer()
        })

        for(let i= 0; i< 10; i++){
            for(let j= 0; j< 10; j++){
                let div= document.createElement('div')
                div.classList.add('cell')
                div.setAttribute('data-cell', `${i}-${j}`)

                let div2= document.createElement('div')
                div2.classList.add('cell')
                div2.setAttribute('data-cell', `${i}-${j}`)

                this.pBoard.appendChild(div)
                this.cBoard.appendChild(div2)
            }
        }

    }

    playGame(){
        this.initializeBoards()

        this.currentPlayer= 'player'

    }

    switchPlayer(){
        if(this.currentPlayer === 'player'){
            this.currentPlayer= 'computer'
            this.displayComputerAttack()
            this.switchPlayer()
        }else this.currentPlayer= 'player'
    }

    placeShipsOnBoard(){

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

    highlightHoveredCells(size){
        let board= this.pBoard

        board.addEventListener('mouseover', (e)=>{
            let selection= this.getCoords(e);
            console.log(selection)
            this.removeHighlight()
            for(let i= 0; i < size && selection[1] + i <=9; i++){
                let cell= document.querySelector(`.player > [data-cell="${selection[0]}-${selection[1]+i}"]`)
                console.log(cell.dataset.cell)
                cell.classList.add('blue')
            }
        })
    }

    removeHighlight(){
        let cells= document.querySelectorAll('.player > .cell')
        cells.forEach((cell)=>{
            cell.classList.remove('blue')
        })
    }

    displayReceivedAttack(x,y, selectedGameBoard, selectedBoard){
        let attack= selectedGameBoard.receiveAttack(x,y)
        console.log(attack)

        let selection= document.querySelector(`${selectedBoard} > [data-cell="${x}-${y}"]`)

        if(attack){
            selection.classList.add('red')
        }
        else selection.classList.add('green')

    }

    displayComputerAttack(){
        let compAttack= this.comp.playMove(this.playerGameBoard)

        this.displayReceivedAttack(compAttack[0], compAttack[1], this.playerGameBoard, '#player')
    }

}