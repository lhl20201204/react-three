import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getResolve } from "../../core/resolveValue";
import usePromiseWrap from "../../Hook/usePromiseWrap";

const PerspectiveCamera = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'PerspectiveCamera',
    f: getResolve(() => new THREE.PerspectiveCamera(
      _.get(props, 'fov', 45),
      _.get(props, 'aspect', (window.innerWidth / window.innerHeight)),
      _.get(props, 'near', 0.1),
      _.get(props, 'far', 2000)
    ))
  })
  return props.children
}

export default WithStore(React.forwardRef(PerspectiveCamera), {
  name: 'PerspectiveCamera'
});