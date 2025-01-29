import {
  AnimationOptions,
  DOMKeyframesDefinition,
  ElementOrSelector,
  useAnimate,
} from "framer-motion";
import { useEffect, useRef } from "react";

type AnimateParams = [
  ElementOrSelector,
  DOMKeyframesDefinition,
  (AnimationOptions | undefined)?
];

export type Animation = AnimateParams | Animation[];

const useMotionTimeline = (keyframes: Animation[], count: number = 1) => {
  const mounted = useRef(true);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    mounted.current = true;

    handleAnimate();

    return () => {
      mounted.current = false;
    };
  }, [keyframes]);

  const processAnimation = async (animation: Animation) => {
    // If list of animations, run all concurrently
    if (Array.isArray(animation[0])) {
      await Promise.all(
        animation.map(async (a) => {
          await processAnimation(a as Animation);
        })
      );
    } else {
      // Else run the single animation
      const animationParam = animation as AnimateParams;
      const selector = animationParam[0];
      const domKeyframes = animationParam[1];
      const animationsOptions = animationParam[2];
      // await animate(...(animation as AnimateParams));
      await animate(selector, { ...domKeyframes }, animationsOptions);
    }
  };

  const handleAnimate = async () => {
    for (let i = 0; i < count && keyframes.length !== 0; i++) {
      if (!mounted.current) return;
      for (const animation of keyframes) {
        if (!mounted.current) return;
        await processAnimation(animation);
      }
    }
  };

  const stop = () => {
    mounted.current = false;
  };

  return { scope, start: handleAnimate, stop };
};

export default useMotionTimeline;
