import _constant from "../../constant";
import _ from "lodash"
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
    this.level = -1
  }
  updateProps(props) {
    this.props = props
    for (const attr in props) {
      this[attr] = props[attr] ?? 0
    }
  }

  onParentMounted(parentAstItem) {
    const parentNode = _.get(parentAstItem, _constant.node, _.get(parentAstItem, _constant.child))
    const child = this.group || this.node
    if (exclude.includes(this.type)) {
      return
    }
    if (_constant.grandAddList.includes(this.type)) {
      const parentNode = _.get(parentAstItem, _constant.node, _.get(parentAstItem, _constant.group))
      if (child && parentNode?.parent) {
        parentNode.parent.add(child)
        return
      }
    }
    if (child && parentNode) {
      parentNode.add(child)
    }
  }

  setLevel(x) {
    this.level = x;
  }

  proxyData(arr = [['group', ''], ['child', 'inner']]) {
    for (const [target, prefix] of arr) {
      for (const pAttr of ['position', 'rotation', 'scale']) {
        this.registerAttr(target, pAttr, prefix)
      }
    }
  }

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