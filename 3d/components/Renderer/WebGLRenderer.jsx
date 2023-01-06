import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getResolve } from "../../core/resolveValue";
import usePromiseWrap from "../../Hook/usePromiseWrap";

const WebGLRenderer = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'WebGLRenderer',
    f: getResolve(() => new THREE.WebGLRenderer())
  })
  return props.children
}

export default WithStore(React.forwardRef(WebGLRenderer), {
  name: 'WebGLRenderer'
}) ;