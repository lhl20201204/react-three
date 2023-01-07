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
    onSiblingLoad: ({ resolve }, config) => ({
      cb: (res) => {
        const camera= _.get(_.find(res, x => _constant.cameraList.includes(x.type)), 'node')
        const renderer= _.get(_.find(res, x => _constant.rendererList.includes(x.type)), 'node')
        if (!camera || !renderer) {
          throw new Error('同一层级必须有camera和renderer')
        }
        const control = new TrackballControls2(camera,renderer.domElement)
        resolve(new WrapNode(control, config))
      }
    })
  })
  return props.children
}

export default WithStore(React.forwardRef(TrackballControls), {
  name: 'TrackballControls'
});