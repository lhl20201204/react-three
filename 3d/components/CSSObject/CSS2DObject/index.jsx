import _ from "lodash";
import React from "react";
import { WithStore } from "../../../core";
import { CSS2DObject as Css2DObject } from "three/examples/jsm/renderers/CSS2DRenderer"
import { WrapCSSNode } from "../../../ProxyInstance";
import usePromiseWrap from "../../../Hook/usePromiseWrap";

const CSS2DObject = function (props, ref) {
  const promiseWrapRef = usePromiseWrap(props, ref, {
    type: 'CSS2DObject',
  })

  return <div ref={(el) => {
    if (el) {
      const { current: { promiseWrap, ...rest } } = promiseWrapRef;
      const node = new Css2DObject(el)
      promiseWrap.resolve(new WrapCSSNode(node, { promiseWrap, ...rest}))
    }
  }}>
    {props.children}
  </div>
}

export default WithStore(React.forwardRef(CSS2DObject), {
  name: 'CSS2DObject'
});