import * as THREE from "three"
import _constant from "../constant"
export function rewritePrototype() {
  const originLookAt = THREE.Object3D.prototype.lookAt
  THREE.Object3D.prototype.lookAt = function (...args) {
    this.userData?.[_constant.__stride__]?._setDes?.(...args)
    originLookAt.call(this, ...args)
  }
}