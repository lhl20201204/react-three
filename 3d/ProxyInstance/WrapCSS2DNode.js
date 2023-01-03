import _ from "lodash"
import _constant from "../constant"
import PrimitiveParent from "./PrimitiveParent"
import ProxyParent from "./ProxyParent"

class WrapCSS2DNode extends ProxyParent {
  constructor(node, config) {
    super(config)
    this.type = _.get(node, 'type')
    this.node = node
    this.proxyData([['node', '']])
    const selfAttr = [
      ...Reflect.ownKeys(this),
      ...Reflect.ownKeys(PrimitiveParent.prototype),
      ...Reflect.ownKeys(ProxyParent.prototype),
    ]
    return new Proxy(this, {
      set(_this, attr, v) {
        if (selfAttr.includes(attr)) {
          _this[attr] = v
        } else {
          let value = v
          Reflect.set(_this.node, attr, value)
        }
        return true
      },
      get(_this, attr) {
        return selfAttr.includes(attr) ? _this[attr] : Reflect.get(_this.node, attr)
      }
    })
  }

  onParentMounted(parentAstItem) {
    (async () => {
      const parentNode = _.get(parentAstItem, _constant.node, _.get(parentAstItem, _constant.child))
      const child = await this.promise
      if (child && parentNode) {
        parentNode.add(child)
      }
    })()
  }
}

export default WrapCSS2DNode