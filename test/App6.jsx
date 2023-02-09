import _ from "lodash";
import React, { useRef, useState } from "react";
import { THREE, Scene, Box, Container, PerspectiveCamera, WebGLRenderer, World, OrbitControls, useLoop, TrackballControls, Field, AxesHelper, Model, HemisphereLight, Raycaster, getPosition, FirstPersonControls, getScale, CSS2DObject, CSS3DRenderer, CSS2DRenderer } from "../3d";
const skyboxUrl = [
  './px.png',
  './nx.png',
  './py.png',
  './ny.png',
  './pz.png',
  './nz.png',
]
export default () => {
  const foxRef = useRef()
  const cameraRef = useRef()
  const [action, setAction] = useState('idle')
  const [boxPos, setBoxPos] = useState({x: 0, y: 0, z: 0})

  useLoop(() => {
    if (action === 'walking') {
      foxRef.current.goToLookAt(0.01)
    }
  }, [action])

  const ground = (
    <Box boxVisible width={1000} depth={1000} height={1} y={-0.5}
      uid="floor"
      map={'./ground.jpeg'}
      onDoubleClick={x => {
        console.log(x.point)
        setBoxPos(x.point)
        foxRef.current.lookAt(x.point)
        setAction('walking')
      }}
    >
      <Field field='material.map'
        wrapS={THREE.RepeatWrapping}
        wrapT={THREE.RepeatWrapping}
        repeat={{ x: 100, y: 100 }}>
      </Field>
    </Box>)

  const fox = <Model
    boxVisible
    uid="fox"
    ref={foxRef}
    {...getPosition(foxRef, { x: 5, z: 5 })}
    src={'./Fox.fbx'}
    {...getScale(0.01)}
    animations={{ idle: "./Idle.fbx", walking: "./Walking.fbx", soldier: './Soldier.glb' }}
    action={action}
    intersectIDs={["unvisibleBox"]}
    onIntersect={() => {
      setAction('idle')
    }}
  >
    <CSS2DObject y={400} onClick={x => {
      console.log(x, '位置坐标点击')
    }}>
      <div style={{ color: 'white', textAlign: 'center' }} >
        双击前往目标<br />
        {'('}{Math.round(boxPos.x)},{Math.round(boxPos.z)}{')'} </div>
    </CSS2DObject>
  </Model>

  return (
    <World>
      <Container>
        <Raycaster dblClick />
        <PerspectiveCamera ref={cameraRef} {...getPosition(cameraRef, { y: 5, z: 20 })}/>
        <WebGLRenderer />
        <CSS2DRenderer />
        <Scene skybox={skyboxUrl}>
          <AxesHelper />
          <HemisphereLight />
          {ground}
          <Box {...boxPos} uid="unvisibleBox" boxVisible></Box>
          {fox}
        </Scene>
      </Container>

    </World>
  )
}
