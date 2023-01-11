import _ from "lodash"
import React from "react"
import { Container, PerspectiveCamera, Scene, WebGLRenderer, World, THREE, HemisphereLight, DirectionalLight, Field, Plane, Material, Model, Box, AxesHelper, useLoop } from "../3d"
export default () => {
  useLoop(() => {
    
  })
  return <World>
    <Container>
      <WebGLRenderer
        outputEncoding={THREE.sRGBEncoding}
        antialias={true}
      >
        <Field field='shadowMap' enabled={true} >
        </Field>
      </WebGLRenderer>
      <PerspectiveCamera x={2} y={3} z={-6} onLoad={(x) => {
        // x.node.lookAt(0, 1, 0);
      }} />
      <Scene
        fog={new THREE.Fog(0xa0a0a0, 10, 50)}
        background={new THREE.Color(0xa0a0a0)}
      >
        <HemisphereLight y={20} />
        <DirectionalLight x={-3} y={10} z={-10} castShadow={true}>
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
        <Plane width={200}
          height={200}
          materialType={'MeshPhongMaterial'}
          rotationX={- Math.PI / 2}
        >
          <Material
            color='#999999'
            depthWrite={false}
            receiveShadow={true}
          >
          </Material>
        </Plane>
        <Box />
        <AxesHelper />
        {/* <Model src='./Soldier.glb'
          getAction={x => x[0]}
          x={-2}
        >
        </Model>
        <Model src='./Soldier.glb'
          getAction={x => x[1]}
          x={0}
        >
        </Model>
        <Model src='./Soldier.glb'
          getAction={x => x[3]}
          x={2}
        >
        </Model> */}
      </Scene>
    </Container>
  </World>
}