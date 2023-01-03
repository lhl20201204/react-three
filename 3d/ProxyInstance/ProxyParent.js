import _ from "lodash"
import { firstToLowercase, firstToUppercase } from "../Util"
import PrimitiveParent from "./PrimitiveParent";

export default class ProxyParent extends PrimitiveParent {

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