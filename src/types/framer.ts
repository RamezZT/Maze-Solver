import {
  AnimationControls,
  TargetAndTransition,
  VariantLabels,
  motion,
} from "motion/react";
import { ComponentProps } from "react";

export type Animate =
  | boolean
  | AnimationControls
  | TargetAndTransition
  | VariantLabels
  | undefined;

export type MotionDivProps = ComponentProps<typeof motion.div>;
