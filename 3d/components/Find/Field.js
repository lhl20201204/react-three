import _ from "lodash"
import React from "react"
import _constant from "../../constant"
import { WrapNode } from "../../ProxyInstance"
import FindAttr from "./FindAttr"

export default React.forwardRef((props, ref) => {
  return (<FindAttr
    ref={ref}
    cb={(node, config) => new WrapNode(_.get(node, _.get(props, 'field')), config, _.get(props, 'option'))}
    {..._.omit(props, ['children', 'field', 'option'])}
  >
    {props.children}
  </FindAttr>
  )
})