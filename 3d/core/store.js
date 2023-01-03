import _constant from "../constant"
import { getAst } from "./ast"
import { findNode } from "./findNode"

class Store {
  camera = null
  renderer = null
  scene = null
  isInWorld = false
  lastCountDicts = null
  lastNodeStack = null
  lastNameStack = null
  lastTree = null
  countDicts = {}
  nodeStack = []
  nameStack = []
  tree = {}

  setCamera(x) {
    this.camera = x
  }

  setRenderer(x) {
    this.renderer = x
  }

  setScene(x) {
    this.scene = x
  }

  updateCameraRendererScene() {
    this.setRenderer(_.map(findNode({ type: _constant.rendererList }, this.tree), x => _.get(x, _constant.node, {
      domElement: document.createElement('div'),
      setSize: () => { },
    })))
    this.setScene(_.map(findNode({ type: _constant.sceneList }, this.tree), x => _.get(x, _constant.node, {})))
    this.setCamera(_.map(findNode({ type: _constant.cameraList }, this.tree), x => _.get(x, _constant.node, {})))
  }

  getHandleResize = (dom) => {
    this.dom = dom
    return () => {
      for (const camera of this.camera) {
        camera.aspect = dom.clientWidth / dom.clientHeight;
        camera.updateProjectionMatrix();
      }

      for (const renderer of this.renderer) {
        renderer.setSize(dom.clientWidth, dom.clientHeight);
      }
    }
  }

  reset() {
    this.lastTree = this.tree
    this.tree = getAst(this.nameStack, this.nodeStack)
    this.lastNameStack = this.nameStack
    this.lastNodeStack = this.nodeStack
    this.lastCountDicts = this.countDicts
    this.nameStack = []
    this.nodeStack = []
    this.countDicts = {}
    this.isInWorld = false
  }

  pushNode(x) {
    this.nodeStack.push(x)
  }

  pushName(x) {
    this.nameStack.push(x)
  }

  getName(name) {
    return name + '_' + this.countDicts[name]
  }

  addCountDicts(name) {
    if (!_.has(this.countDicts, name)) {
      this.countDicts[name] = 1
    } else {
      if (['World', 'Scene'].includes(name)) {
        throw new Error(`只能有一个${name}实例`)
      }
      this.countDicts[name]++
    }
  }

  setIsInWorld(x) {
    this.isInWorld = x
  }

}

const store = new Store()

export function getStore() {
  return store
}