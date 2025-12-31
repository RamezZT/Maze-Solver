import { useEffect, useReducer, useRef, useState } from "react";
import Cell from "./Cell";
import { generatePathsAnimations, solveMaze } from "../lib/Maze/solveMaze";
import { CellType, PathInfo } from "../types";
import toast from "react-hot-toast";
import { initialState, mazeReducer } from "../lib/Maze/MazeReducer";
import useMotionTimeline, { Animation } from "../hooks/useMotionTimeline";
import { motion, useAnimationControls } from "framer-motion";

const MazeGrid = () => {
  const [state, dispatch] = useReducer(mazeReducer, initialState);
  const [paths, setPaths] = useState<PathInfo[]>([]);
  // const [duration, setDuration] = useState(0.2);
  const [validPaths, setValidPaths] = useState<CellType[][]>([]);
  const [pathsToAnimate, setPathsToAnimate] = useState<Animation[]>([]);
  const { scope, stop } = useMotionTimeline(pathsToAnimate, 1);
  const mazeRef = useRef<HTMLDivElement>(null);
  // const debounceRef = useRef<NodeJS.Timeout | null>(null);
  // const handleDurationChange = (value: number) => {
  //   if (debounceRef.current) {
  //     clearTimeout(debounceRef.current); // Clear the existing timeout
  //   }
  //   debounceRef.current = setTimeout(() => {
  //     setDuration(value); // Update the state after the delay
  //   }, 300); // 300ms debounce delay
  // };

  const handleSetSource = (event: globalThis.MouseEvent) => {
    const target = event.target as HTMLElement;
    const cellElement: HTMLElement | null = target.closest(".cell");
    if (cellElement?.dataset.val) {
      if (+cellElement.dataset.val === state.maze.sink.val) toast.error(`Sink and Source can't be the same`);
      else if (+cellElement.dataset.val === state.maze.source.val)
        toast.error(`Source is already set to ${state.maze.source.val}`);
      else {
        toast.success(`Source is now cell: ${cellElement.dataset.val}`);
        dispatch({ type: "SET_SOURCE", payload: +cellElement.dataset.val });
      }
    } else {
      toast.error("Please select a cell from the maze");
    }
    if (mazeRef.current) mazeRef.current.removeEventListener("click", handleSetSource);
  };

  const handleSetSink = (event: globalThis.MouseEvent) => {
    const target = event.target as HTMLElement;
    const cellElement: HTMLElement | null = target.closest(".cell");
    const currSource = state.maze.source;
    if (cellElement?.dataset?.val) {
      if (+cellElement.dataset.val === currSource.val) toast.error(`Sink and Source can't be the same`);
      else {
        toast.success(`Sink is now cell: ${cellElement.dataset.val}`);
        dispatch({ type: "SET_SINK", payload: +cellElement.dataset.val });
      }
    } else {
      toast.error("Please select a cell from the maze");
    }
    if (mazeRef.current) mazeRef.current.removeEventListener("click", handleSetSink);
  };
  const handleSetWall = (event: globalThis.MouseEvent) => {
    const target = event.target as HTMLElement;
    const cellElement: HTMLElement | null = target.closest(".cell");
    const currSource = state.maze.source;
    const currSink = state.maze.sink;

    if (cellElement?.dataset?.val) {
      if (+cellElement.dataset.val === currSource.val) toast.error(`Source can't be a wall`);
      else if (+cellElement.dataset.val === currSink.val) toast.error(`Sink can't be a wall`);
      else {
        toast.success(`cell: ${cellElement.dataset.val} is a wall now 🧱`);
        dispatch({ type: "SET_WALL", payload: +cellElement.dataset.val });
      }
    } else {
      toast.error("Please select a cell from the maze");
    }
    if (mazeRef.current) mazeRef.current.removeEventListener("click", handleSetWall);
  };
  const handleStart = () => {
    let sourceCell: CellType | null = null;
    let sinkCell: CellType | null = null;

    // check if the grid have a srouce and sink
    for (let i = 0; i < state.maze.cells.length; i++) {
      for (let j = 0; j < state.maze.cells[i].length; j++) {
        if (state.maze.cells[i][j].source) {
          sourceCell = state.maze.cells[i][j];
          break;
        }
        if (state.maze.cells[i][j].sink) {
          sinkCell = state.maze.cells[i][j];
          break;
        }
      }
    }

    if (!sourceCell) return alert("Couldn't find source cell");
    if (!sinkCell) return alert("Couldn't find sink cell");
    const paths = solveMaze(sourceCell, sinkCell, state.maze.cells);
    const greenPaths = paths.filter((path) => path.validPath).map((path) => path.path);
    setPaths(paths);
    setValidPaths(greenPaths);
  };

  const handleAddWall = () => {
    if (!mazeRef.current) return;
    mazeRef.current.addEventListener("click", handleSetWall);
  };
  const handleChangeSource = () => {
    if (!mazeRef.current) return;
    mazeRef.current.addEventListener("click", handleSetSource);
  };
  const handleChangeSink = () => {
    if (!mazeRef.current) return;
    mazeRef.current.addEventListener("click", handleSetSink);
  };

  useEffect(() => {
    const animation = generatePathsAnimations(paths);
    setPathsToAnimate(animation?.flatMap((anim) => anim) ?? []);
  }, [paths, validPaths]);

  // function generatePathsAnimations() {
  //   if (paths.length) {
  //     console.log(validPaths);
  //     const pathsAnimations = [] as Animation[];
  //     const resetAnimations = [] as Animation[];
  //     for (const path of validPaths) {
  //       const id = `.cell-${path.val}`;
  //       // let id = "";
  //       resetAnimations.push([
  //         id,
  //         { backgroundColor: "#fb923c", scale: 1 },
  //         { ...TRANSITION, duration },
  //       ]);
  //       pathsAnimations.push([
  //         id,
  //         {
  //           backgroundColor: "green",
  //           scale: 1.1,
  //         },
  //         { ...TRANSITION, duration },
  //       ]);
  //     }
  //     // now reset the animations so it can start again
  //     pathsAnimations.push(resetAnimations);
  //     setPathsToAnimate(pathsAnimations);
  //   }
  //   // const correctPath=validPath.
  // }

  const controls = useAnimationControls();
  return (
    <motion.div animate={controls} ref={scope} className="w-full flex flex-col justify-center items-center gap-12">
      {/* Inputs */}
      <div className="flex gap-2">
        <input
          className="rounded-md p-2"
          type="number"
          placeholder="Rows"
          value={state.rows}
          onChange={(e) => {
            if (+e.target.value <= 0 || +e.target.value > 5) {
              return alert("Value should be between 0 and 5");
            }
            dispatch({ type: "SET_ROWS", payload: +e.target.value });
          }}
        />
        <input
          className="rounded-md p-2"
          type="number"
          placeholder="Cols"
          value={state.cols}
          onChange={(e) => {
            if (+e.target.value <= 0 || +e.target.value > 5) {
              return alert("Value should be between 0 and 5");
            }
            dispatch({ type: "SET_COLS", payload: +e.target.value });
          }}
        />
      </div>
      {/* Maze Grid */}
      <div
        ref={mazeRef}
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${state.cols}, 1fr)`,
          gridTemplateRows: `repeat(${state.rows}, 1fr)`,
        }}
      >
        {state.maze.cells.flatMap((mazeRow) =>
          mazeRow.map((cell) => {
            const { col, key, row, sink, source, val, wall } = cell;
            return (
              <Cell
                // ref={source ? sourceCellRef : sink ? sinkCellRef : null}
                val={val}
                row={row}
                col={col}
                source={source}
                sink={sink}
                wall={wall}
                key={key}
              />
            );
          })
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button onClick={handleChangeSource} className="px-8 py-2 bg-green-500 rounded-md font-bold">
            Set Source
          </button>
          <button
            onClick={handleAddWall}
            className="px-8 py-2 bg-[url(/src/assets/textures/wall.jpg)] bg-center bg-cover bg-black text-white rounded-md font-bold"
          >
            Add wall
          </button>
          <button onClick={handleChangeSink} className="px-8 py-2 bg-white rounded-md font-bold">
            Set Sink
          </button>
        </div>
        <div className="flex w-full  bg-black gap-2">
          <button onClick={handleStart} className="px-8 py-2 bg-blue-500 flex-1  rounded-md font-bold">
            Start
          </button>
          <button
            onClick={() => {
              stop();
            }}
            className="px-8 py-2 bg-red-500 flex-1  rounded-md font-bold"
          >
            Pause
          </button>
        </div>
        {/* <input
          type="range"
          min={0.2}
          max={0.8}
          step={0.02}
          defaultValue={duration}
          onChange={(e) => handleDurationChange(1 - +e.target.value)}
        /> */}
      </div>
    </motion.div>
  );
};
export default MazeGrid;
