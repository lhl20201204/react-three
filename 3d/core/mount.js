import _ from "lodash";
import _constant from "../constant";
import { findNode } from "./findNode";
import { _render } from "./render";
import { getStore } from "./store";
import { traverseAstNode } from "./traverseAstNode";
const store = getStore()

export function mount() {
  store.mountedPromiseResolve()
  const dom = _.get(store, 'tree.value.current', document.createElement('div'))
    ; (async () => {
      store.watchDevList.map(({ cb, filter }) => {
        if (typeof cb !== 'function') {
          throw new Error('cb 必须是函数')
        }
        if (filter && typeof filter !== 'function') {
          throw new Error(' 如果传了filter 其必须是函数')
        }
        const promiseWrapList = store.promiseWrapList.filter(filter || (() => true))
        Promise.all(promiseWrapList.map(x => x.promise)).then(res => {
          cb(res, promiseWrapList)
        })
      })
      await store.updateCameraRendererScene()
      const sceneItems = findNode({ type: _constant.sceneList }, store.tree);
      for (const sceneItem of sceneItems) {
        traverseAstNode(sceneItem)
      }

      const aspect = dom.clientWidth / dom.clientHeight

      for (const camera of store.camera) {
        camera.aspect = aspect
      }

      for (const renderer of store.renderer) {
        renderer.setSize(dom.clientWidth, dom.clientHeight);
        renderer.setPixelRatio?.(window.devicePixelRatio);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0px';
        dom.appendChild(renderer.domElement);
      }
      _render()
    })();
}