import _ from "lodash";
import React from "react";
import { WithStore } from "../../core";
import { OrbitControls as OrbitControls2 } from 'three/examples/jsm/controls/OrbitControls.js';
import usePromiseWrap from "../../Hook/usePromiseWrap";
import _constant from "../../constant";
import { WrapNode } from "../../ProxyInstance";

const OrbitControls = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'OrbitControls',
    onSiblingLoad: ({ resolve }, config) => ({
      cb: (res) => {
        const camera= _.get(_.find(res, x => _constant.cameraList.includes(x.type)), 'node')
        const renderer= _.get(_.find(res, x => _constant.rendererList.includes(x.type)), 'node')
        if (!camera || !renderer) {
          throw new Error('同一层级必须有camera和renderer')
        }
        const control = new OrbitControls2(camera,renderer.domElement)
        resolve(new WrapNode(control, config))
      }
    })
  })
  return props.children
}

export default WithStore(React.forwardRef(OrbitControls), {
  name: 'OrbitControls'
});