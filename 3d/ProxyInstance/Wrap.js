import _ from "lodash"
import PrimitiveParent from "./PrimitiveParent"

class Wrap extends PrimitiveParent{
  constructor(node, config) {
    super(config)
    this.node = node
    const selfAttr = [
      ...Reflect.ownKeys(this),
      ...Reflect.ownKeys(PrimitiveParent.prototype),
    ]
    return new Proxy(this, {
      set(_this, attr, v) {
        if (selfAttr.includes(attr)) {
          _this[attr] = v
        } else {
          Reflect.set(_this.node, attr, v)
        }
        return true
      },
      get(_this, attr) {
        return selfAttr.includes(attr) ? _this[attr] : _this.node[attr]
      }
    })
  }

}

export default Wrap