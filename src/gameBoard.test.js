import { GameBoard } from "./gameBoard";

let game= new GameBoard()

game.placeShip(2,3,game.fleet.titanic)


test('returns the damaged ship', () => {
    expect(game.checkDamage(game.fleet,2,6)).toEqual({
        length: 5,
        hitCount: 0,
        sunk: false,
        coordinates: [ [ 2, 3 ], [ 2, 4 ], [ 2, 5 ], [ 2, 6 ], [ 2, 7 ] ]
      });
});

test('returns null if no ship is hit', () => {
    expect(game.checkDamage(game.fleet,2,8)).toEqual(null);
});