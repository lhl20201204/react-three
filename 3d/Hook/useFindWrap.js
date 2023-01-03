import _ from "lodash";
import React, { useEffect } from "react";
import _constant from "../constant";
import { WrapCSS2DNode, WrapMaterialNode } from "../ProxyInstance";
const classDict = {
  material: WrapMaterialNode,
  CSS2DObject: WrapCSS2DNode
}
export default function useFindWrap(node, props, ref,
  config) {
  useEffect(() => {
    const {
      promiseRef,
      resolveRef,
      rejectRef,
    } = config || {}
    let resolve = _.get(resolveRef, 'current'),
      reject = _.get(rejectRef, 'current')
    const promise = _.get(promiseRef, 'current') || new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
    if (!_.has(node, 'attrType')) {
      throw new Error('no attrType')
    }
    const Ctor = classDict[node.attrType]
    const instance = new Ctor(node, {
      resolve,
      reject,
      promise,
      ref,
    })

    if (ref) {
      ref.current = instance
    }
    (async () => {
      instance.node = await instance.promise;
      instance.updateProps(_.omit(props, [_constant.findAttr]))
    })();
  }, [])
}