import _ from "lodash"
import _constant from "../../../constant"
import { getValue, setColor, setResource, setValue, useMiddleWare } from "../../../MiddleWare"
import PrimitiveWrap from "../PrimitiveWrap"

class WrapGroupNode extends PrimitiveWrap {
  constructor(group, config, option) {
    super(config)
    this.group = group
    this.child = _.get(group, 'children.0')
    this.group.userData[_constant.__type__] = _.get(config, 'type') + '_of_Group'
    this.group.userData[_constant.__proxy__] = this
    this.child.userData[_constant.__type__] = _.get(config, 'type')
    this.child.userData[_constant.__proxy__] = this
    this.child.userData[_constant.__isHovering__] = false

    this.proxyData()
    const selfAttr = _.uniq([
      ...Reflect.ownKeys(this),
      ...Reflect.ownKeys(PrimitiveWrap.prototype),
      ..._.get(option, 'selfAttr', []),
      ..._constant.excludeAttrList,
    ])

    const attrList = _.uniq([...(option?.proxyAttrList ? option.proxyAttrList : []),
     ..._constant.colorAttrList,
     ..._constant.mapAttrList
    ])
    const defaultSetMiddleWare = [setColor('child.material'), setResource('child.material')]
    const defaultGetMiddleWare = []
   
    const change = useMiddleWare([...(option?.setMiddleWare ? option.setMiddleWare : []), ...defaultSetMiddleWare], setValue('child'))
    const require = useMiddleWare([...(option?.getMiddleWare ? option.getMiddleWare : []), ...defaultGetMiddleWare], getValue('child'))
    return new Proxy(this, {
      set(_this, attr, v) {
        if (selfAttr.includes(attr)) {
          _this[attr] = v
        } else {
          if ((!Reflect.has(_this.child, attr) && !Reflect.has(_this.group, attr)) && !attrList.includes(attr)) {
            Reflect.set(_this.child.userData, attr, v)
          } else {
            change(_this, attr, v)
          }
        }
        return true
      },
      get(_this, attr) {
        return selfAttr.includes(attr) ? _this[attr] : require(_this, attr)
      }
    })
  }

}

export default WrapGroupNode