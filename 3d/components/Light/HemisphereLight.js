import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getGroupResolve } from "../../core/resolveValue";
import usePromiseWrap from "../../Hook/usePromiseWrap";

const HemisphereLight = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'HemisphereLight',
    f: getGroupResolve(() => new THREE.HemisphereLight(
      _.get(props, 'skyColor', '#fff'),
      _.get(props, 'groundColor', '#444'),
      _.get(props, 'intensity', 1)
    ))
  })
  return props.children
}

export default WithStore(React.forwardRef(HemisphereLight), {
  name: 'HemisphereLight'
});