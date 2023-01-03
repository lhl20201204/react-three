import _constant from "../constant";
import { traverseAstNode } from "./traverseAstNode";
import { findNode } from "./findNode";
import { _render } from "./render";
import { getStore } from "./store";

const store = getStore()

export function update() {
  console.log('update', store.tree)
  store.updateCameraRendererScene()
  const sceneRef = findNode({ type: _constant.sceneList }, store.tree);
  const scene = store.scene[0]
  if (scene?.children) { // 先不考虑算法patch之类的，全部刷新
    scene.children = []
  }
  traverseAstNode(sceneRef[0])
  _render()
}