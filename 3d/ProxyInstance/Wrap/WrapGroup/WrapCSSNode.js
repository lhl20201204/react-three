import _ from "lodash"
import _constant from "../../../constant"
import WrapGroupNode from "./WrapGroupNode"

class WrapCSSNode extends WrapGroupNode {
  constructor(group, config) {
    super(group, config, {
      selfAttr: Reflect.ownKeys(WrapCSSNode.prototype),
      change(_this, attr, v) {
        if (Reflect.has(_this.child, attr)) {
          Reflect.set(_this.child, attr, v)
        } else {
          Reflect.set(_this.child.userData, attr, v)
        }
      },
      require(_this, attr) {
        return _this.child[attr]
      }
    })
  }
}

export default WrapCSSNode