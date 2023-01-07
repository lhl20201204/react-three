import _ from "lodash"
import React from "react"
import _constant from "../../constant"
import { WrapMaterialNode } from "../../ProxyInstance"
import FindAttr from "./FindAttr"
export default React.forwardRef((props, ref) => {
  return (<FindAttr
    ref={ref}
    cb={(node, config) => new WrapMaterialNode(_.get(node, 'material'), config)}
    {..._.omit(props, ['children'])}
  >
    {props.children}
  </FindAttr>
  )
})