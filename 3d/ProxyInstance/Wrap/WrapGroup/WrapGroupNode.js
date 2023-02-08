import _ from "lodash"
import _constant from "../../../constant"
import { getStride, getValue, setBox3, setColor, setResource, setValue, useMiddleWare } from "../../../MiddleWare"
import { Stride } from "../../Helper"
import PrimitiveWrap from "../PrimitiveWrap"
import * as THREE from 'three'
import { getNeedRaycasterChildren, multi } from "../../../Util"
window.THREE = THREE;

class WrapGroupNode extends PrimitiveWrap {
  constructor(wrap, config, option) {
    super(config)
    this.wrap = wrap
    this.child = _.get(wrap, 'children.0')
    this._setBox3()
    this.wrap.userData[_constant.__type__] = _.get(config, 'type') + _constant.__wrapFlag__
    this.wrap.userData[_constant.__proxy__] = this
    this._setRaycasterChildren()
    this._appendUserData(this.child)
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

  _appendUserData = (x, level = 0) => {
    if (x.userData[_constant.__isBox3__]) {
      return
    }
    x.userData[_constant.__stride__] = new Stride(this)
    x.userData[_constant.__type__] = this.type + (level ? '__' + level : '')
    x.userData[_constant.__proxy__] = this
    x.userData[_constant.__isHovering__] = false
    for (const c of x.children) {
      this._appendUserData(c, level + 1)
    }
  }

  _setRaycasterChildren = () => {
    this.wrap.userData[_constant.__needRaycasterChildren__] = getNeedRaycasterChildren(this.wrap)
  }

  _isCustomObject3d = (x) => !!x.userData?.[_constant.__type__]

  _setBox3 = (boxVisible = false) => {
    const unVisibleChildren = []
    for (const c of this.child.children) {
      if (this._isCustomObject3d(c) && c.children.some(x => (!x.visible || x.isCSS2DObject || x.isCSS3DObject ) && this._isCustomObject3d(x))) { 
        // 2d 跟3d 先暂时不算
        c.removeFromParent()
        unVisibleChildren.push(c)
      }
    }
    const box3 = new THREE.Box3().setFromObject(this.child, this._isModelType())
    for (const c of unVisibleChildren) {
      this.child.add(c)
    }
    const boxSizeVec3 = box3.getSize(new THREE.Vector3())
    const box = new THREE.Mesh(new THREE.BoxGeometry(boxSizeVec3.x, boxSizeVec3.y, boxSizeVec3.z), new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 'red'
    }))
    box.visible = boxVisible;
    box.userData[_constant.__isBox3__] = true
    this.box3 = box
    this.child.add(box)
    const childWorldPosition = this.child.getWorldPosition(new THREE.Vector3());
    box.scale.copy(new THREE.Vector3(1, 1, 1).divide( this.child.getWorldScale(new THREE.Vector3(1, 1, 1))))
    const boxWorldQuaternion = this.child.getWorldQuaternion(new THREE.Quaternion());
    const relativeWorldPosition = box3.getCenter(new THREE.Vector3()).sub(childWorldPosition)
    box.position.copy(relativeWorldPosition.multiply(box.scale).applyQuaternion(boxWorldQuaternion.invert()))
    box.quaternion.copy(boxWorldQuaternion)

    if (this._isModelType()) {
      console.log('uid:', this.props.uid,
        '点中心位置:', box3.getCenter(new THREE.Vector3()),
        '盒子全局位置:', box.getWorldPosition(new THREE.Vector3()),
      )
    }
    this._boxSizeVec3 = boxSizeVec3;
  }

  _changeBox3 = () => {
    this.box3.removeFromParent()
    this._setBox3(this.box3.visible)
  }

  _changeChild = (node) => {
    this.child.removeFromParent()
    this.wrap.add(node)
    this.child = node;
    this._appendUserData(this.child)
    this._changeBox3()
    this._setRaycasterChildren()
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