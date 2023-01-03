import _ from "lodash";
import React, { useRef } from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import useWrapNode from "../../Hook/useWrapNode";

const Scene = function (props, ref) {
  const instanceRef = useRef(new THREE.Scene())
  useWrapNode(instanceRef.current, props, ref)
  return props.children
}

export default WithStore(React.forwardRef(Scene), {
  name: 'Scene'
});