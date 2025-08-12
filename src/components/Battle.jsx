import { useEffect, useRef, useState } from "react";

// set canvas w and h
const CANVAS_W = 640;
const CANVAS_H = 320;

//set sprites constant src
const SPRITE_SRC_PLAYER = "/sprites/blue.png";
const SPRITE_SRC_ENEMY = "/sprites/green.png";
//set sprite sizes and scaling
const SPRITE_SIZE = 64; //original sprite size in pixel
const SCALE = 3; //scale by 3 the original 64x64 sprite
const DRAW_SIZE = SPRITE_SIZE * SCALE; //calc effective size of sprite on rendering (192x192)
//set sprite positions
const LEFT_X = 80; //player 1 position (left)
const RIGHT_X = CANVAS_W - 80 - DRAW_SIZE; //enemy placement (right)
const Y = (CANVAS_H - DRAW_SIZE) / 2; //vertical placement of sprites on rendering. calculate by dividing space by 2, centering sprites

export default function Battle() {
  // get <canvas> DOM with useRef
  const canvasRef = useRef(null);

  //load sprites to render them with drawImage
  const playerImgRef = useRef(null);
  const enemyImgRef = useRef(null);

  //animation reference on atk
  const animRef = useRef({
    playerOffset: 0,
    enemyOffset: 0,
    targetShake: 0,
    sparks: [],
  });

  // example states
  const [playerHp, setPlayerHP] = useState(100);
  const [enemyHp, setEnemyHP] = useState(100);
  //these are the starting states for lifebars

  // useEffect for dependencies
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    // .getContext() method returns a drawing context on the canvas, .current to access <canvas>
    ctx.fillStyle = "#202028"; // canvas background fill color
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H); //canvas measurements
    ctx.fillStyle = "#fff";
    ctx.fillText("Battle area", 10, 20);
  }, []);

  return (
    // add flex container
    <div className="d-flex g-12">
      {/* set canvas ref. measurements and basic border style  */}
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ border: "1px solid #333" }}
      />
      {/* set base ui for testing */}
      <div className="ui_controls">
        <button>Attack</button>
        <div className="player">Player HP:{playerHp}</div>
        <div className="enemy">Enemy HP:{enemyHp}</div>
      </div>
    </div>
  );
}
