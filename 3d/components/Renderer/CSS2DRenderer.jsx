import _ from "lodash";
import React from "react";
import { WithStore } from "../../core";
import { CSS2DRenderer as CSS2DRenderer2 } from "three/examples/jsm/renderers/CSS2DRenderer"
import usePromiseWrap from "../../Hook/usePromiseWrap";
import { getResolve } from "../../core/resolveValue";
import { getStore } from "../../core/store";
const store = getStore()

const CSS2DRenderer = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'CSS2DRenderer',
    f: getResolve(() => {
      const dom = store.domElement
      const renderer = new CSS2DRenderer2(_.get(props, 'parameters', undefined))
      renderer.setSize(dom.clientWidth, dom.clientHeight);
      renderer.setPixelRatio?.(window.devicePixelRatio);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0px';
      dom.appendChild(renderer.domElement);
      return renderer
    })
  })
  return props.children
}

export default WithStore(React.forwardRef(CSS2DRenderer), {
  name: 'CSS2DRenderer'
});