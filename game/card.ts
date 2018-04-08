import * as ex from 'excalibur';
import { Shape, VALID_CARD_CONFIGURATIONS } from './shape';
import { Cell } from './grid';
import { Config, gameScale } from './config';
import { Chance } from 'chance';

let chance = new Chance();

export class CardEvent extends ex.GameEvent<Cell> {
   constructor(public cell: Cell) {
      super();
   }
}

export class Card extends ex.Actor {
  public calculatedAnchor: ex.Vector;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: ex.Color,
    public shapes: Shape[],
    public cell: Cell = null)
  {
    super(x, y, width, height, color);

    this.scale.setTo(gameScale.x, gameScale.y);
    this.calculatedAnchor = new ex.Vector(
      Config.CardWidth / 2 * this.scale.x,
      Config.CardHeight / 2 * this.scale.y
    );
  }

  draw(ctx: CanvasRenderingContext2D, delta: number): void {
    ctx.fillStyle = this.color.toString();
    ctx.fillRect(this.x, this.y, this.getWidth(), this.getHeight());
    for (let shape of this.shapes) {
      shape.draw(ctx, delta);
    }
  }
}

export class CardFactory {
  static getRandomCard(game: ex.Engine, x: number, y: number): Card {
    let shapes: Shape[] = [];
    let shapeX = Config.CardPadding;

    let shapeFuncs = chance.pickone(VALID_CARD_CONFIGURATIONS);
    for (let shapeFunc of shapeFuncs) {
      let shape = shapeFunc(
        shapeX,
        Config.CardPadding,
        Config.ShapeWidth,
        Config.ShapeHeight
      );
      game.currentScene.add(shape);
      shapes.push(shape);
      shapeX += Config.ShapeWidth + Config.ShapeSpace;
    }

    let card = new Card(
      x, y, Config.CardWidth, Config.CardHeight, ex.Color.White, shapes);
    game.currentScene.add(card);
    return card;
  }
}
