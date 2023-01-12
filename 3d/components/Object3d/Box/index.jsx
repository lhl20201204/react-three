import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../../core";
import { getGroupResolve } from "../../../core/resolveValue";
import usePromiseWrap from "../../../Hook/usePromiseWrap";

const Box = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'Box',
    f: getGroupResolve(() => new THREE[_.get(props, 'meshType', 'Mesh')](new THREE.BoxGeometry(
      _.get(props, 'width', 1),
      _.get(props, 'height', 1),
      _.get(props, 'depth', 1),
      _.get(props, 'widthSegments', 1),
      _.get(props, 'heightSegments', 1),
      _.get(props, 'depthSegments', 1),
    ), new THREE[_.get(props, 'materialType', 'MeshBasicMaterial')]())),
  })
  return props.children
}

export default WithStore(React.forwardRef(Box), {
  name: 'Box'
});