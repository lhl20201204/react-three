import _ from "lodash";
import React, { useRef } from "react";
import * as THREE from 'three';
import { WithStore } from "../../../core";
import useWrapGroupNode from '../../../Hook/useWrapGroupNode'
const Sphere = function (props, ref) {
  const instanceRef = useRef(new THREE[_.get(props, 'meshType', 'Mesh')]( new THREE.SphereGeometry(
    _.get(props, 'radius', 1),
    _.get(props, 'widthSegments', 32),
    _.get(props, 'heightSegments', 16),
    _.get(props, 'phiStart', 0),
    _.get(props, 'phiLength', Math.PI * 2),
    _.get(props, 'thetaStart', 0),
    _.get(props, 'thetaLength', Math.PI),
  ), new THREE[_.get(props, 'materialType', 'MeshBasicMaterial')]({
    color: _.get(props, 'color', 'red')
  }) ))
  useWrapGroupNode(instanceRef.current, props, ref)
  return props.children
}

export default WithStore(React.forwardRef(Sphere), {
  name: 'Sphere'
});