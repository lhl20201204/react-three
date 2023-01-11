import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Scene, AmbientLight, AxesHelper, Box, Container, CSS2DObject, CSS2DRenderer, CSS3DObject, CSS3DRenderer, Field, Material, mixColor, Model, OrbitControls, PerspectiveCamera, Raycaster, Sphere, THREE, TrackballControls, useLoop, usePreload, WebGLRenderer, World } from "../3d";
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
export default ()=> {
  const [show, setShow] = useState(false)
  const [boxPos, setBoxPos] = useState({ x: -2, y: 0.5, z: 0 })
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

  const camera = <PerspectiveCamera ref={cameraRef} {...{ // 初次为默认值，后续为control的移动值
    x: _.get(cameraRef.current, 'x', 5),
    z: _.get(cameraRef.current, 'z', 20),
    y: _.get(cameraRef.current, 'y', 20)
  }} />
  const ground = (
    <Box width={1000} depth={1000} height={1} y={-0.5} onDoubleClick={(x) => {
      setBoxPos({ ...x.point, y: x.point.y + 0.5 })
    }}>
      <Material color={'green'} map={'./ground.jpeg'}>
        <Field field='map'
          wrapS={THREE.RepeatWrapping}
          wrapT={THREE.RepeatWrapping}
          repeat={{ x: 100, y: 100 }}>
        </Field>
      </Material>
    </Box>)

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
          <Model
            {...boxPos}
            src={'./Fox.fbx'}
            {...{ scaleX: 0.01, scaleY: 0.01, scaleZ: 0.01 }}
          >
            <CSS2DObject ref={css2dRef} y={400} >
              <div style={{ color: 'white' }} >{'('}{Math.round(boxPos.x)},{Math.round(boxPos.z)}{')'} </div>
            </CSS2DObject>
          </Model>
          {/* todo model无法显示 */}
          <Model
            {...{ ...boxPos, x: boxPos.x + 5 }}
            src={'./Walking.fbx'}
            {...{ scaleX: 100, scaleY: 100, scaleZ: 100 }}
          >
            <CSS2DObject >
              <div style={{ color: 'white' }} >Walking</div>
            </CSS2DObject>
          </Model>

          <AmbientLight {...{ // 同步camera 位置
            x: _.get(cameraRef.current, 'x', 5),
            z: _.get(cameraRef.current, 'z', 20),
            y: _.get(cameraRef.current, 'y', 20)
          }}
          ></AmbientLight>
          <Box
            y={2}
            ref={boxRef}>
            <Material ref={boxMaterialRef} map={'./top.webp'} side={THREE.DoubleSide}>
            </Material>
          </Box>
          <AxesHelper />
          <Box x={2} z={2} y={0.5} visible={show}>
            <Material color={'yellow'}></Material>
          </Box>
          <Sphere x={4} z={4} y={2} ref={earthRef}>
            <Material
              map={'./earth.webp'}
              color={'rgba(127, 127, 127)'}
              side={THREE.DoubleSide}>
            </Material>
            <CSS2DObject y={1}>
              {/* todo 2d无法点击 */}
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
                {/* todo 3d无法点击 */}
                <div
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
