import _ from "lodash"
import React from "react"
import _constant from "../../constant"
import { WrapNode } from "../../ProxyInstance"
import FindAttr from "./FindAttr"

export default React.forwardRef((props, ref) => {
  return (<FindAttr
    ref={ref}
    cb={(node, config) => {
      const value = _.get(node, _.get(props, 'field'))
      if (typeof value !== 'object') {
        throw new Error(`其父节点上属性为【${_.get(props, 'field')}】 获取的值必须是对象，但是获得${typeof value}类型`)
      }
      return new WrapNode(value, config, {
        ..._.get(props, 'option', {}),
        noRegisterAttr: true
      })
    }}
    {..._.omit(props, ['children', 'field', 'option'])}
  >
    {props.children}
  </FindAttr>
  )
})