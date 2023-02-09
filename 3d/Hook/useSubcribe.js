import React, { useEffect } from "react"
import _constant from "../constant"
import { getStore } from "../core/store"
import { hadIntersect } from "../Util"
const store = getStore()
export function useSubcribe(props, promiseWrap) {
  useEffect(() => {
    let subscribe = props.subscribe || null
    let onUpdate = props.onUpdate || null
    let intersectIDs = props.intersectIDs || null
    let onIntersect = props.onIntersect || null
    let subscribeList = []

    function pushSubScribe() {
      store.pushSubScribe(subscribe)
      subscribeList.push(subscribe)
    }
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
      pushSubScribe()
    }
    if (typeof onUpdate === 'function') {
      subscribe = {
        watch: [],
        cb: onUpdate,
        _owner: promiseWrap
      }
      pushSubScribe()
    }

    if (intersectIDs && onIntersect) {
      subscribe = {
        watch: intersectIDs,
        cb(a, _, list) {
          // let x = hadIntersect(a.box3, list.map(x => x.box3))
          const targetBox3 = a._getBox3()
          let Insections = []
          for(const obj of list) {
            const objBox3 = obj._getBox3()
            if(targetBox3.intersectsBox(objBox3)) {
              Insections.push(obj)
            }
          }
          if (!a.userData[_constant.__LastInsections__].length && Insections.length) {
            a.userData?.onIntersect?.(Insections)
          }else if (a.userData[_constant.__LastInsections__].length && !Insections.length) {
            a.userData?.outIntersect?.(Insections)
          }
          a.userData[_constant.__LastInsections__] = Insections;
        },
        _owner: promiseWrap
      }
      pushSubScribe()
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