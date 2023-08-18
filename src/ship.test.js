import { Ship } from "./ship";

let ship= new Ship(4)

ship.hit()
ship.hit()
ship.hit()
ship.hit()


test('length of ship', () => {
    expect(ship.length).toBe(4);
})

test('hits on ship', () => {
    expect(ship.hitCount).toBe(4);
})

test('is the ship sunk', () => {
    expect(ship.isSunk()).toBe(true);
})

