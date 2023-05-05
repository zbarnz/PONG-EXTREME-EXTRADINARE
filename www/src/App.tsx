import React from "react";
import logo from "./logo.svg";
import "./App.css";
import styles from "./styles/Canvas.module.css";
import { useRef, useEffect } from "react";
import PongGPT from "./components/PongGPT";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

function App() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref.current) {
      const canvas = ref.current.getContext('2d')
      // do something here with the canvas
    }
  }, [])

  return (
    <div className="App">
      <header>Welcome to online pong Extreme</header>
      <div>
        <button>Create New Game</button>
        <button>Join Existing Game</button>
      </div>
      {/* <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={styles.canvas}
      ></canvas> */}
      <PongGPT />
    </div>
  );
}

export default App;
