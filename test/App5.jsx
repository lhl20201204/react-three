import _ from "lodash";
import React, { useRef, useState } from "react";
import { THREE, Scene, Box, Container, PerspectiveCamera, WebGLRenderer, World, OrbitControls, useLoop, TrackballControls, Field, AxesHelper, Model, HemisphereLight, Raycaster, getPosition, FirstPersonControls } from "../3d";
const skyboxUrl = [
  './px.png',
  './nx.png',
  './py.png',
  './ny.png',
  './pz.png',
  './nz.png',
]
export default () => {
  const soliderRef = useRef()
  const cameraRef = useRef()
  const [action, setAction] = useState('Idle')
  const controlRef = useRef()
  const [btnShow, setBtnShow] = useState(true)
  useLoop(() => {

  })

  const ground = (
    <Box boxVisible width={1000} depth={1000} height={1} y={-0.5}
      uid="floor"
      map={'./ground.jpeg'}
    // onDoubleClick={x => {
    //   console.log(x.point)
    //   soliderRef.current.lookAt(x.point)
    // }}
    >
      <Field field='material.map'
        wrapS={THREE.RepeatWrapping}
        wrapT={THREE.RepeatWrapping}
        repeat={{ x: 100, y: 100 }}>
      </Field>
    </Box>)
  return (
    <World>
      <Container>
        <Raycaster dblClick />
        <FirstPersonControls
          ref={controlRef}
          intersectIDs={['floor']}
          onUnLock={() => setBtnShow(true)}
          targetId="Soldier"
          eyeHeight={0}
          speed={1}
          speedStep={0.1}
          onKeyDown={x => {
            if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(x)) {
              if (action === 'Idle') {
                setAction('Walk')
              }
            }
          }}
          onKeyUp={x => {
            if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(x)) {
              if (action === 'Walk') {
                setAction('Idle')
              }
            }
          }}
        >
          <div style={{
            height: '100vh',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <button style={{ display: btnShow ? 'inline-block' : 'none' }} onClick={() => {
              controlRef.current.lock()
              setBtnShow(false)
            }}>
              进入第三人称视角
            </button>
          </div>
        </FirstPersonControls>
        <PerspectiveCamera ref={cameraRef} {...getPosition(cameraRef, { y: 5, z: 20 })}
          subscribe={
            {
              watch: ['followCamera', 'Soldier'],
              cb(x, _, y) {
                x.position.lerp(y[0].getWorldPosition(new THREE.Vector3()), 1)
                const pos = y[1].getWorldPosition(new THREE.Vector3()).clone();
                pos.y += 3
                x.lookAt(pos)
              }
            }
          }
        />
        <WebGLRenderer />
        <Scene skybox={skyboxUrl}>
          <AxesHelper />
          <HemisphereLight />
          {ground}
          <Model
            // boxVisible
            ref={soliderRef}
            uid='Soldier'
            src='./Soldier.glb'
            action={action}
          >
            <Box uid="followCamera" y={4} z={4} visible={false} boxVisible></Box>
          </Model>
        </Scene>
      </Container>

    </World>
  )
}
