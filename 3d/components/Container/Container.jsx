import _ from "lodash";
import React from "react";
import { WithStore } from "../../core";
import usePromiseWrap from "../../Hook/usePromiseWrap";
import { Controller } from "../../ProxyInstance";
import WrapContainerNode from "../../ProxyInstance/WrapContainerNode";

const Container = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'Container',
    onChildrenLoad({ resolve }, config) {
      return {
        cb: (res) => {
          resolve(new WrapContainerNode(new Controller(res), config))
        }
      }
    },
  })
  return props.children
}

export default WithStore(React.forwardRef(Container), {
  name: 'Container'
});