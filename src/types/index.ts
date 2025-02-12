export type CellType = {
  val: number;
  row: number;
  col: number;
  key: string;
  source: boolean;
  sink: boolean;
  wall: boolean;
};

export type Maze = {
  cells: CellType[][];
  walls: [number, number][];
  // sourceVal: number;
  source: CellType;
  sink: CellType;
  // sinkVal: number;
};

export type PathInfo = {
  validPath: boolean;
  path: CellType[];
};
