import _ from "lodash"
import { useEffect } from "react"
import { _render } from "../core/render"
import { getStore } from "../core/store"
const store = getStore()

export function useLoop(fn, dev=[], option={}) {
  useEffect(() => {
    let raf = null
    let runFn = null
    let clock = store.clock
    try {
      const step = (t = 0) => {
        fn({ clock, t })
        _render()
        raf = window.requestAnimationFrame(runFn)
      }
      const step2 = (t = 0) => {
        fn({ clock, t })
        raf = window.requestAnimationFrame(runFn)
      }

      const step3 = (t = 0) => {
        fn({ clock, t })
        _render()
        if (t <= option.time) {
          raf = window.requestAnimationFrame(runFn)
        }
      }

      const step4 = (t = 0) => {
        fn({ clock, t })
        if (t <= option.time) {
          raf = window.requestAnimationFrame(runFn)
        }
      }
      runFn = step
      if (option) {
        if (option.time) {
          if (!option.noRender) {
            runFn = step3
          } else {
            runFn = step4
          }
        } else {
          if (option.noRender) {
            runFn = step2
          }
        }
      }
      (async () => {
         await store.mountedPromise
         await store.runPromiseWrapList()
         raf = window.requestAnimationFrame(runFn)
      })()
    } catch (e) {
      console.error(e)
    }

    return () => {
      raf && window.cancelAnimationFrame(raf)
      clock = null
      runFn = null
    }
  }, dev)
}