import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getResolve } from "../../core/resolveValue";
import usePromiseWrap from "../../Hook/usePromiseWrap";

const Scene = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'Scene',
    f: getResolve(() => new THREE.Scene())
  })
  return props.children
}

export default WithStore(React.forwardRef(Scene), {
  name: 'Scene'
});