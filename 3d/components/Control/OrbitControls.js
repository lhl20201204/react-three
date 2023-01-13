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
      filter: x => !_constant.controlList.includes(x.type),
      cb: (res) => {
        const camera = _.get(_.find(res, x => _constant.cameraList.includes(x.type)), 'node')
        const renderers = _.map(_.filter(res, x => _constant.rendererList.includes(x.type)), x => _.get(x, 'node'))
        const renderer = _.find(renderers, x => x.domElement.style.pointerEvents !== 'none')
        if (!camera || !renderers?.length || !renderer) {
          throw new Error('<Container/>必须有 camera 和 pointerEvents不为none的renderer')
        }
        const control = new OrbitControls2(camera, renderer.domElement)
        resolve(new WrapNode(control, config))
      }
    })
  })
  return props.children
}

export default WithStore(React.forwardRef(OrbitControls), {
  name: 'OrbitControls'
});