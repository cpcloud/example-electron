import * as ex from 'excalibur';
import { Chance } from 'chance';
import { Config } from './config';

import * as _ from 'lodash';

let chance = new Chance();

export enum Fill {
  Empty,
  Solid,
  Lined
}

export class Shape extends ex.Actor {
  private _fill: Fill;
  constructor(x, y, width, height, color: ex.Color, fill: Fill) {
    super(x, y, width, height, color);
    this._fill = fill;
  }

  drawShape(ctx: CanvasRenderingContext2D, delta: number): void { }

  draw(ctx: CanvasRenderingContext2D, delta: number): void {
    ctx.strokeStyle = this.color.toString();
    ctx.lineWidth = 10.0;
    this.drawShape(ctx, delta);
    ctx.stroke();
    this.fill(ctx, delta);
  }

  fill(ctx: CanvasRenderingContext2D, delta: number): void {
    const width = this.getWidth();

    switch (this._fill) {
      case Fill.Solid: {
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
        break;
      }
      case Fill.Lined: {
        let pattern = document.createElement('canvas');
        pattern.height = 10;
        pattern.width = width;
        let pcontext = pattern.getContext('2d');
        pcontext.fillStyle = this.color.toString();
        pcontext.fillRect(0, 0, width, 5);
        pcontext.fillStyle = ex.Color.White.toString();
        pcontext.fillRect(0, 5, width, 5);
        ctx.fillStyle = ctx.createPattern(pattern, 'repeat');
        ctx.fill();
        break;
      }
      default:
        break;
    }
  }
}

export class Diamond extends Shape {
  drawShape(ctx: CanvasRenderingContext2D, delta: number): void {
    const width = this.getWidth();
    const height = this.getHeight();
    const x = this.x;
    const y = this.y;

    ctx.beginPath();
    ctx.lineTo(x + width / 2, y);
    ctx.lineTo(x, y + height / 2);
    ctx.lineTo(x + width / 2, y + height);
    ctx.lineTo(x + width, y + height / 2);
    ctx.closePath();
  }
}

export class Bean extends Shape { }

export class Pill extends Shape {
  get radius(): number {
    return Math.floor(this.getWidth() / 2);
  }

  drawShape(ctx: CanvasRenderingContext2D, delta: number): void {
    const width = this.getWidth();
    const height = this.getHeight();
    const x = this.x;
    const y = this.y;
    const radius = this.radius;

    // draw pill
    ctx.beginPath();
    ctx.arc(x + radius, y, radius, 0, Math.PI, false);
    ctx.moveTo(x + width, y);
    ctx.lineTo(x + width, y - height);
    ctx.arc(x + radius, y - height, radius, 0, Math.PI, true);
    ctx.lineTo(x, y);
  }
}

const VALID_SHAPES = [Diamond, Pill];
const VALID_FILLS = [Fill.Lined, Fill.Empty, Fill.Solid];
const VALID_COLORS = [ex.Color.Violet, ex.Color.Green, ex.Color.Red];

function generateCardConfigurations() {
  let validCardConfigurations = [];

  for (let Type of VALID_SHAPES) {
    for (let fill of VALID_FILLS) {
      for (let color of VALID_COLORS) {
        for (let n = 1; n <= Config.MaxShapes; ++n) {
          const shapeFuncs = _.times(
            n,
            index => (
              x: number,
              y: number,
              width: number,
              height: number,
              the_color: ex.Color = color,
              the_fill: Fill = fill
            ) => new Type(x, y, width, height, the_color, the_fill)
          );
          validCardConfigurations.push(shapeFuncs);
        }
      }
    }
  }
  return validCardConfigurations;
}

export const VALID_CARD_CONFIGURATIONS = generateCardConfigurations();
