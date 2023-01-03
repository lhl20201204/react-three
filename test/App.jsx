import React, { useEffect, useRef, useState } from "react";
import { Box, CSS2DObject, Material, mixColor, PerspectiveCamera, Sphere, useLoop, World } from "../3d";
import "./index.scss";
export default function App(props) {
  const [show, setShow] = useState(false)
  const cameraRef = useRef()
  const boxRef = useRef()
  const boxMaterialRef = useRef()
  const cssRef = useRef()
  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 2000)
    setTimeout(() => {
      setShow(false)
    }, 10000)
  }, [])

  useLoop(({ t }) => {
    if (
      !cameraRef.current ||
      !boxRef.current) {
      return
    }
    const sin = Math.sin(t / 1000)
    const cos = Math.cos(t / 1000)
    cameraRef.current.x = 5 * (sin - 0.5)
    cameraRef.current.y = 5 * (cos - 0.5)
    cameraRef.current.z = 5
    boxRef.current.rotationX += 0.01
    boxRef.current.rotationY += 0.01
    if (boxMaterialRef.current?.node) {
      boxMaterialRef.current.color = mixColor([255, 0, 0], [0, 255, 255], Math.abs(sin))
    }
    if (cssRef.current?.node) {
      cssRef.current.x = 1 * (sin - 0.5)
      cssRef.current.z = 1 * (cos - 0.5)
    }
  })

  return (
    <World>
      <PerspectiveCamera ref={cameraRef} z={5} />
      {show && <React.Fragment>
        <Box x={2} />
        <Sphere x={4} />
      </React.Fragment>
      }
      <Box
        rotationX={0}
        rotationY={0}
        ref={boxRef}>
        <Material ref={boxMaterialRef} >
        </Material>
        <CSS2DObject ref={cssRef}>
          <div style={{ color: 'white' }}>我是2dobject</div>
        </CSS2DObject>
      </Box>
    </World>
  )
}