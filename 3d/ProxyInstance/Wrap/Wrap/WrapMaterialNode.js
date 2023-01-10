import _ from "lodash"
import * as THREE from "three"
import _constant from "../../../constant"
import { getStore } from "../../../core/store"
import WrapNode from "./WrapNode"
const store = getStore()

class WrapMaterialNode extends WrapNode {
  constructor(node, config) {
    super(node, config, {
      selfAttr: Reflect.ownKeys(WrapMaterialNode.prototype),
      change(_this, attr, v) {
        let value = v;
        if (attr === 'color') {
          value = new THREE.Color(v)
        } else if (attr === 'map'){
          value = store.resourceMap[v]
          if (!value) {
            throw new Error('资源必须先预加载')
          }
        } 
        Reflect.set(_this, attr, value)
      }
    })
  }
}

export default WrapMaterialNode