import { AnimationOptions } from "framer-motion";
import { CellType, Maze, Path, PathInfo } from "../../types";
import { Animation } from "../../hooks/useMotionTimeline";

const DIRS = [
  [0, 1],
  [1, 0],
  [-1, 0],
  [0, -1],
];

export const solveMaze = (
  source: CellType,
  sink: CellType,
  cells: CellType[][]
): Path[] => {
  const paths = [] as { validPath: boolean; path: CellType[] }[];

  const visitedCells = new Set<number>();

  function recurse(currCell: CellType, walks: CellType[]) {
    // Add the current cell to the walk
    walks.push(currCell);

    // Check if we've reached the sink
    if (currCell.val === sink.val) {
      paths.push({ validPath: true, path: [...walks] });
      walks.pop(); // Backtrack
      return;
    }

    for (const [row, col] of DIRS) {
      const nextRow = currCell.row + row;
      const nextCol = currCell.col + col;

      // Check the bounds
      if (nextRow < 0 || nextRow >= cells.length) continue;
      if (nextCol < 0 || nextCol >= cells[0].length) continue;

      const nextCell = cells[nextRow][nextCol];
      // check if it is an obstacle or noe
      if (nextCell.wall) continue;

      // Check if the cell is already visited
      if (visitedCells.has(nextCell.val)) continue;

      // Mark the cell as visited
      visitedCells.add(nextCell.val);

      // Recur to the next cell
      recurse(nextCell, walks);

      // Unmark the cell for backtracking
      visitedCells.delete(nextCell.val);
    }

    // If no valid paths were found from this cell, it's an invalid path
    paths.push({ validPath: false, path: [...walks] });

    // Backtrack
    walks.pop();
    return false;
  }

  // Start the recursion from the source
  visitedCells.add(source.val);
  recurse(source, []);
  return paths;
};

export const generateMaze = (
  rows: number,
  cols: number,
  source?: number,
  sink = rows * cols - 1,
  walls = [] as [number, number][]
): Maze => {
  const mazeLen = rows * cols;
  if (!source || source > mazeLen) source = 0;

  const cells: CellType[][] = Array.from({ length: rows }).map((_, r) =>
    Array.from({ length: cols }).map((_, c) => {
      const cellValue = r * cols + c;
      return {
        val: cellValue,
        row: r,
        col: c,
        key: `${r},${c}`,
        source: source === cellValue,
        sink: sink === cellValue,
        wall: false,
      };
    })
  );

  for (const [c, r] of walls) cells[c][r].wall = true;
  return {
    cells,
    sinkVal: sink,
    sourceVal: source,
    walls: [...walls],
  };
};

export const addWallsToMaze = (
  maze: CellType[][],
  prevWalls: [number, number][],
  newWall: number
) => {
  // adding previous walls
  for (const [r, c] of prevWalls) maze[r][c].wall = true;

  // add the newWall
  const newWallRow = Math.floor(newWall / maze[0].length);
  const newWallCol = newWall % maze[0].length;
  maze[newWallRow][newWallCol].wall = true;
  prevWalls.push([newWallRow, newWallCol]);
};

export const changeMazeSource = (
  rows: number,
  cols: number,
  source: number,
  sink: number
) => {
  // we can't mutate the object so we will create a new one
  const newMaze = generateMaze(rows, cols, source, sink);
  return newMaze;
};

export function generatePathsAnimations(
  pathsInfo: PathInfo[]
  // animationOptions?: AnimationOptions
) {
  if (pathsInfo.length) {
    const validPathsAnimations = [] as Animation[][];
    // const resetAnimations = [] as Animation[];
    for (const pathInfo of pathsInfo) {
      // const pathAnimation = [];
      if (pathInfo.validPath) {
        const pathAnimation: Animation[] = [];
        const resetAnimation: Animation[] = [];
        for (const cell of pathInfo.path) {
          const id = `.cell-${cell.val}`;
          resetAnimation.push([
            id,
            { backgroundColor: "#fb923c", scale: 1 },
            { ...TRANSITION }, // duration },
          ]);
          pathAnimation.push([
            id,
            {
              backgroundColor: "green",
              scale: 1.1,
            },
            { ...TRANSITION }, //duration },
          ]);
        }
        validPathsAnimations.push([...pathAnimation, ...resetAnimation]);
      }
    }
    return validPathsAnimations;
    // now reset the animations so it can start again
    // pathsAnimations.push(resetAnimations);
    // setPathsToAnimate(pathsAnimations);
  }
  // const correctPath=validPath.
}

export const TRANSITION: AnimationOptions = {
  ease: "linear",
  duration: 0.1,
};
