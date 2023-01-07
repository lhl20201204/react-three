import _ from "lodash";
import React from "react";
import { WithStore } from "../../core";
import { CSS3DRenderer as CSS3DRenderer2 } from "three/examples/jsm/renderers/CSS3DRenderer"
import usePromiseWrap from "../../Hook/usePromiseWrap";
import { getResolve } from "../../core/resolveValue";
import { getStore } from "../../core/store";
const store = getStore()

const CSS3DRenderer = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'CSS3DRenderer',
    f: getResolve(() => {
      const dom = store.domElement;
      const renderer = new CSS3DRenderer2(_.get(props, 'parameters', undefined))
      renderer.setSize(dom.clientWidth, dom.clientHeight);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0px';
      dom.appendChild(renderer.domElement);
      return renderer
  })
  })
  return props.children
}

export default WithStore(React.forwardRef(CSS3DRenderer), {
  name: 'CSS3DRenderer'
}) ;