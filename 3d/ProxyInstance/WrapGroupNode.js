import _ from "lodash"
import PrimitiveParent from "./PrimitiveParent"

class WrapGroupNode extends PrimitiveParent{
  constructor(group, config) {
    super(config)
    this.group = group
    this.child = _.get(group, 'children.0')
    this.proxyData()
  }

}

export default WrapGroupNode