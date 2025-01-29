// import MazeGrid from "./components/Maze";

import MazeGrid from "./components/Maze";

const App = () => {
  return (
    <div className=" w-full max-w-[900px] mx-auto justify-center flex flex-col gap-8">
      <h1 className="text-6xl text-center text-white font-semibold">
        Maze Solver
      </h1>
      {/* <MazeGrid /> */}
      <MazeGrid />
    </div>
  );
};

export default App;
