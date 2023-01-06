import _ from "lodash";
import React from "react";
import { WithStore } from "../../../core";
import { CSS3DObject as CSS3DObject2 } from "three/examples/jsm/renderers/CSS3DRenderer"
import { WrapCSSNode } from "../../../ProxyInstance";
import usePromiseWrap from "../../../Hook/usePromiseWrap";

const CSS3DObject = function (props, ref) {
  const configRef = usePromiseWrap(props, ref, {
    type: 'CSS3DObject',
  })

  return <div ref={(el) => {
    if (el) {
      const { current: { promiseWrap, ...rest } } = configRef;
      const node = new CSS3DObject2(el)
      promiseWrap.resolve(new WrapCSSNode(node, { promiseWrap, ...rest})) // ?
    }
  }}>
    {props.children}
  </div>
}

export default WithStore(React.forwardRef(CSS3DObject), {
  name: 'CSS3DObject'
});