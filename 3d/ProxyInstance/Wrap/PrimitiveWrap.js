import _constant from "../../constant";
import _ from "lodash"
import * as THREE from 'three';
import { firstToLowercase, firstToUppercase } from "../../Util"

let id = 0;
const exclude = _constant.excludeList;
export default class PrimitiveWrap {
  constructor(config) {
    this.pwId = id++
    if (!config.type || !config.promiseWrap || !config.props) {
      console.log(config)
      throw new Error('实例化失败')
    }
    this.promiseWrap = _.get(config, 'promiseWrap')
    this.type = _.get(config, 'type')
    this.props = _.get(config, 'props')
    this._level = -1
  }
  updateProps(props) {
    this.props = props
    for (const attr in props) {
      this[attr] = props[attr] ?? 0
    }
  }

  onParentMounted(parentAstItem) {
    const parentNode = _.get(parentAstItem, _constant.node, _.get(parentAstItem, _constant.child))
    const child = this.wrap || this.node
    if (exclude.includes(this.type)) {
      return
    }
    if (_constant.grandAddList.includes(this.type)) {
      const parentNode = _.get(parentAstItem, _constant.node, _.get(parentAstItem, _constant.wrap))
      if (child && parentNode?.parent) {
        parentNode.parent.add(child)
        return
      }
    }
    if (child && parentNode) {
      parentNode.add(child)
    }
  }

  onDestroyed() {
    const parent = this.child || this.node
    if (parent instanceof THREE.Object3D) {
      for (const child of parent.children) {
        if (child.userData?.[_constant.__type__]) {
          child.parent.remove(child)
        }
      }
    }
  }

  setLevel(x) {
    this._level = x;
  }

  proxyData(arr = [['wrap', ''], ['child', 'inner']]) {
    for (const [target, prefix] of arr) {
      for (const pAttr of ['position', 'rotation', 'scale']) {
        this.registerAttr(target, pAttr, prefix)
      }
    }
  }

  _isModelType = () => ['Model'].includes(this.type)

  registerAttr(target, pAttr, prefix) {
    for (const dim of ['x', 'y', 'z']) {
      const attr = firstToLowercase([prefix, pAttr === 'position' ? '' : pAttr, dim].map(x => firstToUppercase(x)).join(''))
      Object.defineProperty(this, attr, {
        set(v) {
          Reflect.set(this[target][pAttr], dim, v)
        },
        get() {
          return Reflect.get(this[target][pAttr], dim)
        }
      })
    }
  }

}