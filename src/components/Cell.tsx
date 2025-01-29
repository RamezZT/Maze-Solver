import React from "react";
import { CellType } from "../types";
import { motion } from "motion/react";
import { MotionDivProps } from "../types/framer";
import WallTexture from "../assets/textures/wall.jpg";
type CellProps = CellType & MotionDivProps;
const Cell = React.memo(
  ({ col, row, val, source, sink, wall, ...motionProps }: CellProps) => {
    return (
      <motion.div
        // style={{
        //   backgroundImage: wall ? `url(${WallTexture})` : undefined,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
        {...motionProps}
        data-val={val}
        id={`${row},${col}`}
        // ref={ref}
        className={`cell-${val} cell ${source && "bg-[#16a34a]"} ${
          sink && "bg-white text-black"
        } ${
          wall && "bg-[url(/src/assets/textures/wall.jpg)] bg-cover bf-center"
        } w-12 h-12 ${
          !source && !sink && "bg-orange-400"
        } border-2 p-8  rounded-2xl flex items-center justify-center
      transition-all hover:-translate-y-[2px] cursor-pointer
      `}
      >
        <h1 className="font-semibold text-2xl">
          {!wall && (sink ? "🚩" : source ? "🏁" : val)}
        </h1>
      </motion.div>
    );
  }
);

export default Cell;
