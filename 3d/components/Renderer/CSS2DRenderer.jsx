import _ from "lodash";
import React from "react";
import { WithStore } from "../../core";
import { CSS2DRenderer as CSS2DRenderer2 } from "three/examples/jsm/renderers/CSS2DRenderer"
import usePromiseWrap from "../../Hook/usePromiseWrap";
import { getResolve } from "../../core/resolveValue";

const CSS2DRenderer = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'CSS2DRenderer',
    f: getResolve(() => new CSS2DRenderer2(_.get(props, 'parameters', undefined)))
  })
  return props.children
}

export default WithStore(React.forwardRef(CSS2DRenderer), {
  name: 'CSS2DRenderer'
}) ;