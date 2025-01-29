import { Maze } from "../../types";
import { addWallsToMaze, generateMaze } from "./solveMaze";

type State = {
  rows: number;
  cols: number;
  maze: Maze;
};

type Action =
  | { type: "SET_ROWS"; payload: number }
  | { type: "SET_COLS"; payload: number }
  | { type: "SET_SOURCE"; payload: number }
  | { type: "SET_SINK"; payload: number }
  | { type: "SET_WALL"; payload: number }
  | { type: "SET_MAZE"; payload: { maze: Maze; sink: number } };

const initialState: State = {
  rows: 3,
  cols: 3,
  maze: generateMaze(3, 3, 0, 8),
};

const mazeReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_ROWS":
      return setMazeRows(state, action.payload);
    case "SET_COLS":
      return setMazeCols(state, action.payload);
    case "SET_SOURCE":
      return setSource(state, action.payload);
    case "SET_SINK":
      return setSink(state, action.payload);
    case "SET_WALL":
      return setWall(state, action.payload);
    case "SET_MAZE":
      return {
        ...state,
        maze: action.payload.maze,
        // sinkVal: action.payload.sink,
      };

    default:
      return state;
  }
};

export { mazeReducer, initialState };

const setMazeRows = (state: State, newRow: number): State => {
  const newSink = state.cols * newRow - 1;
  const newMaze = generateMaze(
    newRow,
    state.cols,
    state.maze.sourceVal,
    newSink
  );
  return {
    ...state,
    rows: newRow,
    maze: newMaze,
  };
};

const setMazeCols = (state: State, newCol: number): State => {
  const newSink = state.rows * newCol - 1;
  const newMaze = generateMaze(
    state.rows,
    newCol,
    state.maze.sourceVal,
    newSink
  );
  return {
    ...state,
    cols: newCol,
    maze: newMaze,
  };
};

const setSource = (state: State, newSource: number): State => {
  return {
    ...state,

    maze: generateMaze(
      state.rows,
      state.cols,
      newSource,
      undefined,
      state.maze.walls
    ),
  };
};
const setSink = (state: State, newSink: number): State => {
  return {
    ...state,
    maze: generateMaze(
      state.rows,
      state.cols,
      state.maze.sourceVal,
      newSink,
      state.maze.walls
    ),
  };
};

const setWall = (state: State, newWall: number): State => {
  const newMaze = generateMaze(
    state.rows,
    state.cols,
    state.maze.sourceVal,
    state.maze.sinkVal,
    state.maze.walls
  );
  addWallsToMaze(newMaze.cells, newMaze.walls, newWall);
  return {
    ...state,
    maze: newMaze,
  };
};
