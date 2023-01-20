import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { Scene, AmbientLight, AxesHelper, Box, Container, CSS2DObject, CSS2DRenderer, CSS3DObject, CSS3DRenderer, Field, mixColor, Model, OrbitControls, PerspectiveCamera, Raycaster, Sphere, THREE, TrackballControls, useLoop, usePreload, WebGLRenderer, World, getScale, SkeletonHelper, HemisphereLight, DirectionalLight, getPosition } from "../3d";
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
let step = -1
export default () => {
  const foxRef = useRef()
  const [show, setShow] = useState(0)
  const [boxPos, setBoxPos] = useState({ x: 0, y: 0.5, z: 0 })
  const [action, setAction] = useState('idle')
  const cameraRef = useRef()
  const boxMaterialRef = useRef()
  const css2dRef = useRef()
  const colorConfigRef = useRef(
    [{
      i: 1,
      c: getC(),
      bg: getC(),
    }, {
      i: 2,
      c: getC(),
      bg: getC(),
    }]
  )
  const [color, setColor] = useState('white')

  useEffect(() => {
    setTimeout(() => {
      setShow(1)
    }, 2000)
    setTimeout(() => {
      setShow(2)
    }, 6000)
  }, [])

  useLoop(({ t }) => {
    const sin = Math.sin(t / 1000)
    const cos = Math.cos(t / 1000)
    const { current: boxMaterial } = boxMaterialRef
    const { current: css2d } = css2dRef
    // 将立方体颜色自动变化
    boxMaterial.color = mixColor([125, 125, 125], [0, 255, 255], Math.abs(sin / 3))
    css2d.x = 0.5 * (sin - 0.5)
    css2d.z = 0.5 * (cos - 0.5)
  })
  // 相机
  const camera = <PerspectiveCamera ref={cameraRef}
    subscribe={{
      watch: ['soldier', 'fox'],
      cb: (_, a, b) => {
        // b[0] 是订阅的uid为soldier，b[1]是订阅的uid为fox的
        a.x = b[0].x
        a.y = b[0].y + 8
        a.z = b[0].z 
        a.lookAt(new THREE.Vector3(b[1].x, b[1].y, b[1].z))
      }
    }} />
  // 草地
  const ground = (
    <Box width={1000} depth={1000} height={1} y={-0.5}
      onDoubleClick={(x) => {
        setBoxPos({ ...x.point, y: x.point.y + 0.5 })
        foxRef.current.lookAt(x.point)
      }}
      color={color}
      onMouseOver={() => {
        console.log('鼠标移入草地')
        setColor('green')
      }}
      onMouseOut={() => {
        console.log('鼠标移出草地')
        setColor('white')
      }}
      map={'./ground.jpeg'}
    >
      <Field field='material.map'
        wrapS={THREE.RepeatWrapping}
        wrapT={THREE.RepeatWrapping}
        repeat={{ x: 100, y: 100 }}>
      </Field>
    </Box>)
  // 士兵
  const solider = <Model
    uid="soldier"
    {...getScale(4)}
    src='./Soldier.glb'
    action={['Idle', 'Walk', 'Run'][show]}
    onUpdate={(solider) => {
      if (solider.z < -10) {
        step = 1
      } else if (solider.z > 100) {
        step = -1
      }
      solider.z += 0.1 * step
    }}
  >
    <SkeletonHelper></SkeletonHelper>
  </Model>
  // 狐狸
  const fox = <Model
    uid="fox"
    {...getPosition(foxRef)}
    src={'./Fox.fbx'}
    {...getScale(1 / 100)}
    ref={foxRef}
    animations={{ idle: "./Idle.fbx", walking: "./Walking.fbx", soldier: './Soldier.glb' }}
    action={action}
    onUpdate={(x) => {
      x.moveForward(0.08)
      if (x.distVec > 0 && action === 'idle') {
        setAction('walking')
      } else if (x.distVec === 0 && action === 'walking') {
        setAction('idle')
      }
    }}
  >
    {/* 狐狸的骨骼 */}
    <SkeletonHelper></SkeletonHelper>
    <CSS2DObject ref={css2dRef} y={400} >
      <div style={{ color: 'white', textAlign: 'center' }} >
        双击前往目标<br />
        {'('}{Math.round(boxPos.x)},{Math.round(boxPos.z)}{')'} </div>
    </CSS2DObject>
  </Model>
  // 地球
  const earth = <Sphere x={4} z={4} y={2} map={'./earth.webp'} color={'rgba(127, 127, 127)'}
    onUpdate={(earth) => {
      earth.rotationY += 0.01
    }}
  >
    <Field field="material"
      side={THREE.DoubleSide}
    >
    </Field>
    <CSS2DObject y={1} >
      {/* todo 2d无法点击 */}
      <div style={{ color: 'white' }} y={2}>地球</div>
    </CSS2DObject>
  </Sphere>
  // 立方体
  const cube = <Box
    y={2}
    map={'./top.webp'}
    onUpdate={(obj) => {
      obj.rotationX += 0.01
      obj.rotationY += 0.01
    }}
  >
    <Field field="material" ref={boxMaterialRef}
      side={THREE.DoubleSide}
    >
    </Field>
  </Box>

  return (
    <World>
      <Container>
        <Raycaster dblClick mouseMove />
        <WebGLRenderer />
        {/* <TrackballControls /> */}
        <CSS2DRenderer pointerEvents={'none'} />
        {camera}
        <Scene
          skybox={skyboxUrl}
        >
          <Box x={2} z={2} y={0.5} color={'blue'} visible={show === 1}>
          </Box>
          <HemisphereLight y={20} />
          <DirectionalLight x={-3} y={10} z={-10} castShadow={true} >
            <Field field="shadow.camera"
              top={4}
              bottom={-4}
              left={4}
              right={-4}
              near={0.1}
              far={40}
            >
            </Field>
          </DirectionalLight>
          {ground}
          {solider}
          {fox}
          {cube}
          <AxesHelper size={100} />
          {earth}
        </Scene>
      </Container>
      <Container>
        <Scene >
          {
            colorConfigRef.current.map(item =>
              <CSS3DObject key={item.i}
                onUpdate={x => {
                  x.rotationY += 0.01 * item.i
                }}
                x={-3 * item.i} y={2 * item.i} z={-2} scaleX={0.01} scaleY={0.01}>
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
