import _ from "lodash";
import React from "react";
import { WithStore } from "../../core";
import usePromiseWrap from "../../Hook/usePromiseWrap";
import { ContainerNode, WrapSelfNode } from "../../ProxyInstance";

const Container = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'Container',
    onChildrenLoad({ resolve }, config) {
      return {
        cb: (res) => {
          resolve(new WrapSelfNode(new ContainerNode(res, config), config))
        }
      }
    },
  })
  return props.children
}

export default WithStore(React.forwardRef(Container), {
  name: 'Container'
});