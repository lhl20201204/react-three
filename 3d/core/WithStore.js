import _ from "lodash"
import React, { useEffect, useRef } from "react"
import { getStore } from "./store"
import { patch } from "./patch"
const store = getStore();

export function WithStore(Comp, option) {
  if (!option || !option.name) {
    throw new Error('第二个参数配置必须传`name`属性')
  }
  return React.forwardRef((props, ref) => {
    const selfRef = useRef(null)
    const nameRef = useRef('')
    const currentRef = ref || selfRef

    if (option.name === 'World') {
      store.setIsInWorld(true)
    }
    if (store.isInWorld) {
      let name = option.name
      store.addCountDicts(name)
      nameRef.current = store.getName(name)
      store.pushName(nameRef.current)
    }

    if (currentRef.current) {
      currentRef.current?.updateProps?.(props)
    }

    useEffect(() => {
      if (store.isInWorld) {
        store.pushNode({
          type: option.name,
          name: nameRef.current,
          value: currentRef,
          ref: currentRef,
        })
      }

      if (option.name === 'World') {
        const isFirst = _.isNull(store.lastTree)
        store.reset()
        patch(isFirst)
      }

    })

    return <Comp {..._.omit(props, ['children'])} ref={currentRef}>
      {props.children}
    </Comp>;
  });
}