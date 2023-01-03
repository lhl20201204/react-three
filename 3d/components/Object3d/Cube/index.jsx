import _ from "lodash";
import React, { useRef } from "react";
import * as THREE from 'three';
import { WithStore } from "../../../core";
import useWrapGroupNode from '../../../Hook/useWrapGroupNode'
const Cube = function (props, ref) {
  const instanceRef = useRef(new THREE[_.get(props, 'meshType', 'Mesh')]( new THREE.BoxGeometry(
    _.get(props, 'width', 1),
    _.get(props, 'height', 1),
    _.get(props, 'depth', 1),
    _.get(props, 'widthSegments', 1),
    _.get(props, 'heightSegments', 1),
    _.get(props, 'depthSegments', 1),
  ), new THREE[_.get(props, 'materialType', 'MeshBasicMaterial')]({
    color: _.get(props, 'color', 'red')
  }) ))
  useWrapGroupNode(instanceRef.current, props, ref)
  return props.children
}

export default WithStore(React.forwardRef(Cube), {
  name: 'Cube'
});