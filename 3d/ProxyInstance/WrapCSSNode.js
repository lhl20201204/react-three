import _ from "lodash"
import _constant from "../constant"
import PrimitiveParent from "./PrimitiveParent"

class WrapCSSNode extends PrimitiveParent {
  constructor(group, config) {
    super(config)
    this.group = group
    this.child = _.get(group, 'children.0')
    this.proxyData()
    const selfAttr = [
      ...Reflect.ownKeys(this),
      ...Reflect.ownKeys(PrimitiveParent.prototype),
    ]
    return new Proxy(this, {
      set(_this, attr, v) {
        if (selfAttr.includes(attr)) {
          _this[attr] = v
        } else {
          let value = v
          Reflect.set(_this.group, attr, value)
        }
        return true
      },
      get(_this, attr) {
        return selfAttr.includes(attr) ? _this[attr] : _this.group[attr]
      }
    })
  }
}

export default WrapCSSNode