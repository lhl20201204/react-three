import _ from "lodash";
import React, { useEffect, useRef } from "react";
import _constant from "../constant";
import { getStore } from "../core/store";
import { PrimitiveWrap, PromiseWrap } from "../ProxyInstance";

const store = getStore()

export default function usePromiseWrap(props, ref, config) {
  const promiseWrapRef = useRef(null)
  const configRef = useRef({
    ...config,
    props,
    promiseWrap: promiseWrapRef.current || ((() => {
      promiseWrapRef.current = new PromiseWrap(config)
      return promiseWrapRef.current
    })()),
  })
  useEffect(() => {
    const { promiseWrap } = configRef.current
    const { promise, resolve, reject } = promiseWrap
    const { type, f, onPreLoad, onParentLoad, onChildrenLoad, onSiblingLoad, onDestroy } = config;
    if (ref) {
      if (!type) {
        throw new Error('no type')
      }
      store.pushPromiseWrap(promiseWrap)

      if (props[_constant.funRef]) {
        props[_constant.funRef](promiseWrap)
      }

      ref.current = promiseWrap

      if (f) {
        const ret = typeof f === 'function' ? f(configRef.current) : f
        if (!(ret instanceof PrimitiveWrap)) {
          throw new Error('ret 必须 instanceof PrimitiveWrap')
        }
        resolve(ret)
      }

      if (onPreLoad) {
        store.pushDevFn(onPreLoad({ resolve, reject, promise }, configRef.current))
      }

      if (onParentLoad) {
        promiseWrap.parentPromise
          .then(p => p.promise)
          .then(onParentLoad({ resolve, reject, promise }, configRef.current))
          .catch(console.error)
      }

      for (const { onload, attr } of [{
        onload: onChildrenLoad,
        attr: 'childrenPromise',
      }, {
        onload: onSiblingLoad,
        attr: 'siblingPromise',
      }]) {
        if (onload) {
          try {
            const { cb, filter } = onload({ resolve, reject, promise }, configRef.current)
            if (!cb) {
              throw new Error('返回的对象必须要有cb属性')
            }
            promiseWrap[attr]
              .then(x => Promise.all((filter ? x.filter(filter) : x).map(x => x.promise)))
              .then(cb)
              .catch(console.error)
          } catch (e) {
            console.error(e)
          }
        }
      }

    }
    promise.then(() => {
      promiseWrap.updateProps(_.omit(props, _constant.propsOmit))
    })
    return () => {
      if (!store.deletePromiseWrap(promiseWrap)) {
        throw new Error('删除失败')
      }
      promiseWrap._removeFromParent()
      onDestroy?.(promiseWrap)
    }
  }, [])
  return configRef
}