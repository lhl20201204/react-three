import _ from "lodash";
import React, { useEffect, useState } from "react";
import { usePreload } from "../3d";
import "./index.scss";
import App1 from "./App1";
import App2 from "./App2";
import App3 from "./App3";
const skyboxUrl = [
  './px.png',
  './nx.png',
  './py.png',
  './ny.png',
  './pz.png',
  './nz.png',
]
const Comps = [App1, App2, App3]

export default () => {
  const { progress } = usePreload([
    './top.webp',
    './earth.webp',
    skyboxUrl,
    './ground.jpeg',
    './Fox.fbx',
    './Walking.fbx',
    './Idle.fbx',
    './Soldier.glb',
    './Grassland.glb'
  ], {
    onLoad(url, res) {
      if (['./Soldier.glb'].includes(url)) {
        res.scene.traverse(function (object) {
          if (object.isMesh) {
            object.castShadow = true;
          }
        })
      }
    }
  })

  const [id, setId] = useState(3)
  useEffect(() => {
    // const len = Comps.length
    // for(let i = 0; i < len; i++) {
    //   setTimeout(() => {
    //     setId((i + 1) % len)
    //   }, 3000 * (i + 1))
    // }
  }, [])
  const Comp =Comps[id - 1]
  return progress === 1 && <Comp />
}