import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../../core";
import { getGroupResolve } from "../../../core/resolveValue";
import usePromiseWrap from "../../../Hook/usePromiseWrap";

const Plane = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'Plane',
    f: getGroupResolve(() => new THREE[_.get(props, 'meshType', 'Mesh')](new THREE.PlaneGeometry(
      _.get(props, 'width', 1),
      _.get(props, 'height', 1),
      _.get(props, 'widthSegments', 1),
      _.get(props, 'heightSegments', 1),
    ), new THREE[_.get(props, 'materialType', 'MeshBasicMaterial')]({
    }))),
  })
  return props.children
}

export default WithStore(React.forwardRef(Plane), {
  name: 'Plane'
});