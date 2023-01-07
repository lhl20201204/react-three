import _ from "lodash";
import React, { useEffect, useRef } from "react";
import _constant from "../constant";
import { getStore } from "../core/store";
import PromiseWrap from "../ProxyInstance/PromiseWrap";

const store = getStore()

export default function usePromiseWrap(props, ref, config) {
  const promiseWrapRef = useRef(null)
  const configRef = useRef({
    ...config,
    promiseWrap: promiseWrapRef.current || ((() => {
      promiseWrapRef.current = new PromiseWrap(config)
      return promiseWrapRef.current
    })()),
  })
  useEffect(() => {
    const { promiseWrap } = configRef.current
    const { promise, resolve, reject } = promiseWrap
    const { type, f, onPreLoad, onParentLoad, onChildrenLoad, onSiblingLoad } = config;
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
        resolve(typeof f === 'function' ? f(configRef.current) : f)
      }

      if (onPreLoad) {
        store.pushDevFn(onPreLoad({ resolve, reject, promise }, configRef.current))
      }

      if (onParentLoad) {
        promiseWrap.parentPromise
          .then(p => p.promise)
          .then(onParentLoad({ resolve, reject, promise }, configRef.current))
      }

      for (const { onload, attr } of [{
        onload: onChildrenLoad,
        attr: 'childrenPromise',
      }, {
        onload: onSiblingLoad,
        attr: 'siblingPromise',
      }]) {
        if (onload) {
          const { cb, filter } = onload({ resolve, reject, promise }, configRef.current)
          if (!cb) {
            throw new Error('返回的对象必须要有cb属性')
          }
          promiseWrap[attr]
            .then(x => Promise.all((filter ? x.filter(filter) : x).map(x => x.promise)))
            .then(cb)
        }
      }

    }
    promise.then(() => {
      promiseWrap.updateProps(_.omit(props, _constant.propsOmit))
    })
  }, [])
  return configRef
}