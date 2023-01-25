import _ from "lodash";
import React, { useRef } from "react";
import { WithStore } from "../../../core";
import { CSS3DObject as CSS3DObject2 } from "three/examples/jsm/renderers/CSS3DRenderer"
import { WrapCSSNode } from "../../../ProxyInstance";
import usePromiseWrap from "../../../Hook/usePromiseWrap";
import * as THREE from "three";

const CSS3DObject = function (props, ref) {
  const firstRef = useRef(true)
  const configRef = usePromiseWrap(props, ref, {
    type: 'CSS3DObject',
    onDestroy(pw) {
      pw.removeEvent()
    }
  })

  return <div style={{ display: 'none' }} ref={(els) => {
    if (els && firstRef.current) {
      firstRef.current = false;
      const { current: config } = configRef
      const { promiseWrap } = config;
      if (els.childNodes.length !== 1) {
        throw new Error('CSS3DObject有且只有一个子元素')
      }
      const oldEl = els.childNodes[0]
      const el = oldEl.cloneNode(true)
      el.style.pointerEvents = 'auto';
      el.style.cursor = 'pointer';
      const node = new CSS3DObject2(el)
      const group = new THREE.Group()
      group.add(node)
      const ret = new WrapCSSNode(group, { ...config, domEl: el, elProps: props })
      ret.addEvent()
      promiseWrap.resolve(ret)

    }
  }}>
    {props.children}
  </div>
}

export default WithStore(React.forwardRef(CSS3DObject), {
  name: 'CSS3DObject'
});