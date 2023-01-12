import _ from "lodash"
import React from "react"
import { Container, PerspectiveCamera, Scene, WebGLRenderer, World, THREE, HemisphereLight, DirectionalLight, Field, Plane, Model, Box, AxesHelper, useLoop, TrackballControls, SkeletonHelper, OrbitControls } from "../3d"

export default () => {
  useLoop(() => {

  })
  return <World>
    <Container >
      <OrbitControls autoRotate={true} />
      <WebGLRenderer>
        <Field field='shadowMap' enabled={true} >
        </Field>
      </WebGLRenderer>
      <PerspectiveCamera x={2} y={3} z={-6}
        // lookAt={new THREE.Vector3(0, 1, 0)}
      />
      <Scene
        fog={new THREE.Fog(0xa0a0a0, 10, 50)}
        background={new THREE.Color(0xa0a0a0)}
      >
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
        <Plane
          width={200}
          height={200}
          materialType={'MeshPhongMaterial'}
          rotationX={- Math.PI / 2}
          receiveShadow={true}
          color='#999999'
        >
          <Field
            field={'material'}
            depthWrite={false}
          >
          </Field>
        </Plane>
        {
          ['Run', 'idle', 'Walk'].map((action, i) => <Model key={action} src='./Soldier.glb'
            action={action}
            x={(i - 1) * 2}
          >
            <SkeletonHelper>
            </SkeletonHelper>
          </Model>)
        }
      </Scene>
    </Container>
  </World>
}