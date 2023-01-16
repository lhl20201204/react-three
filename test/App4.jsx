import _ from "lodash";
import React from "react";
import { Scene, Box, Container, PerspectiveCamera, WebGLRenderer, World, OrbitControls, useLoop, TrackballControls, Field, AxesHelper, Model, HemisphereLight } from "../3d";
const skyboxUrl = [
  './px.png',
  './nx.png',
  './py.png',
  './ny.png',
  './pz.png',
  './nz.png',
]
export default () => {
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
          <Model src='./collision-world.glb'>
          </Model>
          <Model src='./Soldier.glb' action="Run">
          </Model>
        </Scene>
      </Container>
    </World>
  )
}
