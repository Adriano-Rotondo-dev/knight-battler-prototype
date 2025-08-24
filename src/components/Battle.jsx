import { useEffect, useRef, useState } from "react";

// set canvas w and h
const CANVAS_W = 640;
const CANVAS_H = 320;

//set sprites constant src
const SPRITE_SRC_BG = "/sprites/castle_background.png"; // background del canvas
const SPRITE_SRC_PLAYER = "/sprites/blue.png";
const SPRITE_SRC_ENEMY = "/sprites/green.png";
const SPRITE_SRC_PLAYER_STRIKE = "/sprites/blue_strike.png";
const SPRITE_SRC_PLAYER_LIGHTSTRIKE = "/sprites/blue_lightstrike.png"; // sprite per attacco speciale
const SPRITE_SRC_PLAYER_BLOCK = "/sprites/blue_shield.png"; //sprite di blocco del player

//set sprite sizes and scaling
const SPRITE_SIZE = 64; //original sprite size in pixel
const SCALE = 2.5; //scale modificato per adattare meglio sprite e background
const DRAW_SIZE = SPRITE_SIZE * SCALE; //calc effective size of sprite on rendering
//set sprite positions
const LEFT_X = 80; //player 1 position (left)
const RIGHT_X = CANVAS_W - 80 - DRAW_SIZE; //enemy placement (right)
const Y = CANVAS_H - DRAW_SIZE; //vertical placement of sprites on rendering. Refactor to put sprites parallel with ground line on background

export default function Battle() {
  // get <canvas> DOM with useRef
  const canvasRef = useRef(null);

  //load sprites to render them with drawImage
  const bgImgRef = useRef(null);
  const playerImgRef = useRef(null);
  const enemyImgRef = useRef(null);
  const playerStrikeImgRef = useRef(null);
  const playerLightStrikeImgRef = useRef(null);
  const playerBlockImgRef = useRef(null);

  // example states
  const [playerHp, setPlayerHP] = useState(100);
  const [enemyHp, setEnemyHP] = useState(100);
  //these are the starting states for lifebars

  //turn order states
  const [turn, setTurn] = useState("player"); // player o enemy
  const [shieldActive, setShieldActive] = useState(false); // stato di parata
  const [playerSkipTurn, setPlayerSkipTurn] = useState(false); // salta un turno dopo special
  const [gameOver, setGameOver] = useState(false); // stato di vittoria o sconfitta

  //load sprites on canvas
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const bg = new Image(); //load background to canvas
    const p = new Image(); //load PLAYER sprite
    const ps = new Image(); //load PLAYER Strike sprite
    const pls = new Image(); //load PLAYER LightStrike sprite
    const pb = new Image(); //load PLAYER block sprite
    const e = new Image(); //load ENEMY sprite
    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 6) setLoaded(true); //una volta caricati tutti gli sprite imposta lo stato
    };
    bg.src = SPRITE_SRC_BG;
    p.src = SPRITE_SRC_PLAYER;
    ps.src = SPRITE_SRC_PLAYER_STRIKE;
    pls.src = SPRITE_SRC_PLAYER_LIGHTSTRIKE;
    pb.src = SPRITE_SRC_PLAYER_BLOCK;
    e.src = SPRITE_SRC_ENEMY;
    bg.onload = checkLoaded;
    p.onload = checkLoaded;
    ps.onload = checkLoaded;
    pls.onload = checkLoaded;
    pb.onload = checkLoaded;
    e.onload = checkLoaded;
    bgImgRef.current = bg;
    playerImgRef.current = p; //set PlayerImage to current loaded p image
    playerStrikeImgRef.current = ps; // set Player Strike Image to currently loaded images
    playerLightStrikeImgRef.current = pls; //set Player LightStrike Image to currently loaded pls image
    playerBlockImgRef.current = pb; // set Player Block Image to currently loaded pb image
    enemyImgRef.current = e; //set EnemyImage to current loaded e image
  }, []);

  // useEffect for dependencies
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    // .getContext() method returns a drawing context on the canvas, .current to access <canvas>
    ctx.fillStyle = "#202028"; // canvas background fill color
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H); //canvas measurements
    ctx.fillStyle = "#fff"; //canvas text color
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
    ctx.font = "16px PressStart2P";
    //math logic for actual hp and maxHp difference
    ctx.fillText(`${name} ${Math.round(hp)}/${maxHp}`, x, y - 6);
  }
  // animazione
  const animRef = useRef({
    playerX: LEFT_X, // posizione corrente player (si muove in avanti)
    sprite: SPRITE_SRC_PLAYER, // sprite attuale del player
    isAttacking: false, // animazione attacco attiva
    isBlocking: false, // animazione blocco attiva
    enemyX: RIGHT_X, // posizione corrente nemico
    enemyIsAttacking: false, // animazione nemico
  });

  function redraw(ctx) {
    if (bgImgRef.current && bgImgRef.current.complete) {
      ctx.drawImage(bgImgRef.current, 0, 0, CANVAS_W, CANVAS_H);
    } else {
      ctx.fillStyle = "#202028"; // fallback in caso di errore di caricamento dell'immagine del canvas
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H); // sostituito il background statico grigio con immagine di background precaricata
    }

    // player
    const playerImg = animRef.current.isBlocking
      ? playerBlockImgRef.current // sprite scudo
      : animRef.current.sprite === SPRITE_SRC_PLAYER
      ? playerImgRef.current
      : animRef.current.sprite === SPRITE_SRC_PLAYER_STRIKE
      ? playerStrikeImgRef.current
      : playerLightStrikeImgRef.current;
    drawSprite(ctx, playerImg, animRef.current.playerX, Y);

    // enemy
    drawSprite(ctx, enemyImgRef.current, animRef.current.enemyX, Y);

    // lifebars
    drawHP(ctx, "Player", playerHp, 100, 20, 20);
    drawHP(ctx, "Enemy", enemyHp, 100, CANVAS_W - 160, 20);

    // scritta di vittoria o sconfitta, rimane fissa
    if (gameOver) {
      ctx.fillStyle = "#fff";
      ctx.font = "32px PressStart2P";
      ctx.textAlign = "center";
      ctx.fillText(
        playerHp <= 0 ? "DEFEAT!" : "VICTORY!",
        CANVAS_W / 2,
        CANVAS_H / 2
      );
      ctx.textAlign = "left"; // reset
    }
  }

  // block {bugged - should avoid damage calculation}
  function handleShield() {
    if (turn !== "player" || gameOver) return;
    setShieldActive(true);

    // start block animation
    animRef.current.isBlocking = true;
    const ctx = canvasRef.current.getContext("2d");
    redraw(ctx);

    // blue_shied.png animation timer to maintain
    setTimeout(() => {
      animRef.current.isBlocking = false;
      animRef.current.sprite = SPRITE_SRC_PLAYER;
      redraw(ctx);
      endPlayerTurn();
    }, 500); //mantiene il blocco per 0.5 sec
  }
  //animation bugged, acts like a "protect", runs animation then after makes enemy knight move

  //fine turno player, passa al nemico
  function endPlayerTurn(skip = false) {
    if (enemyHp <= 0) {
      setGameOver(true);
      return;
    }
    setTurn("enemy");
    if (skip) {
      setPlayerSkipTurn(true); // se ha fatto attacco speciale, salta turno dopo
    }
    setTimeout(enemyTurn, 500); // attesa breve e poi attacco nemico
  }

  // calcolo pf in tempo reale, restituisce il nuovo valore senza dipendere da React
  function calcHp(currentHp, dmg) {
    return Math.max(0, currentHp - dmg);
  }

  //attacco player
  function handleAttack(double = false) {
    if (turn !== "player" || animRef.current.isAttacking || gameOver) return;

    animRef.current.isAttacking = true;
    animRef.current.sprite = double
      ? SPRITE_SRC_PLAYER_LIGHTSTRIKE
      : SPRITE_SRC_PLAYER_STRIKE;

    const ctx = canvasRef.current.getContext("2d");
    const startX = LEFT_X;
    const endX = RIGHT_X - 200; // si ferma vicino al nemico
    const duration = 400; // ms
    const startTime = performance.now(); // actually starts animation

    function animate(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1); // 0 → 1  durata dell'animazione
      animRef.current.playerX = startX + (endX - startX) * t; //animation position

      redraw(ctx);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        // infligge danno
        const dmg = double
          ? Math.floor(20 + Math.random() * 21) // 20–40 se speciale
          : Math.floor(10 + Math.random() * 11); // 10–20 normale
        const newEnemyHp = calcHp(enemyHp, dmg); // calcolo tempo reale pf
        // aggiorna stato
        setEnemyHP(newEnemyHp);

        // ritorno alla posizione base
        setTimeout(() => {
          animRef.current.playerX = startX;
          animRef.current.sprite = SPRITE_SRC_PLAYER;
          animRef.current.isAttacking = false;
          redraw(ctx);
          endPlayerTurn(double); // se speciale → salta turno
        }, 200);
      }
    }

    requestAnimationFrame(animate);
  }

  //logica turno nemico (con animazione)
  function enemyTurn() {
    if (enemyHp <= 0 || gameOver) return; // se è morto non attacca

    let actions = 1;
    if (playerSkipTurn) {
      actions = 2; // se player ha fatto special, nemico gioca due volte
      setPlayerSkipTurn(false);
    }

    function act(n) {
      if (n > actions) {
        if (playerHp <= 0) {
          setGameOver(true);
          return;
        }
        setTurn("player"); // ritorno al player
        return;
      }

      // animazione di avanzamento
      animRef.current.enemyIsAttacking = true;
      const ctx = canvasRef.current.getContext("2d");
      const startX = RIGHT_X;
      const endX = LEFT_X + 100; // si ferma vicino al player
      const duration = 400;
      const startTime = performance.now();

      function animateEnemy(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        animRef.current.enemyX = startX - (startX - endX) * t;

        redraw(ctx);
        //enemy attack logic
        if (t < 1) {
          requestAnimationFrame(animateEnemy);
        } else {
          // infligge danno
          const dmg = Math.floor(5 + Math.random() * 11); // danno nemico 5-15
          if (shieldActive) {
            setShieldActive(false); // parata usata, annulla danno {currently bugged}
          } else {
            const newPlayerHp = calcHp(playerHp, dmg);
            setPlayerHP(newPlayerHp); //calcolo tempo reale dei pf
          }

          // ritorno alla posizione iniziale
          setTimeout(() => {
            animRef.current.enemyX = startX;
            animRef.current.enemyIsAttacking = false;
            redraw(ctx);
            if (playerHp <= 0) {
              setGameOver(true);
              return;
            }
            setTimeout(() => act(n + 1), 500); // turno successivo se doppia azione
          }, 200);
        }
      }

      requestAnimationFrame(animateEnemy);
    }

    act(1);
  }

  useEffect(() => {
    if (!loaded) return; // if they're not ready it doesn't render
    const ctx = canvasRef.current.getContext("2d");

    redraw(ctx);
  }, [loaded, playerHp, enemyHp, gameOver]);
  //actually draws the sprites using references for context, source and position of sprites in canvas

  return (
    // add flex container
    <div className="d-flex g-12 align-items-center flex-direction-column">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ border: "1px solid #333" }}
      />

      <div className="ui_controls">
        <button
          onClick={() => handleAttack(false)}
          type="button"
          className="nes-btn"
          disabled={turn !== "player" || gameOver}
        >
          <span className="nes-text">Attack</span>
        </button>
        <button
          onClick={() => handleAttack(true)}
          type="button"
          className="nes-btn is-warning"
          disabled={turn !== "player" || gameOver}
        >
          <span className="nes-text">Lighting Attack</span>
        </button>
        <button
          onClick={handleShield}
          type="button"
          className="nes-btn is-success"
          disabled={turn !== "player" || gameOver}
        >
          <span className="nes-text">Shield</span>
        </button>
        <div>Turno: {turn}</div> {/* debug turno - mostra il turno attuale */}
        <div className="player">Player HP:{playerHp}</div>
        {/* player info tracking */}
        <div className="enemy">Enemy HP:{enemyHp}</div>
        {/* enemy info tracking */}
      </div>
      {/* bottone di restart/reload */}
      <button
        onClick={() => window.location.reload()}
        type="button"
        className="nes-btn is-error"
      >
        <span className="nes-text">Restart</span>
      </button>
    </div>
  );
}
