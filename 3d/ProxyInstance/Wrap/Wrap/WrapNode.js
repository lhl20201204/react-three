import _ from "lodash"
import PrimitiveWrap from "../PrimitiveWrap"

class WrapNode extends PrimitiveWrap{
  constructor(node, config, option) {
    super(config)
    this.node = node
    this.proxyData([['node', '']])
    const selfAttr = [
      ...Reflect.ownKeys(this),
      ...Reflect.ownKeys(PrimitiveWrap.prototype),
      ..._.get(option, 'selfAttr', [])
    ]
    const change = option?.change
    // 大量运行，减少判断次数，提高性能
    const ret = change ? new Proxy(this, {
      set(_this, attr, v) {
        if (selfAttr.includes(attr)) {
          _this[attr] = v
        } else {
          change(_this.node, attr, v)
        }
        return true
      },
      get(_this, attr) {
        return selfAttr.includes(attr) ? _this[attr] : _this.node[attr]
      }
    }) : new Proxy(this, {
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
    return ret
  }

}

export default WrapNode