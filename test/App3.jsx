import _ from "lodash";
import React from "react";
import { Scene, Box, Container, PerspectiveCamera, WebGLRenderer, World, OrbitControls, useLoop, TrackballControls, Field, AxesHelper } from "../3d";
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
        <PerspectiveCamera  y={5} z={20} />
        <WebGLRenderer />
        {/* <TrackballControls /> */}
        <OrbitControls autoRotate/>
        <Scene skybox={skyboxUrl}>
          <AxesHelper />
          <Box color={"red"}>
          </Box>
        </Scene>
      </Container>
    </World>
  )
}
