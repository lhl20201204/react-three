import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getGroupResolve } from "../../core/resolveValue";
import usePromiseWrap from "../../Hook/usePromiseWrap";

const DirectionalLight = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'DirectionalLight',
    f: getGroupResolve(() => new THREE.DirectionalLight(
      _.get(props, 'color', '#fff'),
      _.get(props, 'intensity', 1)
    ))
  })
  return props.children
}

export default WithStore(React.forwardRef(DirectionalLight), {
  name: 'DirectionalLight'
});