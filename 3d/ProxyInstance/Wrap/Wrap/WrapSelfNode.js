import _ from "lodash"
import WrapNode from "./WrapNode"
import _constant from "../../../constant"

class WrapSelfNode extends WrapNode {
  constructor(node, config, option) {
    super(node, config, {
      ...option,
      noColorMiddleWare: true
    })
  }
}

export default WrapSelfNode