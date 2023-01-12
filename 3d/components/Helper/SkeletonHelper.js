
import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import usePromiseWrap from "../../Hook/usePromiseWrap";
import { WrapGroupNode } from "../../ProxyInstance";

const SkeletonHelper = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'SkeletonHelper',
    onParentLoad({resolve}, config) {
      return res => {
        const node = _.get(res, 'node', _.get(res, 'child'))
        const group = new THREE.Group() 
        group.add(new THREE.SkeletonHelper(node))
        resolve(new WrapGroupNode(group, config))
      }
    },
  })
  return props.children
}

export default WithStore(React.forwardRef(SkeletonHelper), {
  name: 'SkeletonHelper'
});