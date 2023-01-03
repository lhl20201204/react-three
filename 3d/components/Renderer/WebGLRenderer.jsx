import _ from "lodash";
import React, { useRef } from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import useWrapNode from "../../Hook/useWrapNode";

const WebGLRenderer = function (props, ref) {
  const instanceRef = useRef(new THREE.WebGLRenderer())
  useWrapNode(instanceRef.current, props, ref)
  return props.children
}

export default WithStore(React.forwardRef(WebGLRenderer), {
  name: 'WebGLRenderer'
}) ;