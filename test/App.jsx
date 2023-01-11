import _ from "lodash";
import React from "react";
import { usePreload, THREE } from "../3d";
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

export default () => {
  const { progress } = usePreload([
    './top.webp',
    './earth.webp',
    skyboxUrl,
    './ground.jpeg',
    './Fox.fbx',
    './Walking.fbx',
    './Idle.fbx',
    './Soldier.glb'
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
  return progress === 1 && <App1 />
}