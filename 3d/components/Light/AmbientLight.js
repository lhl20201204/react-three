import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getResolve } from "../../core/resolveValue";
import usePromiseWrap from "../../Hook/usePromiseWrap";

const AmbientLight = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'AmbientLight',
    f: getResolve(() => new THREE.AmbientLight(
      _.get(props, 'color', '#fff'),
      _.get(props, 'intensity', 0.3)
    ))
  })
  return props.children
}

export default WithStore(React.forwardRef(AmbientLight), {
  name: 'AmbientLight'
});