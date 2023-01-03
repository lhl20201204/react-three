import _ from "lodash";
import React, { useRef } from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import useWrapNode from "../../Hook/useWrapNode";

const AmbientLight = function (props, ref) {
  const instanceRef = useRef(new THREE.AmbientLight(
    _.get(props, 'color', '#fff'),
    _.get(props, 'intensity', 0.3)
  ))
  useWrapNode(instanceRef.current, props, ref)
  return props.children
}

export default WithStore(React.forwardRef(AmbientLight), {
  name: 'AmbientLight'
});