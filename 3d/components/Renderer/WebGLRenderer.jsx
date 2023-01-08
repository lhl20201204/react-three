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
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0px';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      if (_.get(props, 'pointerEvents')) {
        renderer.domElement.style.pointerEvents = _.get(props, 'pointerEvents');
      }
      document.body.appendChild(renderer.domElement);
      return renderer
    })
  })
  return props.children
}

export default WithStore(React.forwardRef(WebGLRenderer), {
  name: 'WebGLRenderer'
}) ;