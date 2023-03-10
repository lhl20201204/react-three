import _ from "lodash"
import React, { useEffect, useRef } from "react"
import { getStore } from "./store"
import { patch } from "./patch"
import _constant from "../constant";
const store = getStore();

export function WithStore(Comp, option) {
  if (!option || !option.name) {
    throw new Error('第二个参数配置必须传`name`属性')
  }
  return React.forwardRef((props, ref) => {
    const selfRef = useRef(null)
    const nameRef = useRef('')
    const isFnRef = typeof ref === 'function'
    const currentRef = (isFnRef || !ref) ? selfRef : ref

    if (option.name === 'World') {
      store.setIsInWorld(true)
    }
    if (store.isInWorld) {
      let name = option.name
      store.addCountDicts(name)
      nameRef.current = store.getName(name)
      store.pushName(nameRef.current)
    } else {
      throw new Error(`<${option.name}/>必须是<World > </World>的子组件, 暂不支持独立使用 或者 非含<World />顶层组件更新`)
    }

    if (currentRef.current) {
      currentRef.current?.updateProps?.(_.omit(props, _constant.propsOmit))
    }

    useEffect(() => {
      if (store.isInWorld) {
        store.pushNode({
          type: option.name,
          name: nameRef.current,
          value: currentRef,
        })
      }

      if (option.name === 'World') {
        const isFirst = _.isNull(store.lastTree)
        store.reset()
        patch(isFirst)
      }

    })

    return <Comp {..._.omit(props, ['children', _constant.funRef])} ref={currentRef} {
      ...isFnRef ? { [_constant.funRef]: ref } : {}
    }>
      {props.children}
    </Comp>;
  });
}