import _ from "lodash"
import _constant from "../../../constant"
import WrapGroupNode from "./WrapGroupNode"

class WrapCSSNode extends WrapGroupNode {
  constructor(group, config) {
    super(group, config, {
      selfAttr: Reflect.ownKeys(WrapCSSNode.prototype),
    })
  }
}

export default WrapCSSNode