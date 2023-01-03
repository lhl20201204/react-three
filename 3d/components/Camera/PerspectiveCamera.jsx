import _ from "lodash";
import React, { useRef } from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import useWrapNode from "../../Hook/useWrapNode";

const PerspectiveCamera = function (props, ref) {
  const instanceRef = useRef(new THREE.PerspectiveCamera(
    _.get(props, 'fov', 120),
    _.get(props, 'aspect', (window.innerWidth / window.innerHeight)),
    _.get(props, 'near', 0.1),
    _.get(props, 'far', 2000)
  ))
  useWrapNode(instanceRef.current, props, ref)
  return props.children
}

export default WithStore(React.forwardRef(PerspectiveCamera), {
  name: 'PerspectiveCamera'
}) ;