import _ from "lodash"
import PrimitiveWrap from "../PrimitiveWrap"

class WrapGroupNode extends PrimitiveWrap{
  constructor(group, config, option) {
    super(config)
    this.group = group
    this.child = _.get(group, 'children.0')
    this.child.userData.proxy = this
    this.child.userData.type = _.get(config, 'type')
    this.proxyData()
    const selfAttr = [
      ...Reflect.ownKeys(this),
      ...Reflect.ownKeys(PrimitiveWrap.prototype),
      ..._.get(option, 'selfAttr', [])
    ]
    const change = option?.change
    const require = option?.require

    const ret = (change && require) ? new Proxy(this, {
      set(_this, attr, v) {
        if (selfAttr.includes(attr)) {
          _this[attr] = v
        } else {
          change(_this, attr, v)
        }
        return true
      },
      get(_this, attr) {
        return selfAttr.includes(attr) ? _this[attr] : require(_this, attr)
      }
    }) : new Proxy(this, {
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
    return ret
  }

}

export default WrapGroupNode