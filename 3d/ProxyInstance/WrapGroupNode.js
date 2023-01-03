import _ from "lodash"
import ProxyParent from "./ProxyParent"

class WrapGroupNode extends ProxyParent{
  constructor(group, config) {
    super(config)
    this.type = _.get(group, 'children.0.type')
    this.group = group
    this.child = _.get(group, 'children.0')
    this.proxyData()
  }

}

export default WrapGroupNode