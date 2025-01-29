// import { useEffect, useMemo, useRef, useState } from "react";
// import Cell from "./Cell";
// import { changeMazeSource, generateMaze, solveMaze } from "../lib/solveMaze";
// import { CellType, Maze } from "../types";
// import toast from "react-hot-toast";

// const MazeGrid = () => {
//   const [rows, setRows] = useState(2);
//   const [cols, setCols] = useState(2);
//   const [sourceVal, setSourceVal] = useState(0);
//   const [sinkVal, setSinkVal] = useState(rows * cols - 1);

//   const rowInputRef = useRef<HTMLInputElement>(null);
//   const colInputRef = useRef<HTMLInputElement>(null);
//   const mazeRef = useRef<HTMLDivElement>(null);
//   const sourceCellRef = useRef(null);
//   const sinkCellRef = useRef(null);
//   const [maze, setMaze] = useState<Maze>(
//     generateMaze(rows, cols, 0, rows * cols - 1)
//   );

//   // this effect is for changing the source
//   useEffect(() => {
//     // only if the source is not the same as the sourceVal then change it
//     const cells = maze.flatMap((row) => row);
//     const prevSourceCell = cells.find((cell) => cell.source);
//     const prevSinkCell = cells.find((cell) => cell.sink);
//     if (sourceVal !== prevSourceCell?.val || sinkVal !== prevSinkCell?.val)
//       setMaze((maze) => changeMazeSource(maze, sourceVal, sinkVal));
//   }, [sourceVal, maze, sinkVal]);

//   // this one is for generating new maze when col or row change
//   useEffect(() => {
//     if (maze.length !== rows || maze[0].length !== cols)
//       setMaze(generateMaze(rows, cols));
//   }, [rows, cols]);

//   const handleSetSource = (event: globalThis.MouseEvent) => {
//     const target = event.target as HTMLElement;
//     // Find the closest parent element with the class "cell"
//     const cellElement = target.closest(".cell") as HTMLElement;

//     if (cellElement.dataset.val)
//       if (cellElement) {
//         if (+cellElement.dataset.val === sinkVal)
//           toast.error(`Sink and Source can't be the same`);
//         else {
//           toast.success(`Source is now cell: ${cellElement.dataset.val}`);
//           setSourceVal(+cellElement.dataset.val!);
//         }
//       } else {
//         toast.error("Please select a cell from the maze");
//       }
//     if (mazeRef.current)
//       mazeRef.current.removeEventListener("click", handleSetSource);
//   };
//   const handleSetSink = (event: globalThis.MouseEvent) => {
//     const target = event.target as HTMLElement;

//     // Find the closest parent element with the class "cell"
//     const cellElement = target.closest(".cell") as HTMLElement;
//     if (cellElement.dataset.val)
//       if (cellElement) {
//         if (+cellElement.dataset.val === sourceVal)
//           toast.error(`Sink and Source can't be the same`);
//         else {
//           toast.success(`Source is now cell: ${cellElement.dataset.val}`);
//           setSinkVal(+cellElement.dataset.val!);
//         }
//       } else {
//         toast.error("Please select a cell from the maze");
//       }
//     if (mazeRef.current)
//       mazeRef.current.removeEventListener("click", handleSetSink);
//   };
//   const handleChangeSource = () => {
//     if (!mazeRef.current) return;
//     mazeRef.current.addEventListener("click", handleSetSource);
//   };
//   const handleChangeSink = () => {
//     if (!mazeRef.current) return;
//     mazeRef.current.addEventListener("click", handleSetSink);
//   };

//   const handleStart = () => {
//     if (!sourceCellRef && sinkCellRef) return;
//     let sourceCell: CellType | null = null;
//     for (let i = 0; i < maze.length; i++) {
//       for (let j = 0; j < maze[i].length; j++)
//         if (maze[i][j].source) {
//           sourceCell = maze[i][j];
//           break;
//         }
//       if (sourceCell) break;
//     }
//     console.log(maze);
//     let sinkCell: CellType | null = null;
//     for (let i = 0; i < maze.length; i++) {
//       for (let j = 0; j < maze[i].length; j++) {
//         console.log(maze[i][j].sink);
//         if (maze[i][j].sink) {
//           sinkCell = maze[i][j];
//           break;
//         }
//       }
//       if (sinkCell) break;
//     }

//     if (!sourceCell) return alert("Couldn't find source cell");
//     if (!sinkCell) return alert("Couldn't find sink cell");

//     // console.log(sourceCell);
//     // console.log(sinkCell);
//     const paths = solveMaze(sourceCell, sinkCell, maze);
//     console.log(paths);
//   };

//   const renderedGrid = useMemo(
//     () =>
//       maze.flatMap((mazeRow) =>
//         mazeRow.map(({ col, key, row, sink, source, val }) => (
//           <Cell
//             ref={source ? sourceCellRef : sink ? sinkCellRef : null}
//             val={val}
//             row={row}
//             col={col}
//             key={key}
//             source={source}
//             sink={sink}
//             obstacle={false}
//           />
//         ))
//       ),
//     [maze]
//   );

//   return (
//     <div className="w-full flex flex-col justify-center items-center gap-12">
//       <div className="flex gap-2">
//         <input
//           className="rounded-md p-2"
//           ref={rowInputRef}
//           type="number"
//           placeholder="Rows"
//           onChange={(e) => {
//             if (+e.target.value >= 0 && +e.target.value <= 20)
//               setRows(+e.target.value);
//             else {
//               if (rowInputRef.current) rowInputRef.current.value = "0";
//             }
//           }}
//         />
//         <input
//           className="rounded-md p-2"
//           ref={colInputRef}
//           type="number"
//           placeholder="Cols"
//           onChange={(e) => {
//             if (+e.target.value >= 0 && +e.target.value <= 20)
//               setCols(+e.target.value);
//             else {
//               if (colInputRef.current) colInputRef.current.value = "0";
//             }
//           }}
//         />
//       </div>
//       <div
//         ref={mazeRef}
//         className="grid gap-1"
//         style={{
//           gridTemplateColumns: `repeat(${cols}, 1fr)`,
//           gridTemplateRows: `repeat(${rows}, 1fr)`,
//         }}
//         // key={cols}
//       >
//         {/* {maze.flatMap((mazeRow) =>
//           mazeRow.map(({ col, key, row, sink, source, val }) => (
//             <Cell
//               ref={source ? sourceCellRef : sink ? sinkCellRef : null}
//               val={val}
//               row={row}
//               col={col}
//               key={key}
//               source={source}
//               sink={sink}
//               obstacle={false}
//             />
//           ))
//         )} */}
//         {renderedGrid}
//       </div>
//       <div className="flex flex-col gap-2">
//         <div className="flex gap-2">
//           <button
//             onClick={handleChangeSource}
//             className="px-8 py-2 bg-green-500 rounded-md font-bold"
//           >
//             Set Source
//           </button>
//           <button
//             onClick={handleChangeSink}
//             className="px-8 py-2 bg-white rounded-md font-bold"
//           >
//             Set Sink
//           </button>
//         </div>
//         <button
//           onClick={handleStart}
//           className="px-8 py-2 bg-blue-500  rounded-md font-bold"
//         >
//           Start
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MazeGrid;
