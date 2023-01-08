import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getResolve } from "../../core/resolveValue";
import usePromiseWrap from "../../Hook/usePromiseWrap";

const Scene = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'Scene',
    f: getResolve(() => {
      const scene = new THREE.Scene()
      const skyboxSrc = _.get(
        props,
        'skybox',
        []
      )
      if (skyboxSrc) {
         scene.background = new THREE.CubeTextureLoader().load(skyboxSrc);
      }
      return scene;
    }),
  })
  return props.children
}

export default WithStore(React.forwardRef(Scene), {
  name: 'Scene'
});