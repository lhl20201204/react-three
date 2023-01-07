import _ from "lodash";
import React from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getResolve } from "../../core/resolveValue";
import { getStore } from "../../core/store";
import usePromiseWrap from "../../Hook/usePromiseWrap";
const store = getStore()

const WebGLRenderer = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'WebGLRenderer',
    f: getResolve(() => {
      const dom = store.domElement
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(dom.clientWidth, dom.clientHeight);
      renderer.setPixelRatio?.(window.devicePixelRatio);
      // renderer.domElement.style.position = 'absolute';
      // renderer.domElement.style.top = '0px';
      dom.appendChild(renderer.domElement);
      return renderer
    })
  })
  return props.children
}

export default WithStore(React.forwardRef(WebGLRenderer), {
  name: 'WebGLRenderer'
}) ;