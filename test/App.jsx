import React, { useEffect, useRef, useState } from "react";
import { AmbientLight, AxesHelper, Box, Container, CSS2DObject, CSS2DRenderer, CSS3DObject, CSS3DRenderer, Material, mixColor, OrbitControls, PerspectiveCamera, Raycaster, Sphere, THREE, TrackballControls, useLoop, usePreload, WebGLRenderer, World } from "../3d";
import { Scene } from "../3d/components/Scene";
import "./index.scss";
const rand = x => Math.floor(Math.random() * x)
const getC = () => `rgb(${rand(255)}, ${rand(255)}, ${rand(255)})`
const skyboxUrl = [
  './px.png',
  './nx.png',
  './py.png',
  './ny.png',
  './pz.png',
  './nz.png',
]
function App(props) {
  const [show, setShow] = useState(false)
  const [boxPos, setBoxPos] = useState({ x: -2, y: -0.5, z: 0 })
  const cameraRef = useRef()
  const boxRef = useRef()
  const boxMaterialRef = useRef()
  const css2dRef = useRef()
  const css3dRef = useRef()
  const css3dRef2 = useRef()
  const earthRef = useRef()
  const colorConfigRef = useRef(
    [{
      i: 1,
      ref: css3dRef,
      c: getC(),
      bg: getC(),
    }, {
      i: 2,
      ref: css3dRef2,
      c: getC(),
      bg: getC(),
    }]
  )

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
    const { current: css3d } = css3dRef
    const { current: css3d2 } = css3dRef2
    const { current: css2d } = css2dRef
    // camera.x = 2 * (sin - 0.5)
    // camera.y = 2 * (cos - 0.5)
    // camera.z = 20
    // box.rotationX += 0.01
    // box.rotationY += 0.01
    boxMaterial.color = mixColor([125, 125, 125], [0, 255, 255], Math.abs(sin / 3))
    css3d.rotationY += 0.01
    css3d2.rotationY += 0.02
    css2d.x = 0.5 * (sin - 0.5)
    css2d.z = 0.5 * (cos - 0.5)
    earth.rotationY += 0.01
  })

  const camera = <PerspectiveCamera ref={cameraRef} y={5} z={20} />
  const ground = <Box width={1000} depth={1000} height={2} y={-1.5} onDoubleClick={(x) => {
    setBoxPos(x.point)
  }}>
    <Material color={'green'}>
    </Material>
  </Box>
  return (
    <World>
      <Container>
        <Raycaster />
        <WebGLRenderer />
        <TrackballControls />
        <CSS2DRenderer pointerEvents={'none'} />
        {camera}
        <Scene
          skybox={skyboxUrl}
        >
          {ground}
          <AmbientLight></AmbientLight>
          <Box
            {...boxPos}
            ref={boxRef}>
            <Material ref={boxMaterialRef} map={'./top.webp'} side={THREE.DoubleSide}>
            </Material>
            <CSS2DObject ref={css2dRef} y={1} >
              <div style={{ color: 'white' }} >我是2d</div>
            </CSS2DObject>
          </Box>
          <AxesHelper />
          <Box x={2} z={2} visible={show}>
            <Material color={'yellow'}></Material>
          </Box>
          <Sphere x={4} z={4} ref={earthRef}>
            <Material
              map={'./earth.webp'}
              color={'rgba(127, 127, 127)'}
              side={THREE.DoubleSide}>
            </Material>
            <CSS2DObject y={1}>
              <div style={{ color: 'white' }} y={2}>地球</div>
            </CSS2DObject>
          </Sphere>
        </Scene>
      </Container>
      <Container>
        <Scene >
          {
            colorConfigRef.current.map(item =>
              <CSS3DObject key={item.i} ref={item.ref} x={-3 * item.i} y={2 * item.i} z={-2} scaleX={0.01} scaleY={0.01}>
                <div
                  onClick={(el) => {
                    console.log('3del', el)
                  }}
                  style={{ color: item.c, width: 100, height: 100, background: item.bg, fontSize: 28 }}>
                  我是3d
                </div>
              </CSS3DObject>)
          }
        </Scene>
        <CSS3DRenderer pointerEvents={'none'} />
        <Raycaster />
        {camera}
      </Container>
    </World>

  )
}

export default () => {
  const { progress } = usePreload(['./top.webp', './earth.webp', skyboxUrl])
  return progress === 1 && <App />
}