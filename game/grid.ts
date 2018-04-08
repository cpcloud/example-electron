import * as ex from 'excalibur';
import * as _ from 'lodash';
import { Config, gameScale } from './config';
import { Card, CardEvent, CardFactory } from './card';
import { Palette } from './palette';

export class Cell {
  constructor(
    public x: number,
    public y: number,
    public card: Card,
    public logicalGrid: LogicalGrid) { }

  //public getNeighbors(): Cell[] {
    //let result = [];
    //for (let i = -1; i < 2; i++) {
      //for (let j = -1; j < 2; j++) {
        //const new_x = this.x + i;
        //const new_y = this.y + j;
        //const cell = this.logicalGrid.getCell(this.x + i, this.y + j);

        //if (cell && cell !== this) {
          //result.push(cell);
        //}
      //}
    //}
    //return result;
  //}

  public getAbove(): Cell {
    return this.logicalGrid.getCell(this.x, this.y - 1);
  }

  public getBelow(): Cell {
    return this.logicalGrid.getCell(this.x, this.y + 1);
  }

  public getCenter(): ex.Vector {
    let cw = Config.CardWidth * gameScale.x;
    let ch = Config.CardHeight * gameScale.y;

    return new ex.Vector(
      this.x * cw + (cw / 2) + visualGrid.x,
      this.y * ch + (ch / 2) + visualGrid.y);
  }
}

export class LogicalGrid extends ex.Class {
  public cells: Cell[];

  constructor(public rows: number, public cols: number) {
    super();

    this.cells = new Array<Cell>(rows * cols);

    for (let i = 0, k = 0; i < cols; ++i) {
      for (let j = 0; j < rows; ++j, ++k) {
        this.cells[k] = new Cell(i, j, null, this);
      }
    }
  }

  public getRow(row: number): Cell[] {
    let result: Cell[] = [];
    for (let i = 0; i < this.cols; ++i) {
      result.push(this.getCell(i, row));
    }
    return result;
  }

  public getColumn(col: number): Cell[] {
    let result: Cell[] = [];
    for (let i = 0; i < this.cols; ++i) {
      result.push(this.getCell(col, i));
    }
    return result;
  }

  public getCell(x: number, y: number): Cell {
    const cols = this.cols;

    if (x < 0 || x >= cols) {
      return null;
    }

    if (y < 0 || y >= this.rows) {
      return null;
    }

    return this.cells[x + y * cols];
  }

  public setCell(x: number, y: number, data: Card): Cell {
    let cell = this.getCell(x, y);

    if (!cell) {
      return;
    };

    if (data) {
      let center = cell.getCenter();
      data.cell = cell;
      cell.card = data;
      this.eventDispatcher.emit("cardadd", new CardEvent(cell));
    } else {
      this.eventDispatcher.emit("cardremove", new CardEvent(cell));
      cell.card = null;
    }

    return cell;
  }

  public getCards(): Card[] {
    return this.cells.filter(cell => cell.card !== null).map(cell => cell.card);
  }

  public fill(
    game: ex.Engine, row: number, smooth: boolean = false, delay: number = 0
  ): void {
    var self = this;

    for (let i = 0; i < self.cols; ++i) {
      let cell = self.getCell(i, row);
      let card = CardFactory.getRandomCard(
        game,
        cell.getCenter().x,
        visualGrid.y + visualGrid.getHeight() + Config.CardHeight / 2
      );
      self.setCell(i, row, card);

      //if (smooth) {
        //const center = cell.getCenter()
        //card.delay(delay).easeTo(
          //center.x,
          //center.y,
          //Config.PieceEasingFillDuration,
          //ex.EasingFunctions.EaseInOutCubic
        //).asPromise().then(
          //() => {
            //card.x = cell.getCenter().x;
            //card.y = cell.getCenter().y;
          //}
        //);
      //}
    }
  }

  public seed(
    game: ex.Engine, rows: number, smooth: boolean = false, delay: number = 0
  ): void {
    for (let i = 0; i < rows; ++i) {
      grid.fill(game, grid.rows - i - 1, smooth, delay);
    }
  }

  //public areNeighbors(cell1: Cell, cell2: Cell): boolean {
    //return cell1.getNeighbors().indexOf(cell2) > -1;
  //}
}


export class VisualGrid extends ex.Actor {
  constructor(public logicalGrid: LogicalGrid) {
    super(
      0,
      Config.GridY,
      Config.CardWidth * logicalGrid.cols,
      Config.CardHeight * logicalGrid.rows
    );
    this.anchor.setTo(0, 0);
    this.scale.setTo(gameScale.x, gameScale.y);
  }

  public update(engine: ex.Engine, delta: number) {
    super.update(engine, delta);
    this.scale.setTo(gameScale.x, gameScale.y);
  }

  public draw(ctx: CanvasRenderingContext2D, delta: number) {
    super.draw(ctx, delta);

    ctx.fillStyle = Palette.GridBackgroundColor.toString();
    ctx.fillRect(this.x, this.y, this.getWidth(), this.getHeight());
  }

  public getCellByPos(screenX: number, screenY: number): Cell {
    return _.find(this.logicalGrid.cells, (cell) => {
      return cell.card && cell.card.contains(screenX, screenY);
    });
  }
}

export let grid = new LogicalGrid(Config.GridCellsHigh, Config.GridCellsWide);
export let visualGrid = new VisualGrid(grid);
