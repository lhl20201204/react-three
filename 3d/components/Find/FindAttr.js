import _ from "lodash";
import React from "react";
import _constant from "../../constant";
import { WithStore } from "../../core";
import { _render } from "../../core/render";
import usePromiseWrap from "../../Hook/usePromiseWrap";
import { PrimitiveWrap } from "../../ProxyInstance";

const FindAttr = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'FindAttr',
    onParentLoad({resolve}, config) {
      return (res) => {
        const node = props.customize ? res : _.get(res, 'node', _.get(res, 'child')) 
        if (!_.has(props, 'cb')){
          throw new Error(`必须传cb`)
        }
        const cb = props.cb
        if (typeof cb !== 'function') {
          throw new Error('cb 属性必须是函数')
        }
        const ret = cb(node, config)
        if (!(ret instanceof PrimitiveWrap)) {
          throw new Error('返回值必须 instanceof PrimitiveWrap')
        }
        resolve(ret)
      }
    }
  })
  return props.children
}

export default WithStore(React.forwardRef(FindAttr), {
  name: 'FindAttr'
});

