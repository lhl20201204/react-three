import _ from "lodash";
import _constant from "../constant";
import { findNode } from "./findNode";
import { _render } from "./render";
import { getStore } from "./store";
import { traverseAstNode } from "./traverseAstNode";
const store = getStore()

export function mount() { 
   const dom = _.get(store, 'tree.value.current', document.createElement('div'))
   store.updateCameraRendererScene()
   console.log('mount', store.tree)
  
   const sceneItem = findNode({ type: _constant.sceneList }, store.tree);
   traverseAstNode(sceneItem[0])

   const aspect = dom.clientWidth / dom.clientHeight
   for(const camera of store.camera) {
      camera.aspect = aspect
   }

   for(const renderer of store.renderer) {
       renderer.setSize(dom.clientWidth, dom.clientHeight); 
       renderer.domElement.style.position = 'absolute';
		 renderer.domElement.style.top = '0px';
       dom.appendChild(renderer.domElement);
       
   }
   _render()

}