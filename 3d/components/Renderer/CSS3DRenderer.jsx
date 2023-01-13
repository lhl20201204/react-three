import _ from "lodash";
import React from "react";
import { WithStore } from "../../core";
import { CSS3DRenderer as CSS3DRenderer2 } from "three/examples/jsm/renderers/CSS3DRenderer"
import usePromiseWrap from "../../Hook/usePromiseWrap";
import { getResolve } from "../../core/resolveValue";
const CSS3DRenderer = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'CSS3DRenderer',
    f: getResolve(() => {
      const renderer = new CSS3DRenderer2(_.get(props, 'parameters', undefined))
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
  }),
  onDestroy(promiseWrap) {
    const renderer =  promiseWrap.node;
    document.body.removeChild(renderer.domElement);
  }
  })
  return props.children
}

export default WithStore(React.forwardRef(CSS3DRenderer), {
  name: 'CSS3DRenderer'
}) ;