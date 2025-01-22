import React, { useEffect } from "react";
import { Canvas, useImage, Image, Group, rotate } from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { useSharedValue, withTiming, Easing, withSequence, withRepeat, useDerivedValue, interpolate, Extrapolation } from "react-native-reanimated";

const GRAVITY = 20;
const JUMP_FORCE = -500;

const App = () => {
  const { width, height } = useWindowDimensions();
  const bg = useImage(require('../assets/sprites/background-day.png'));
  const bird = useImage(require('../assets/sprites/bluebird-midflap.png'));
  const pipeBottom = useImage(require('../assets/sprites/pipe-green.png'));
  const pipeTop = useImage(require('../assets/sprites/pipe-green-reverse.png'));
  const base = useImage(require('../assets/sprites/base.png'));
  const pipeOffset = 0;

  const x = useSharedValue(width)

  const birdY = useSharedValue(height / 2);
  const birdYVelocity = useSharedValue(100);
  const birdTransform = useDerivedValue(() => {
    return [{
      rotate: interpolate(birdYVelocity.value,
        [-500, 500],
        [-0.5, 0.5],
        Extrapolation.CLAMP
      )
    }]
  })
  const birdOrigin = useDerivedValue(() => {
    return { x: width / 4 + 32, y: birdY.value + 24 }
  })




  // useFrameCallback(({ timeSincePreviousFrame: dt }) => {
  //   if (dt) {
  //     birdY.value = birdY.value + (birdYVelocity.value * dt) / 1000;
  //     birdYVelocity.value = birdYVelocity.value + GRAVITY;
  //   }
  // })

  useEffect(() => {
    x.value = withRepeat(withSequence(
      withTiming(-100, { duration: 3000, easing: Easing.linear }),
      withTiming(width, { duration: 0 })
    ), -1);
  }, [])

  return (
    <Canvas style={{ width, height }} onTouchStart={() => birdYVelocity.value = JUMP_FORCE}>
      <Image image={bg} fit={"cover"} height={height} width={width} />
      <Image image={pipeTop} x={x} y={pipeOffset - 320} height={640} width={103} />
      <Image image={pipeBottom} x={x} y={height - 320 + pipeOffset} height={640} width={103} />
      <Image image={base} width={width} height={100} x={0} y={height - 100} fit={'cover'} />

      <Group
        transform={birdTransform}
        origin={birdOrigin}
      >
        <Image image={bird} x={width / 4} y={birdY} height={48} width={64} />
      </Group>

    </Canvas>
  );
};

export default App;
