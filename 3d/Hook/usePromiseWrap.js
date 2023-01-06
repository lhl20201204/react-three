import _ from "lodash";
import React, { useEffect, useRef } from "react";
import _constant from "../constant";
import { getStore } from "../core/store";
import PromiseWrap from "../ProxyInstance/PromiseWrap";

const store = getStore()

export default function usePromiseWrap(props, ref, config) {
  const configRef = useRef({
    ...config,
    promiseWrap: new PromiseWrap(config),
  })
  useEffect(() => {
    const { promiseWrap } = configRef.current
    const { promise, resolve, reject } = promiseWrap
    const { type, f, onPreLoad, onParentLoad } = config;
    if (ref) {
      if (!type) {
        throw new Error('no type')
      }
      store.pushPromiseWrap(promiseWrap)

      if (props[_constant.funRef]) {
        props[_constant.funRef](promiseWrap)
      }

      ref.current = promiseWrap


      if (onParentLoad) {
        promiseWrap.parentPromise
          .then(p => p.promise)
          .then(onParentLoad({ resolve, reject, promise }, configRef.current))
      }

      if (f) {
        resolve(typeof f === 'function' ? f(configRef.current) : f)
      }
      if (onPreLoad) {
        store.pushDevFn(onPreLoad({ resolve, reject, promise }, configRef.current))
      }
    }
    (async () => {
      await promise;
      promiseWrap.updateProps(_.omit(props, _constant.propsOmit))
    })();
  }, [])
  return configRef
}