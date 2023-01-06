import React, { useEffect, useRef, useState } from "react";
import { Box, CSS2DObject, CSS3DObject, Material, mixColor, OrbitControls, PerspectiveCamera, Sphere, Three, useLoop, usePreload, World } from "../3d";
import "./index.scss";
function App(props) {
  const [show, setShow] = useState(false)
  const cameraRef = useRef()
  const boxRef = useRef()
  const boxMaterialRef = useRef()
  const css2dRef = useRef()
  const css3dRef = useRef()
  const earthRef = useRef()
  const orbitRef = useRef()

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 2000)
    setTimeout(() => {
      setShow(false)
    }, 6000)
  }, [])

  useLoop(({ t }) => {
    const sin = Math.sin(t / 1000)
    const cos = Math.cos(t / 1000)
    const { current: camera } = cameraRef;
    const { current: box } = boxRef
    const { current: boxMaterial } = boxMaterialRef
    const { current: earth } = earthRef
    camera.x = 2 * (sin - 0.5)
    camera.y = 2 * (cos - 0.5)
    camera.z = 20
    box.rotationX += 0.01
    box.rotationY += 0.01
    boxMaterial.color = mixColor([255, 0, 0], [0, 255, 255], Math.abs(sin))
    css3dRef.current.x = 1 * (sin - 0.5)
    css3dRef.current.z = 1 * (cos - 0.5)
    css2dRef.current.x = 2 * (sin - 0.5)
    css2dRef.current.z = 2 * (cos - 0.5)

    earth.rotationY += 0.01
  })

  // console.log(css3dRef.current?.value?.node, css2dRef.current?.value?.node)

  return (
    <World>
      <PerspectiveCamera ref={cameraRef} z={20} />
      {show && <Box x={2} >
        <Material color={'yellow'}></Material>
      </Box>}
      <Sphere x={4} ref={earthRef}>
        <Material map={'./earth.webp'} color={'rgba(127, 127, 127)'} side={Three.DoubleSide}>
        </Material>

      </Sphere>
      <CSS3DObject ref={css3dRef} x={5}>
        <div style={{ color: 'white', background: 'green', width: 200, height: 30 }}>我是3d</div>
      </CSS3DObject>
      <Box
        rotationX={0}
        rotationY={0}
        width={1}
        height={1}
        depth={1}
        ref={boxRef}>
        <Material ref={boxMaterialRef} map={'./top.webp'}>
        </Material>
        <CSS2DObject ref={css2dRef}>
          <div style={{ color: 'white' }}>我是2d</div>
        </CSS2DObject>
      </Box>
      <OrbitControls />
    </World>

  )
}

export default () => {
  const { progress } = usePreload(['./top.webp', './earth.webp'])
  return progress === 1 && <App />
}