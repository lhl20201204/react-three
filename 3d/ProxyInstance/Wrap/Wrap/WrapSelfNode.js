import _ from "lodash"
import WrapNode from "./WrapNode"

class WrapSelfNode extends WrapNode{
  constructor(node, config, option) {
    super(node, config, {...option, noRegisterAttr: true})
  }
}

export default WrapSelfNode