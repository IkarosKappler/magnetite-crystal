/**
 * Moved the presets/settings from main.js here.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2017-12-19
 **/

var presets = {
    default : {
	type   : 'bricks',
	base   : { size : { x : 36, y : 36, z : 36 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 0, y : 0, z : 0 }, color : 0x00ff00 },
	brickA : { size : { x : 32, y : 12, z : 48 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 0, y : 0, z : 55 }, color : 0xffff00 },
	brickB : { size : { x : 32, y : 12, z : 36 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 0, y : 0, z : -55 }, color : 0xff0000 },
	brickC : { size : { x : 42, y : 12, z : 36 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 120, y : 0, z : 0 }, color : 0x0088ff },
	brickD : { size : { x : 16, y : 38, z : 16 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 140, y : 0, z : 0 }, color : 0x0000ff },
	twin : { offset : { x : 6, y : -1, z : 5 }, rotation : { x : 0, y : 180, z : 180 }, scale : { x : 0.80, y : 0.80, z : 0.80 } }
    },
    twinA : {
	type   : 'octahedron',
	base   : { size : { x : 36, y : 36, z : 36 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 0, y : 0, z : 0 }, color : 0xffffff },
	brickA : { size : { x : 32, y : 12, z : 48 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 0, y : 0, z : 55 }, color : 0xffff00 },
	brickB : { size : { x : 32, y : 12, z : 36 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 0, y : 0, z : -55 }, color : 0xff0000 },
	brickC : { size : { x : 42, y : 8, z : 36 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 120, y : 0, z : 0 }, color : 0x0088ff },
	brickD : { size : { x : 16, y : 38, z : 14 }, translation : { x : 0, y : 0, z : 0 }, rotation : { x : 140, y : 0, z : 0 }, color : 0x0000ff },
	twin : null
    }
};
