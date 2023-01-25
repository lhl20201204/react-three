import _ from "lodash"
import _constant from "../../../constant"
import { setColor, setValue, useMiddleWare } from "../../../MiddleWare"
import PrimitiveWrap from "../PrimitiveWrap"
import * as THREE from 'three'

class WrapNode extends PrimitiveWrap {
  constructor(node, config, option) {
    super(config)
    this.node = node
    if (!node.userData) {
      node.userData = {}
    }
    this.node.userData[_constant.__type__] = _.get(config, 'type')
    this.node.userData[_constant.__proxy__] = this

    if (node instanceof THREE.Object3D) {
      this.proxyData([['node', '']])
    }
    const selfAttr = _.uniq([
      ...Reflect.ownKeys(this),
      ...Reflect.ownKeys(PrimitiveWrap.prototype),
      ..._.get(option, 'selfAttr', []),
      ..._constant.excludeAttrList,
    ])

    const attrList = _.uniq([...(option?.attrList ? option.attrList : []),
      ...(!option || !option.noColorMiddleWare) ? _constant.colorAttrList : []
    ])
    const defaultSetMiddleWare = [
      ...(!option || !option.noColorMiddleWare) ? [setColor('node')] : [],
    ]
    const change = useMiddleWare([...((option && option.setMiddleWare) ? option.setMiddleWare : []), ...defaultSetMiddleWare], setValue('node'))

    return new Proxy(this, {
      set(_this, attr, v) {
        if (selfAttr.includes(attr)) {
          _this[attr] = v
        } else {
          if (!Reflect.has(_this.node, attr) && !attrList.includes(attr)) {
            Reflect.set(_this.node.userData, attr, v)
          } else {
            change(_this, attr, v)
          }
        }
        return true
      },
      get(_this, attr) {
        return selfAttr.includes(attr) ? _this[attr] : _this.node[attr]
      }
    })
  }

}

export default WrapNode