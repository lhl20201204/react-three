import _ from "lodash"
import PrimitiveParent from "./PrimitiveParent"

class WrapNode extends PrimitiveParent{
  constructor(node, config) {
    super(config)
    this.node = node
    this.proxyData([['node', '']])
  }

}

export default WrapNode