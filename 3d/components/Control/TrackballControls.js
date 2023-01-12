import _ from "lodash";
import React from "react";
import { WithStore } from "../../core";
import { TrackballControls as TrackballControls2 } from 'three/examples/jsm/controls/TrackballControls.js';
import usePromiseWrap from "../../Hook/usePromiseWrap";
import _constant from "../../constant";
import { WrapNode } from "../../ProxyInstance";

const TrackballControls = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'TrackballControls',
    onSiblingLoad: ({ resolve, reject }, config) => ({
      filter: x => !_constant.controlList.includes(x.type),
      cb: (res) => {
        try {
          const camera = _.get(_.find(res, x => _constant.cameraList.includes(x.type)), 'node')
          const renderers = _.map(_.filter(res, x => _constant.rendererList.includes(x.type)), x => _.get(x, 'node'))
          const renderer = _.find(renderers, x => x.domElement.style.pointerEvents !== 'none')
          if (!camera || !renderers?.length || !renderer) {
            throw new Error('<Container/>必须有 camera 和 pointerEvents不为none的renderer')
          }
          const control = new TrackballControls2(camera, renderer.domElement)
          resolve(new WrapNode(control, config))
        } catch (e) {
          console.error(e)
          reject(e)
        }
      }
    })
  })
  return props.children
}

export default WithStore(React.forwardRef(TrackballControls), {
  name: 'TrackballControls'
});