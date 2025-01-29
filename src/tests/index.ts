import { solveMaze } from "../lib/Maze/solveMaze";
import { Cell } from "../types";

const maze: Maze = [
  [
    {
      val: 1,
      row: 0,
      col: 0,
      key: "0,0",
      source: true,
      sink: false,
      obstacle: false,
    },
    {
      val: 2,
      row: 0,
      col: 1,
      key: "0,1",
      source: false,
      sink: false,
      obstacle: false,
    },
    {
      val: 3,
      row: 0,
      col: 2,
      key: "0,2",
      source: false,
      sink: false,
      obstacle: false,
    },
    {
      val: 4,
      row: 0,
      col: 3,
      key: "0,3",
      source: false,
      sink: false,
      obstacle: false,
    },
  ],
  [
    {
      val: 5,
      row: 1,
      col: 0,
      key: "1,0",
      source: false,
      sink: false,
      obstacle: false,
    },
    {
      val: 6,
      row: 1,
      col: 1,
      key: "1,1",
      source: false,
      sink: false,
      obstacle: false,
    },
    {
      val: 7,
      row: 1,
      col: 2,
      key: "1,2",
      source: false,
      sink: false,
      obstacle: false,
    },
    {
      val: 8,
      row: 1,
      col: 3,
      key: "1,3",
      source: false,
      sink: false,
      obstacle: false,
    },
  ],
  [
    {
      val: 9,
      row: 2,
      col: 0,
      key: "2,0",
      source: false,
      sink: false,
      obstacle: false,
    },
    {
      val: 10,
      row: 2,
      col: 1,
      key: "2,1",
      source: false,
      sink: false,
      obstacle: false,
    },
    {
      val: 11,
      row: 2,
      col: 2,
      key: "2,2",
      source: false,
      sink: false,
      obstacle: false,
    },
    {
      val: 12,
      row: 2,
      col: 3,
      key: "2,3",
      source: false,
      sink: false,
      obstacle: false,
    },
  ],
  [
    {
      val: 13,
      row: 3,
      col: 0,
      key: "3,0",
      source: false,
      sink: false,
      obstacle: false,
    },
    {
      val: 14,
      row: 3,
      col: 1,
      key: "3,1",
      source: false,
      sink: false,
      obstacle: false,
    },
    {
      val: 15,
      row: 3,
      col: 2,
      key: "3,2",
      source: false,
      sink: false,
      obstacle: false,
    },
    {
      val: 16,
      row: 3,
      col: 3,
      key: "3,3",
      source: false,
      sink: false,
      obstacle: false,
    },
  ],
];

const source: Cell = maze[0][0]; // Start at (0, 0)
const sink: Cell = maze[3][2]; // End at (3, 2)

const paths = solveMaze(source, { ...sink, val: -1 }, maze);

console.log("All Paths:");
paths.forEach((pathObj, index) => {
  if (pathObj.validPath) console.log(`Path ${index + 1}:`, pathObj);
});
