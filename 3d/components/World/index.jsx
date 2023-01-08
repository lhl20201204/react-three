import _ from "lodash";
import React, { useEffect } from "react";
import { WithStore } from "../../core";
import './index.less'
import { getStore } from "../../core/store";
import { WorldNode, Wrap } from "../../ProxyInstance";
import usePromiseWrap from "../../Hook/usePromiseWrap";

const store = getStore()

function World(props, ref) {
  usePromiseWrap(props, ref, {
    type: 'World',
    f(config) {
      return new Wrap(new WorldNode(), config)
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
    }
  }, [])

  return props.children
}
export default WithStore(React.forwardRef(World), {
  name: 'World'
})