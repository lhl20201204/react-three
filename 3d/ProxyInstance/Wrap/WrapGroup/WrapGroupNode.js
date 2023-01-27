import _ from "lodash"
import _constant from "../../../constant"
import { getStride, getValue, setBox3, setColor, setResource, setValue, useMiddleWare } from "../../../MiddleWare"
import { Stride } from "../../Helper"
import PrimitiveWrap from "../PrimitiveWrap"
import * as THREE from 'three'
import { Vector3 } from "three"

class WrapGroupNode extends PrimitiveWrap {
  constructor(wrap, config, option) {
    super(config)
    this.wrap = wrap
    this.child = _.get(wrap, 'children.0')
    this._setBox3()
    this.wrap.userData[_constant.__type__] = _.get(config, 'type') + '_of_Wrap'
    this.wrap.userData[_constant.__proxy__] = this
    const appendUserData = (x) => {
      if (x.userData[_constant.__isBox3__]) {
        return
      }
      x.userData[_constant.__stride__] = new Stride(this)
      x.userData[_constant.__type__] = _.get(config, 'type')
      x.userData[_constant.__proxy__] = this
      x.userData[_constant.__isHovering__] = false
      for (const c of x.children) {
        appendUserData(c)
      }
    }
    appendUserData(this.child)
    this.proxyData()
    const selfAttr = _.uniq([
      ...Reflect.ownKeys(this),
      ...Reflect.ownKeys(PrimitiveWrap.prototype),
      ..._.get(option, 'selfAttr', []),
      ..._constant.excludeAttrList,
    ])

    const attrList = _.uniq([...(option?.proxyAttrList ? option.proxyAttrList : []),
    ..._constant.colorAttrList,
    ..._constant.mapAttrList,
    ..._constant.box3AttrList,
    ])
    const defaultSetMiddleWare = [setBox3('box3'), setColor('child.material'), setResource('child.material')]
    const defaultGetMiddleWare = [getStride('child.userData.' + _constant.__stride__)]

    const change = useMiddleWare([...(option?.setMiddleWare ? option.setMiddleWare : []), ...defaultSetMiddleWare], setValue('child'))
    const require = useMiddleWare([...(option?.getMiddleWare ? option.getMiddleWare : []), ...defaultGetMiddleWare], getValue('child'))
    return new Proxy(this, {
      set(_this, attr, v) {
        if (selfAttr.includes(attr)) {
          _this[attr] = v
        } else {
          if ((!Reflect.has(_this.child, attr) && !Reflect.has(_this.wrap, attr)) && !attrList.includes(attr)) {
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

  _setBox3 = (boxVisible = false) => {
    const boxVec3 = new THREE.Box3().setFromObject(this.child).getSize(new Vector3())
    const box = new THREE.Mesh(new THREE.BoxGeometry(boxVec3.x, boxVec3.y, boxVec3.z), new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 'red'
    }))
    if (['Model'].includes(this.type)) {
      box.position.y = this.child.position.y + boxVec3.y / 2
    }
    box.visible = boxVisible;
    box.userData[_constant.__isBox3__] = true
    this.box3 = box
    this.wrap.add(box)
  }

  _changeBox3 = () => {
    this.box3.removeFromParent()
    this._setBox3(this.box3.visible)
  }

  _changeChild = (node) => {
    this.child.removeFromParent()
    this.wrap.add(node)
    this.child = node;
  }

  lookAt = (...args) => {
    this.child.userData[_constant.__stride__]._setDestinationVec3(...args)
    this.child.lookAt(...args)
  }

  getWorldPosition = (...args) => {
    return this.child.getWorldPosition(...args)
  }

}

export default WrapGroupNode