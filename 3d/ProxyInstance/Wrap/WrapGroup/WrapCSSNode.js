import _ from "lodash"
import _constant from "../../../constant"
import WrapGroupNode from "./WrapGroupNode"

class WrapCSSNode extends WrapGroupNode {
  constructor(group, config) {
    super(group, config, {
      selfAttr: Reflect.ownKeys(WrapCSSNode.prototype),
      change(_this, attr, v) {
        _this.child[attr] = v;
      },
      require(_this, attr) {
        return _this.child[attr]
      }
    })
  }
}

export default WrapCSSNode