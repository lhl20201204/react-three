import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getGroupResolve } from "../../core/resolveValue";
import usePromiseWrap from "../../Hook/usePromiseWrap";

const AxesHelper = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'AxesHelper',
    f: getGroupResolve(() => new THREE.AxesHelper(
      _.get(props, 'size', 5)
    ))
  })
  return props.children
}

export default WithStore(React.forwardRef(AxesHelper), {
  name: 'AxesHelper'
});