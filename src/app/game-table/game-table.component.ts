import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.scss']
})
export class GameTableComponent implements OnInit {
  @ViewChildren('cellRef') cells: QueryList<any>;

  options: SelectItem[] = [
    {label: 'PVP', value: EGameMode.PVP},
    {label: 'PVE', value: EGameMode.PVE}
  ];
  gameMode = EGameMode.PVP;
  isXStart: boolean;
  currentSign: string;
  isGameActive = false;
  matrix: any[];
  winner: string;
  gameDesk = [
    {position: [0, 0]},
    {position: [0, 1]},
    {position: [0, 2]},
    {position: [1, 0]},
    {position: [1, 1]},
    {position: [1, 2]},
    {position: [2, 0]},
    {position: [2, 1]},
    {position: [2, 2]},
  ];

  constructor() {
  }

  ngOnInit(): void {

  }

  startGame(): void {
    this.isGameActive = true;
    this.refreshGame();
    this.isXStart = !!+Math.round(Math.random());
    this.currentSign = this.isXStart ? 'X' : 'O';
  }

  onCellClick(cell: any, position): void {
    // check if cell filled
    if (this.matrix[position[0]][position[1]]) {
      return;
    }

    this.matrix[position[0]][position[1]] = this.currentSign;
    cell.innerHTML = this.currentSign;

    const isWin = this.checkWinStatus();
    if (isWin) {
      this.showWinner();
      return;
    }
    else if (this.isBoardFull()) {
      this.showWinner('No one!');
    }


    if (this.gameMode === EGameMode.PVE) {
      this.switchTurn();
      this.computerTurn();
      const isCompWin = this.checkWinStatus();
      if (isCompWin) {
        this.showWinner();
        return;
      }
    }


    this.switchTurn();
  }

  isBoardFull(): boolean {
    return  this.matrix.every(line => line.every(cell => cell));
  }

  showWinner(winner?: string): void {
    this.winner = winner || this.currentSign;
    this.isGameActive = false;
  }

  computerTurn(): void {
    const freeCells = this.getFreeCells();
    const randomTurn = Math.floor(Math.random() * freeCells.length);
    const coordinates = freeCells[randomTurn];
    this.cells.forEach(cell => {
      if (coordinates.join(',') === cell.nativeElement.coord) {
        cell.nativeElement.innerHTML = this.currentSign;
        this.matrix[coordinates[0]][coordinates[1]] = this.currentSign;
      }
    });
  }

  switchTurn(): void {
    this.currentSign = this.currentSign === 'X' ? 'O' : 'X';
  }

  getFreeCells(): any[] {
    const freeCells = [];
    this.matrix.forEach((line, lInd) => {
      line.forEach((cell, cInd) => {
        if (cell === '') {
          freeCells.push([lInd, cInd]);
        }
      });
    });
    return freeCells;
  }

  checkWinStatus(): boolean {
    let isWin = false;

    for (let i = 0; i < this.matrix.length; i++) {
      // row check
      if (this.matrix[i].every(el => el === 'X') || this.matrix[i].every(el => el === 'O')) {
        isWin = true;
        break;
      }

      // column check
      if (['X', 'O'].includes(this.matrix[0][i]) && this.matrix[0][i] === this.matrix[1][i] && this.matrix[0][i] === this.matrix[2][i]) {
        isWin = true;
        break;
      }
    }

    // slant line check
    if (['X', 'O'].includes(this.matrix[0][0]) && this.matrix[0][0] === this.matrix[1][1] && this.matrix[0][0] === this.matrix[2][2] ||
      (['X', 'O'].includes(this.matrix[0][2]) && this.matrix[0][2] === this.matrix[1][1] && this.matrix[0][2] === this.matrix[2][0])) {
      isWin = true;
    }

    return isWin;
  }

  refreshGame(): void {
    this.matrix = [
      new Array(3).fill(''),
      new Array(3).fill(''),
      new Array(3).fill(''),
    ];
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.innerHTML = null;
    });
    this.winner = '';
  }

}

enum EGameMode {
  PVP,
  PVE
}
