import React, { useRef, useEffect, useState } from "react";

interface GameState {
  ball: { x: number; y: number; dx: number; dy: number; radius: number };
  paddle1: { x: number; y: number; width: number; height: number };
  paddle2: { x: number; y: number; width: number; height: number };
}

const PongGPT: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const gameStateRef = useRef<GameState>({
    ball: { x: 50, y: 50, dx: 2, dy: 2, radius: 5 },
    paddle1: { x: 10, y: 100, width: 10, height: 400 },
    paddle2: { x: 480, y: 100, width: 10, height: 400 },
  });
  const [movingPaddle, setMovingPaddle] = useState({
    x: 10,
    y: 100,
    width: 10,
    height: 400,
  });

  const [mousePos, setMousePos] = useState({});

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      setMousePos({ x: event.clientX, y: event.clientY });
      setMovingPaddle({ ...movingPaddle, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const draw = (ctx: CanvasRenderingContext2D, gameState: GameState) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "black";

    const { ball, paddle1, paddle2 } = gameState;

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    // Draw paddles
    ctx.fillRect(
      movingPaddle.x,
      movingPaddle.y,
      movingPaddle.width,
      movingPaddle.height
    );
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  };

  const update = (gameState: GameState) => {
    const { ball, paddle1, paddle2 } = gameState;

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Collision detection with walls
    if (ball.y + ball.radius >= 300 || ball.y - ball.radius <= 0) {
      ball.dy = -ball.dy;
    }

    // Collision detection with paddles
    if (
      (ball.x - ball.radius <= movingPaddle.x + movingPaddle.width &&
        ball.y >= movingPaddle.y &&
        ball.y <= movingPaddle.y + movingPaddle.height) ||
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
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        width="500"
        height="300"
        style={{ border: "1px solid black" }}
      />
      <p>
        {movingPaddle.x},{movingPaddle.y}
      </p>
    </>
  );
};

export default PongGPT;
