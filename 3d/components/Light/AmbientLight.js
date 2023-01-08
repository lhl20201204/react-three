import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getGroupResolve } from "../../core/resolveValue";
import usePromiseWrap from "../../Hook/usePromiseWrap";

const AmbientLight = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'AmbientLight',
    f: getGroupResolve(() => new THREE.AmbientLight(
      _.get(props, 'color', '#fff'),
      _.get(props, 'intensity', 0.3)
    ))
  })
  return props.children
}

export default WithStore(React.forwardRef(AmbientLight), {
  name: 'AmbientLight'
});