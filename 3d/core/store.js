import _constant from "../constant"
import { getAst } from "./ast"
import { findNode } from "./findNode"
import * as THREE from "three";
import PromiseWrap from "../ProxyInstance/PromiseWrap";


class Store {
  mountedPromiseResolve = null
  mountedPromise = new Promise(resolve => {
    this.mountedPromiseResolve = resolve
  })
  loadingManager = new THREE.LoadingManager()
  textureLoader = new THREE.TextureLoader(this.loadingManager)
  setTextureLoader = this.textureLoader.setCrossOrigin('Anonymous')
  watchDevList = []
  resourceMap = {}
  promiseWrapList = []
  camera = null
  renderer = null
  scene = null
  control = null
  isInWorld = false
  lastCountDicts = null
  lastNodeStack = null
  lastNameStack = null
  lastTree = null
  countDicts = {}
  nodeStack = []
  nameStack = []
  tree = {}

  pushDevFn(devConfig) {
    this.watchDevList.push(devConfig)
  }

  pushPromiseWrap(p) {
    if (!(p instanceof PromiseWrap)) {
      throw new Error('必须是PromiseWrap的实例')
    }
    this.promiseWrapList.push(p)
  }

  async runPromiseWrapList() {
    return Promise.all(this.promiseWrapList.map(x => x.promise))
  }

  setCamera = (x) => {
    this.camera = x
  }

  setRenderer = (x) => {
    this.renderer = x
  }

  setScene = (x) => {
    this.scene = x
  }

  setControl = (x) => {
    this.control = x;
  }

  async setNode(type, fn) {
    const wrapList = await Promise.all(_.map(findNode({ type }, this.tree), x => _.get(x, _constant.promise, {})))
    fn(wrapList.sort((a, b) => b.level - a.level).map(x => x.node))
  }

  async updateCameraRendererScene() {
    return Promise.all([
      [_constant.sceneList, this.setScene],
      [_constant.cameraList, this.setCamera],
      [_constant.rendererList, this.setRenderer],
      [_constant.controlList, this.setControl],
    ].map(x => this.setNode(x[0], x[1])))
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

      for (const control of this.control) {
        control.update()
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
      if (['World'].includes(name)) {
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