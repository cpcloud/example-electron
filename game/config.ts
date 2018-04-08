import * as ex from 'excalibur';

export class Config {
  static ShapeWidth: number = 50;
  static ShapeHeight: number = 100;
  static ShapeSpace: number = 100;
  static CardPadding: number = 25;
  static MaxShapes: number = 3;
  static CardWidth: number = Config.ShapeWidth * Config.MaxShapes + Config.CardPadding * 2;
  static CardHeight: number = Config.ShapeHeight + Config.CardPadding;
  static GridY: number = -10;
  static GridCellsHigh: number = 4;
  static GridCellsWide: number = 3;
  static PieceEasingFillDuration: number = 300;
}

export let gameScale = new ex.Vector(1, 1);
