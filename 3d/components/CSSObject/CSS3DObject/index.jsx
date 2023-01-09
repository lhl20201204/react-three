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
  })

  return <div ref={(els) => {
    if (els && firstRef.current) {
      firstRef.current = false;
      const { current: { promiseWrap, ...rest } } = configRef;
      const el = els.childNodes[0]
      el.style.pointerEvents = 'auto';
      el.style.cursor = 'pointer';
      const node = new CSS3DObject2(el)
      const group = new THREE.Group()
      group.add(node)
      promiseWrap.resolve(new WrapCSSNode(group, { promiseWrap, ...rest})) // ?
    }
  }}>
    {props.children}
  </div>
}

export default WithStore(React.forwardRef(CSS3DObject), {
  name: 'CSS3DObject'
});