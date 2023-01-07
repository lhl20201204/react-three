import _ from "lodash";
import React, { useEffect } from "react";
import { WithStore } from "../../core";
import './index.less'
import { getStore } from "../../core/store";

const store = getStore()

function World(props, ref) {
  useEffect(() => {
    const fn = _.debounce(store.getHandleResize(ref.current), 200, {
      leading: false,
      trailing: true,
    })
    window.addEventListener('resize', fn)
    return () => {
      window.removeEventListener('resize', fn)
    }
  }, [])

  return <div ref={(el) => {
    store.setDomElement(el)
    ref.current = el
  }} className={'ThreeCanvasWrap'} >
    {props.children}
  </div>
}
export default WithStore(React.forwardRef(World), {
  name: 'World'
})