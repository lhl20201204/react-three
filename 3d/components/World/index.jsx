import _ from "lodash";
import React, { useEffect } from "react";
import { WithStore } from "../../core";
import './index.less'
import { getStore } from "../../core/store";
import { WorldNode, WrapSelfNode } from "../../ProxyInstance";
import usePromiseWrap from "../../Hook/usePromiseWrap";

const store = getStore()

function World(props, ref) {
  usePromiseWrap(props, ref, {
    type: 'World',
    f(config) {
      return new WrapSelfNode(new WorldNode({}, config), config)
    },
  })

  useEffect(() => {
    const fn = _.debounce(store.getHandleResize, 200, {
      leading: false,
      trailing: true,
    })
    window.addEventListener('resize', fn)
    return () => {
      window.removeEventListener('resize', fn)
      store.destroy()
    }
  }, [])

  return props.children
}
export default WithStore(React.forwardRef(World), {
  name: 'World'
})