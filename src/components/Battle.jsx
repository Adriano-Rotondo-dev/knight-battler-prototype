import React, { use, useEffect, useRef, useState } from "react";

// set canvas w and h
const CANVAS_W = 640;
const CANVAS_H = 320;

export default function Battle() {
  // get <canvas> DOM with useRef
  const canvasRef = useRef(null);

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
