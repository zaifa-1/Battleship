import { GameBoard } from "./gameBoard";

let board= new GameBoard()

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


function placeShipsOnBoard(){

    board.placeRandomShips()
    let fleet= board.fleet;
    for(let ships in fleet){
        let ship= fleet[ships]
        let shipPosition= ship.coordinates
        for(let i=0; i< shipPosition.length; i++){
            let selection= document.querySelector(`[data-cell=${shipPosition[i][0]}-${shipPosition[i][1]}]`)
            selection.classList.add('red')                    
        }
    }
}

placeShipsOnBoard()