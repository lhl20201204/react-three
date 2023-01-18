import _constant from "../constant";
import { traverseAstNode } from "./traverseAstNode";
import { findNode } from "./findNode";
import { _render } from "./render";
import { getStore } from "./store";

const store = getStore()

export function update() {
  ; (async () => {
    console.log('update', store.tree)
    await store.updateContainer()
    const sceneItems = findNode({ type: _constant.sceneList }, store.tree);

    for(const scene of store.scene) {
      if (scene?.children) { // 先不考虑算法patch之类的，全部刷新
        scene.children = []
      }
    }
    for(const sceneItem of sceneItems) {
       traverseAstNode(sceneItem)
    }
    await store.runPromiseWrapList()
    requestAnimationFrame(_render)
  })();
}