import _ from "lodash";
import React, { useRef, useState } from "react";
import { Scene, Box, Container, PerspectiveCamera, WebGLRenderer, World, OrbitControls, useLoop, TrackballControls, Field, AxesHelper, Model, HemisphereLight, Raycaster } from "../3d";
const skyboxUrl = [
  './px.png',
  './nx.png',
  './py.png',
  './ny.png',
  './pz.png',
  './nz.png',
]
// onAnimationsLoad
// distVec
export default () => {
  const soliderRef = useRef()
  const [action, setAction] = useState('Idle')
  useLoop(() => {

  })
  return (
    <World>
      <Container>
        <PerspectiveCamera y={5} z={20} />
        <WebGLRenderer />
        <OrbitControls />
        <Scene skybox={skyboxUrl}>
          <AxesHelper />
          <HemisphereLight />
          <Model
            src='./Grassland.glb'
            onDoubleClick={x => {
              soliderRef.current.lookAt(x.point)
            }}
          >
          </Model>
          <Model
            ref={soliderRef}
            innerRotationY={-Math.PI}
            src='./Soldier.glb'
            onAnimationsLoad={console.log}
            action={action}
            onUpdate={(x) => {
              x.moveForward(0.04)
              if (x.distVec > 0 && action === 'Idle') {
                setAction('Walk')
              } else if (x.distVec === 0 && action === 'Walk') {
                setAction('Idle')
              }
            }}
          >
          </Model>
        </Scene>
        <Raycaster dblClick></Raycaster>
      </Container>
    </World>
  )
}
