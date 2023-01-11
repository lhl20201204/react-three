import _constant from "../constant"
import { getAst } from "./ast"
import { findNode } from "./findNode"
import * as THREE from "three";
import PromiseWrap from "../ProxyInstance/PromiseWrap";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Store {
  mountedPromiseResolve = null
  mountedPromise = new Promise(resolve => {
    this.mountedPromiseResolve = resolve
  })
  clock = new THREE.Clock()
  loadingManager = new THREE.LoadingManager()
  textureLoader = new THREE.TextureLoader(this.loadingManager)
  cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager)
  fbxLoader = new FBXLoader(this.loadingManager)
  gltfLoader = new GLTFLoader(this.loadingManager)
  _setTextureLoader = [this.textureLoader, this.cubeTextureLoader].map(
    x => x.setCrossOrigin('Anonymous')
  )
  modelList = []
  watchDevList = []
  resourceMap = {}
  promiseWrapList = []
  camera = null
  renderer = null
  scene = null
  control = null
  container = null
  domElement = null
  isInWorld = false
  lastCountDicts = null
  lastNodeStack = null
  lastNameStack = null
  lastTree = null
  countDicts = {}
  nodeStack = []
  nameStack = []
  tree = {}

  setDomElement(x) {
    this.domElement = x;
  }

  pushDevFn(devConfig) {
    this.watchDevList.push(devConfig)
  }

  pushModel(model) {
    this.modelList.push(model)
  }

  deleteModel(model) {
    const len = this.modelList.length;
    for (let i = 0; i < len; i++) {
      if (this.modelList[i] === model) {
        this.modelList.splice(i, 1)
        return true
      }
    }
    return false
  }

  runWatchDevList() {
    this.watchDevList.map(({ cb, filter }) => {
      if (typeof cb !== 'function') {
        throw new Error('cb 必须是函数')
      }
      if (filter && typeof filter !== 'function') {
        throw new Error(' 如果传了filter 其必须是函数')
      }
      const promiseWrapList = filter ? this.promiseWrapList.filter(filter) : this.promiseWrapList
      Promise.all(promiseWrapList.map(x => x.promise)).then(res => {
        cb(res, promiseWrapList)
      })
    })
  }

  pushPromiseWrap(p) {
    if (!(p instanceof PromiseWrap)) {
      throw new Error('必须是PromiseWrap的实例')
    }
    this.promiseWrapList.push(p)
  }

  deletePromiseWrap(p) {
    const len = this.promiseWrapList.length;
    for (let i = 0; i < len; i++) {
      const cur = this.promiseWrapList[i]
      if ([cur, cur.pid].includes(p)) {
        this.promiseWrapList.splice(i, 1)
        return true
      }
    }
    return false
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

  setContainer = (x) => {
    this.container = x;
  }

  async setNode(type, fn) {
    const wrapList = await Promise.all(_.map(findNode({ type }, this.tree), x => _.get(x, _constant.promise, {})))
    fn(wrapList.sort((a, b) => b.level - a.level).map(x => x.node))
  }

  async updateContainer() {
    return Promise.all([
      [_constant.containerList, this.setContainer],
      [_constant.sceneList, this.setScene],
      [_constant.cameraList, this.setCamera],
      [_constant.rendererList, this.setRenderer],
      [_constant.controlList, this.setControl],
    ].map(x => this.setNode(x[0], x[1])))
  }

  getHandleResize = () => {
    for (const camera of this.camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }

    for (const renderer of this.renderer) {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    for (const control of this.control) {
      control.update()
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