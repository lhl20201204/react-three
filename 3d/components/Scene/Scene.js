import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getResolve } from "../../core/resolveValue";
import { getStore } from "../../core/store";
import usePromiseWrap from "../../Hook/usePromiseWrap";

const store = getStore()
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
      if (skyboxSrc.length) {
         scene.background = store.resourceMap[JSON.stringify(skyboxSrc)];
         if (!scene.background) {
          throw new Error('资源必须预加载')
         }
      }
      return scene;
    }),
  })
  return props.children
}

export default WithStore(React.forwardRef(Scene), {
  name: 'Scene'
});