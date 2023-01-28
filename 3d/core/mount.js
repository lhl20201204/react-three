import _ from "lodash";
import _constant from "../constant";
import { getNeedRaycasterChildren } from "../Util";
import { findNode } from "./findNode";
import { _render } from "./render";
import { getStore } from "./store";
import { traverseAstNode } from "./traverseAstNode";
const store = getStore()

export function mount() {
  try {
    store.mountedPromiseResolve()
      ; (async () => {
        store.runWatchDevList()
        await store.updateContainer()
        const sceneItems = findNode({ type: _constant.sceneList }, store.tree);
        for (const sceneItem of sceneItems) {
          traverseAstNode(sceneItem)
          const scene = _.get(sceneItem, _constant.node)
          scene.userData[_constant.__needRaycasterChildren__] = getNeedRaycasterChildren(scene)
        }
        await store.runPromiseWrapList()
        requestAnimationFrame(_render)
      })();
  } catch (e) {
    console.error(e)
  }
}