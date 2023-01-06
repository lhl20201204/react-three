import _ from "lodash";
import React, { useRef } from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { OrbitControls as OrbitControls2 } from 'three/examples/jsm/controls/OrbitControls.js';
import usePromiseWrap from "../../Hook/usePromiseWrap";
import _constant from "../../constant";
import { WrapNode } from "../../ProxyInstance";

const OrbitControls = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'OrbitControls',
    onPreLoad: ({ resolve }, config) => ({
      filter: (x) => [..._constant.rendererList, ..._constant.cameraList].includes(x.type),
      cb: (res) => {
        console.log('promiseWrap', config.promiseWrap)
        const cameraList = _.filter(res, x => _constant.cameraList.includes(x.type)).sort((a, b) => b.level - a.level)
        const rendererList = _.filter(res, x => _constant.rendererList.includes(x.type)).sort((a, b) => a.level - b.level)
        const control = new OrbitControls2(cameraList[0].node, rendererList[0].node.domElement)
        resolve(new WrapNode(control, config))
      }
    })
  })
  return props.children
}

export default WithStore(React.forwardRef(OrbitControls), {
  name: 'OrbitControls'
});