import _ from "lodash"
import _constant from "../../../constant"
import WrapGroupNode from "./WrapGroupNode"

class WrapCSSNode extends WrapGroupNode {
  constructor(group, config) {
    super(group, config, {
      selfAttr: [...Reflect.ownKeys(WrapCSSNode.prototype), '_domEl', '_elProps', '_handlerEventListener'],
    })
    this._domEl = config.domEl
    this._elProps = config.elProps
    this._handlerEventListener = []
    for (const attr in this._elProps) {
      if (attr.startsWith('on') && !['onUpdate', 'onLoad'].includes(attr)) {
        this._handlerEventListener.push({
          type: attr.slice(2).toLowerCase(),
          handler: (x) => {
            this._elProps[attr](x, this)
          }
        })
      }
    }
  }

  addEvent() {
    for (const { type, handler } of this._handlerEventListener) {
      this._domEl.addEventListener(type, handler)
    }
  }

  removeEvent() {
    for (const { type, handler } of this._handlerEventListener) {
      this._domEl.removeEventListener(type, handler)
    }
  }
}

export default WrapCSSNode