import _ from "lodash"
import React from "react"
import FindAttr from "./FindAttr"
export default React.forwardRef((props, ref) => {
  return <FindAttr ref={ref} attr={'material'} {..._.omit(props, ['children'])}>
    {props.children}
  </FindAttr>
})