import * as ex from 'excalibur';

class Card extends ex.Actor {
    draw(ctx: ex.CanvasRenderingContext2D, delta: number): void {
	// draw pill
	ctx.beginPath();
	ctx.moveTo(50, 50);
	ctx.lineTo(50, 100);
	ctx.arc(100, 100, 50, Math.pi, true);
	ctx.closePath();
    }
}

let game = new ex.Engine({displayMode: ex.DisplayMode.FullScreen});
let main = new ex.Scene(game);

game.addScene('main', main);
game.goToScene('main');
game.start();
