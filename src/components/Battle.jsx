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

  //   //animation reference on atk
  //   const animRef = useRef({
  //     playerOffset: 0,
  //     enemyOffset: 0,
  //     targetShake: 0,
  //     sparks: [],
  //   });

  // example states
  const [playerHp, setPlayerHP] = useState(100);
  const [enemyHp, setEnemyHP] = useState(100);
  //these are the starting states for lifebars

  //load sprites on canvas
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const p = new Image(); //load PLAYER sprite
    const e = new Image(); //load ENEMY sprite
    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) setLoaded(true); //once both sprites are loaded, the counter sets the state to True
    };
    p.src = SPRITE_SRC_PLAYER;
    e.src = SPRITE_SRC_ENEMY;
    p.onload = checkLoaded;
    e.onload = checkLoaded;
    playerImgRef.current = p; //set PlayerImage to current loaded p image
    enemyImgRef.current = e; //set EnemyImage to current loaded e image
  }, []);

  // useEffect for dependencies
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    // .getContext() method returns a drawing context on the canvas, .current to access <canvas>
    ctx.fillStyle = "#202028"; // canvas background fill color
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H); //canvas measurements
    ctx.fillStyle = "#fff";
    ctx.fillText("Battle area", 10, 20);
  }, []);

  function drawSprite(ctx, img, x, y) {
    if (img && img.complete && img.naturalWidth !== 0) {
      ctx.drawImage(img, x, y, DRAW_SIZE, DRAW_SIZE);
    }
  }
  //preload hp bar math, position, background color, life color
  function drawHP(ctx, name, hp, maxHp, x, y) {
    const w = 140;
    const h = 12;
    ctx.fillStyle = "#000";
    ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    ctx.fillStyle = "#444";
    ctx.fillRect(x, y, w, h);
    const pct = Math.max(0, hp) / maxHp;
    ctx.fillStyle = pct > 0.5 ? "#4caf50" : pct > 0.2 ? "#ffb74d" : "#f44336";
    //logic for position of lifebar
    ctx.fillRect(x, y, Math.round(w * pct), h);
    ctx.fillStyle = "#fff";
    ctx.font = "13px sans-serif";
    //math logic for actual hp and maxHp difference
    ctx.fillText(`${name} ${Math.round(hp)}/${maxHp}`, x, y - 6);
  }

  useEffect(() => {
    if (!loaded) return; // if they're not ready it doesn't render
    const ctx = canvasRef.current.getContext("2d");

    // drawing sprites in canvas
    drawSprite(ctx, playerImgRef.current, LEFT_X, Y);
    drawSprite(ctx, enemyImgRef.current, RIGHT_X, Y);
    //drawing lifebars in canvas
    drawHP(ctx, "Player", playerHp, 100, 20, 20);
    drawHP(ctx, "Enemy", enemyHp, 100, CANVAS_W - 160, 20);
  }, [loaded]);
  //actually draws the sprites using references for context, source and position of sprites in canvas

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
