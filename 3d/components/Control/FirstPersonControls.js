import _ from "lodash";
import React from "react";
import { WithStore } from "../../core";
import { PointerLockControls as FirstPersonControls2 } from 'three/examples/jsm/controls/PointerLockControls';
import usePromiseWrap from "../../Hook/usePromiseWrap";
import _constant from "../../constant";
import { FirstPersonControlNode, WrapSelfNode } from "../../ProxyInstance";
import { getStore } from "../../core/store";

const store = getStore()
const FirstPersonControls = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'FirstPersonControls',
    onSiblingLoad: ({ resolve }, config) => ({
      filter: x => !_constant.controlList.includes(x.type),
      cb: (res) => {
        const scene = _.get(_.find(res, x => _constant.sceneList.includes(x.type)), 'node')
        let camera = _.get(_.find(res, x => _constant.cameraList.includes(x.type)), 'node')
        const renderers = _.map(_.filter(res, x => _constant.rendererList.includes(x.type)), x => _.get(x, 'node'))
        const renderer = _.find(renderers, x => x.domElement.style.pointerEvents !== 'none')
        if (props.targetId) {
          camera = (store.promiseWrapList.find(x => x?.props?.uid === props.targetId)).wrap
        }
        if (!camera || !renderers?.length || !renderer) {
          throw new Error('<Container/>必须有 camera 和 pointerEvents不为none的renderer')
        }
        const control = new FirstPersonControls2(camera, renderer.domElement)
        const ret = new FirstPersonControlNode({
          scene,
          control,
          camera,
        }, config)
        resolve(new WrapSelfNode(ret, config))
        ret.addEvent(props)
      }
    }),
    onDestroy(pw) {
      pw.node.removeEvent(props)
    }
  })
  return props.children
}

export default WithStore(React.forwardRef(FirstPersonControls), {
  name: 'FirstPersonControls'
});