import _ from "lodash";
import React, { useRef } from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import useWrapNode from "../../Hook/useWrapNode";
import { CSS2DRenderer as Css2dRender } from "three/examples/jsm/renderers/CSS2DRenderer"

const CSS2DRenderer = function (props, ref) {
  const instanceRef = useRef(new Css2dRender(_.get(props, 'parameters', undefined)))
  useWrapNode(instanceRef.current, props, ref)
  return props.children
}

export default WithStore(React.forwardRef(CSS2DRenderer), {
  name: 'CSS2DRenderer'
}) ;