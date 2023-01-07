import _ from "lodash"
import PrimitiveParent from "./PrimitiveParent"

class WrapContainerNode extends PrimitiveParent{
  constructor(node, config) {
    super(config)
    this.node = node
    const selfAttr = [...Reflect.ownKeys(this), ...Reflect.ownKeys(PrimitiveParent.prototype)]
    return new Proxy(this, {
      set(_this, attr, v) {
        if (selfAttr.includes(attr)) {
          _this[attr] = v
        } else {
          let value = v
          if (attr === 'color') {
            value = new THREE.Color(v)
          } else if (attr === 'map'){
            value = store.resourceMap[v]
          } 
          Reflect.set(_this.node, attr, value)
        }
        return true
      },
      get(_this, attr) {
        return selfAttr.includes(attr) ? _this[attr] : Reflect.get(_this.node, attr)
      }
    })
  }
}

export default WrapContainerNode