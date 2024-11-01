

import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBoard = document.getElementById('game-board');

const grid = new Grid(gameBoard);
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));

setupinputOnce();

function setupinputOnce() {
    window.addEventListener('keydown', handleInput, {once: true});
    
}

async function  handleInput(event){
   switch (event.key) {
    case 'w':
        if(!canMoveUp()){
            setupinputOnce();
            return;
        }
       await moveUp();
        break;
        case 's':
            if(!canMoveDown()){
                setupinputOnce();
                return;
            }
       await moveDown();
        break;
        case 'a':
            if(!canMoveLeft()){
                setupinputOnce();
                return;
            }
       await moveLeft();
        break;
        case 'd':
            if(!canMoveRight()){
                setupinputOnce();
                return;
            }
       await MoveRight();
        break;
   
    default:
        setupinputOnce();
        return;
   }

   const newTile = new Tile(gameBoard);
   grid.getRandomEmptyCell().linkTile(newTile);

   if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()){
        await newTile.waitForAnimationEnd();
        alert("Try Again :(");
        return;
   }

   setupinputOnce();
}

async function moveUp(){
   await slideTiles(grid.cellsGropedByColumn);
}

async function moveDown(){
   await slideTiles(grid.cellsGroupByReverseColumn);
}

async function moveLeft(){
   await slideTiles(grid.cellsGropedByRow);
}

async function MoveRight(){
   await slideTiles(grid.cellsGropedByReverseRow);
}

async function slideTiles(groupedCells) {
    const promices = [];

    groupedCells.forEach(group => slideTilesInGroup(group, promices));

    await Promise.all(promices);

    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles();
    })
}

 function slideTilesInGroup(group, promices) {
    for (let i = 1; i < group.length; i++) {
        if (group[i].isEmpty()){
            continue;
        }
        const cellWithTile = group[i];

        let taretCell;
        let j = i - 1;

        while(j>=0 && group[j].canAccept(cellWithTile.linkedTile)) {
            taretCell = group[j];
            j--;
        }

        if (!taretCell) {
            continue;
        }

        promices.push(cellWithTile.linkedTile.waitForTransition());

        if ( taretCell.isEmpty()){
            taretCell.linkTile(cellWithTile.linkedTile);
        }else{
            taretCell.linkTileForMerge(cellWithTile.linkedTile);
        }

        cellWithTile.unLinkTile();
    }
}

function canMoveUp(){
    return canMove(grid.cellsGropedByColumn);
}

function canMoveDown(){
    return canMove(grid.cellsGroupByReverseColumn);
}

function canMoveLeft(){
    return canMove(grid.cellsGropedByRow);
}

function canMoveRight(){
    return canMove(grid.cellsGropedByReverseRow);
}

function canMove(groupedCells){
    return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group){
    return group.some((cell, index) => {
        if(index === 0){
            return false;
        }

        if(cell.isEmpty()){
            return false;
        }

        const targetCell = group[index -1];
        return targetCell.canAccept(cell.linkedTile);
    });
}