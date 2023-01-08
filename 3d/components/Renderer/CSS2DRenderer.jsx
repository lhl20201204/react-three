import _ from "lodash";
import React from "react";
import { WithStore } from "../../core";
import { CSS2DRenderer as CSS2DRenderer2 } from "three/examples/jsm/renderers/CSS2DRenderer"
import usePromiseWrap from "../../Hook/usePromiseWrap";
import { getResolve } from "../../core/resolveValue";

const CSS2DRenderer = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'CSS2DRenderer',
    f: getResolve(() => {
      const renderer = new CSS2DRenderer2(_.get(props, 'parameters', undefined))
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

export default WithStore(React.forwardRef(CSS2DRenderer), {
  name: 'CSS2DRenderer'
});