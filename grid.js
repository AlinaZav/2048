import { Cell } from "./cell.js";

const gridSize = 4;
const cellCount = gridSize * gridSize;

export class Grid {
    constructor(gridElement){
        this.cells = [];

        for (let i = 0; i < cellCount; i++) {
            this.cells.push(
                new Cell(gridElement, i % gridSize, Math.floor(i / gridSize))
            );
            
        }

        this.cellsGropedByColumn = this.groupCellsByColumn();
        this.cellsGroupByReverseColumn = this.cellsGropedByColumn.map(column => [...column].reverse());
        this.cellsGropedByRow = this.groupCellsByRow();
        this.cellsGropedByReverseRow = this.cellsGropedByRow.map(row => [...row].reverse());
    }

    getRandomEmptyCell(){
        const emptyCells = this.cells.filter(cell => cell.isEmpty());
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }
    groupCellsByColumn(){
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.x] = groupedCells[cell.x] || [];
            groupedCells[cell.x][cell.y] = cell;
            return groupedCells;
        }, []);
    }

    groupCellsByRow(){
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.y] = groupedCells[cell.y] || [];
            groupedCells[cell.y][cell.x] = cell;
            return groupedCells;
        }, []);
    }
 }
