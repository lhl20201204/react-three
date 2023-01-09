import _ from "lodash";
import React, { useEffect, useRef } from "react";
import { WithStore } from "../../../core";
import { CSS2DObject as Css2DObject } from "three/examples/jsm/renderers/CSS2DRenderer"
import { WrapCSSNode } from "../../../ProxyInstance";
import usePromiseWrap from "../../../Hook/usePromiseWrap";
import * as THREE from "three";

const CSS2DObject = function (props, ref) {
  const firstRef = useRef(true)
  const promiseWrapRef = usePromiseWrap(props, ref, {
    type: 'CSS2DObject',
  })


  return <div ref={(els) => {
    if (els && firstRef.current) {
      firstRef.current = false
      const { current: { promiseWrap, ...rest } } = promiseWrapRef;
      const el = els.childNodes[0]
      el.addEventListener('click', (x) => {
        console.log(x)
      })
      const node = new Css2DObject(el)
      const group = new THREE.Group()
      group.add(node)
      promiseWrap.resolve(new WrapCSSNode(group, { promiseWrap, ...rest}))
    }
  }}>
    {props.children}
  </div>
}

export default WithStore(React.forwardRef(CSS2DObject), {
  name: 'CSS2DObject'
});