import _ from "lodash"
import _constant from "../../../constant"
import WrapGroupNode from "./WrapGroupNode"

class WrapModelNode extends WrapGroupNode {
  constructor(group, config) {
    super(group, config, {
      selfAttr: [...Reflect.ownKeys(WrapModelNode.prototype), 'instance'],
    })
    if (!config.instance) {
      throw new Error('不能没有instance属性')
    }
    this.instance = _.get(config, 'instance')
  }
}

export default WrapModelNode