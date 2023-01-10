import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getGroupResolve } from "../../core/resolveValue";
import { getStore } from "../../core/store";
import usePromiseWrap from "../../Hook/usePromiseWrap";
const store = getStore();

const Model = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'Model',
    f: getGroupResolve(() => {
      const object = store.resourceMap[_.get(props, 'src')]
      if (!object) {
        throw new Error('资源必须先预加载')
      }
      const mixer = new THREE.AnimationMixer(object);
      if (object.animations[0]) { // todo
        const action = mixer.clipAction(object.animations[0]);
        action.play();
      }
      return object;
    })
  })
  return props.children
}

export default WithStore(React.forwardRef(Model), {
  name: 'Model'
});