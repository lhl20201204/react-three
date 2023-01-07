import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getResolve } from "../../core/resolveValue";
import { getStore } from "../../core/store";
import usePromiseWrap from "../../Hook/usePromiseWrap";
const store = getStore()

const PerspectiveCamera = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'PerspectiveCamera',
    f: getResolve(() => {
      const dom = store.domElement;
      const camera = new THREE.PerspectiveCamera(
      _.get(props, 'fov', 45),
      _.get(props, 'aspect', (dom.clientWidth / dom.clientHeight)),
      _.get(props, 'near', 0.1),
      _.get(props, 'far', 2000)
    )
    return camera
  })
  })
  return props.children
}

export default WithStore(React.forwardRef(PerspectiveCamera), {
  name: 'PerspectiveCamera'
});