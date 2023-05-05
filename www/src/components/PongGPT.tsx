import React, { useRef, useEffect, useState } from "react";



interface GameState {
  ball: { x: number; y: number; dx: number; dy: number; radius: number };
  // paddle2: { x: number; y: number; width: number; height: number };
}

const PongGPT: React.FC = () => {
  let CANVAS_WIDTH = 500
var CANVAS_HEIGHT = 300

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const gameStateRef = useRef<GameState>({
    ball: { x: 50, y: 50, dx: 2, dy: 2, radius: 5 },
    // paddle2: { x: 480, y: 100, width: 10, height: 50 },
  });
  const [paddle1, setPaddle1] = useState({
    x: 10,
    y: 100,
    width: 10,
    height: 50,
  });
  const [paddle2, setPaddle2] = useState({
    x: 480,
    y: 100,
    width: 10,
    height: 50,
  });

  const [mousePos, setMousePos] = useState({});

  const draw = (ctx: CanvasRenderingContext2D, gameState: GameState) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "black";

    const { ball } = gameState;

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    setPaddle2({ ...paddle2, y: ball.y - 40 * Math.random() });

    setPaddle1({ ...paddle1, y: ball.y - 10 });

    // Draw paddles
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  };

  const update = (gameState: GameState) => {
    const { ball } = gameState;
    console.log(paddle1);

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Collision detection with walls
    if (ball.y + ball.radius >= 300 || ball.y - ball.radius <= 0) {
      ball.dy = -ball.dy;
    }

    // Collision detection with paddles
    if (
      (ball.x - ball.radius <= paddle1.x + paddle1.width &&
        ball.y >= paddle1.y &&
        ball.y <= paddle1.y + paddle1.height) ||
      (ball.x + ball.radius >= paddle2.x &&
        ball.y >= paddle2.y &&
        ball.y <= paddle2.y + paddle2.height)
    ) {
      ball.dx = -ball.dx;
    }

    // Reset ball position if it goes off screen
    if (ball.x + ball.radius < 0 || ball.x - ball.radius > 500) {
      ball.x = 250;
      ball.y = 150;
      ball.dx = 2;
      ball.dy = 2;
    }
  };

  const loop = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const gameState = gameStateRef.current;

        update(gameState);
        draw(ctx, gameState);

        requestRef.current = requestAnimationFrame(loop);
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      if (canvasRef.current !== null) {
        const rect = canvasRef.current.getBoundingClientRect();
        setMousePos({ x: event.clientX, y: event.clientY - rect.top });
        setPaddle1({
          ...paddle1,
          y: event.clientY - rect.top - paddle1.height / 2,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) {
        window.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [paddle1, paddle2]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: "1px solid black" }}
      />
      <p>
        {paddle1.x},{paddle1.y}
      </p>
    </>
  );
};

export default PongGPT;
