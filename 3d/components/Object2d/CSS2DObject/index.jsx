import _ from "lodash";
import React, { useRef } from "react";
import * as THREE from 'three';
import { WithStore } from "../../../core";
import useWrapGroupNode from '../../../Hook/useWrapGroupNode'
import { CSS2DObject as Css2DObject } from "three/examples/jsm/renderers/CSS2DRenderer"
import useFindWrap from "../../../Hook/useFindWrap";
import usePromise from "../../../Hook/usePromise";
const CSS2DObject = function (props, ref) {
  const obj = usePromise()
  useFindWrap({
    type: 'CSS2DObject',
    attrType: 'CSS2DObject',
  }, props, ref, {
    ...obj,
  })

  return <div ref={(el)=> {
    if (el) {
      obj.resolveRef.current(new Css2DObject(el))
    }
  }}>
    {props.children}
  </div>
}

export default WithStore(React.forwardRef(CSS2DObject), {
  name: 'CSS2DObject'
});