import * as ex from 'excalibur';
import { Config, gameScale } from './config';
import { Shape, Fill, Pill, Diamond } from './shape';
import { Card } from './card';
import { visualGrid, grid } from './grid';

let game = new ex.Engine({ displayMode: ex.DisplayMode.FullScreen });
let main = new ex.Scene(game);

game.add('main', main);
game.goToScene('main');

grid.seed(game, 4);
game.add(visualGrid);

game.start();
