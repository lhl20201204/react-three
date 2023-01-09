import _ from "lodash"
import PrimitiveParent from "./PrimitiveParent"

class WrapGroupNode extends PrimitiveParent{
  constructor(group, config) {
    super(config)
    this.group = group
    this.child = _.get(group, 'children.0')
    this.child.userData.proxy = this
    this.child.userData.type = _.get(config, 'type')
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
          Reflect.set(_this.child, attr, value)
        }
        return true
      },
      get(_this, attr) {
        return selfAttr.includes(attr) ? _this[attr] : _this.child[attr]
      }
    })
  }

}

export default WrapGroupNode