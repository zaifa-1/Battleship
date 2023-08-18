// import _ from 'lodash';
import './style.css';
import { GameDOM } from './gameDOM';


let playerCells= document.querySelectorAll('.player > .cell');
let computerCells= document.querySelectorAll('.computer > .cell');


playerCells.forEach((cell, index) => {
   let cellRow= Math.floor(index/10)
   let cellCol= index % 10

   cell.setAttribute('data-cell', `${cellRow}-${cellCol}`)

})

computerCells.forEach((cell, index) => {
    let cellRow= Math.floor(index/10)
    let cellCol= index % 10

    cell.setAttribute('data-cell', `${cellRow}-${cellCol}`)

})

let board= new GameDOM()

board.playGame()
board.placeShipsOnBoard()


// board.highlightHoveredCells(3)
// board.displayComputerAttack()
// board.displayComputerAttack()

// boards.displayReceivedAttack(5,5)



