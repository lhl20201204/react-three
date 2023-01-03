import _ from "lodash"
import PrimitiveParent from "./PrimitiveParent"
import * as THREE from "three"
import _constant from "../constant"

class WrapMaterialNode extends PrimitiveParent {
  constructor(node, config) {
    super(config)
    this.type = _.get(node, 'type')
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

  onParentMounted(parentAstItem) {
    const parentNode = _.get(parentAstItem, _constant.node, _.get(parentAstItem, _constant.child))
    const attr = this.attrType
    this.resolve(_.get(parentNode, attr))
  }
}

export default WrapMaterialNode