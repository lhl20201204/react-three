import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../../core";
import { getGroupResolve } from "../../../core/resolveValue";
import usePromiseWrap from "../../../Hook/usePromiseWrap";
const Sphere = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'Sphere',
    f: getGroupResolve(() => new THREE[_.get(props, 'meshType', 'Mesh')](new THREE.SphereGeometry(
      _.get(props, 'radius', 1),
      _.get(props, 'widthSegments', 32),
      _.get(props, 'heightSegments', 16),
      _.get(props, 'phiStart', 0),
      _.get(props, 'phiLength', Math.PI * 2),
      _.get(props, 'thetaStart', 0),
      _.get(props, 'thetaLength', Math.PI),
    ), new THREE[_.get(props, 'materialType', 'MeshBasicMaterial')]()))
  })
  return props.children
}

export default WithStore(React.forwardRef(Sphere), {
  name: 'Sphere'
});