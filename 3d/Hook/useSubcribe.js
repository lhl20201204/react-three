import React, { useEffect } from "react"
import { getStore } from "../core/store"
const store = getStore()
export function useSubcribe(props, promiseWrap) {
  useEffect(() => {
    let subscribe = props.subscribe || null
    let onUpdate = props.onUpdate || null
    let subscribeList = []
    if (subscribe) {
      if (!subscribe.cb) {
        throw new Error('subscribe 必须 要有cb属性')
      }
      let watch = subscribe.watch
      if (!watch) {
        subscribe.watch = []
      } else if (!Array.isArray(watch)) {
        subscribe.watch = [watch]
      }
      subscribe._owner = promiseWrap;
      store.pushSubScribe(subscribe)
      subscribeList.push(subscribe)
    }
    if (typeof onUpdate === 'function') {
      subscribe = {
        watch: [],
        cb: onUpdate,
        _owner: promiseWrap
      }
      store.pushSubScribe(subscribe)
      subscribeList.push(subscribe)
    }
    return () => {
      if ((subscribeList.length && subscribeList.some(x => !store.deleteSubScribe(x)))) {
        throw new Error('删除失败')
      }
      subscribe = null
      subscribeList = null
      promiseWrap = null
    }
  }, [props.onUpdate, props.subscribe])
}