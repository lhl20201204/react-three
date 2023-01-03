import _ from "lodash"
import ProxyParent from "./ProxyParent"

class WrapNode extends ProxyParent{
  constructor(node, config) {
    super(config)
    this.type = _.get(node, 'type')
    this.node = node
    this.proxyData([['node', '']])
  }

}

export default WrapNode