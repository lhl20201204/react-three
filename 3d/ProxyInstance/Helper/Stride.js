import * as THREE from 'three'
import { getWorldPointToLocalPosition } from '../../Util';

export class Stride { // 先通过代理proxy挂,后续改成继承
  constructor(pw) {
    this.pw = pw;
    this.distVec = 0;
    this.targetVecNorm = new THREE.Vector3();
    this.desVec3 = new THREE.Vector3()
  }

  _setDestinationVec3 = (x, y, z) => {
    let desVec3 = x instanceof THREE.Vector3 ? x : new THREE.Vector3(x??0, y??0, z??0);
    desVec3 = getWorldPointToLocalPosition(this.pw.wrap, desVec3)
    let oriVec3 = new THREE.Vector3(this.pw.x, this.pw.y, this.pw.z);
    this.distVec = desVec3.distanceTo(oriVec3)
    this.desVec3 = desVec3;
    this.targetVecNorm = new THREE.Vector3().subVectors(desVec3, oriVec3).normalize();
  }

  goToLookAt = (step) => {
    if (this.distVec > 0) {
      this.distVec = Math.max(0, this.distVec - step);
      if (this.distVec === 0) {
        this.pw.wrap.position.copy(this.desVec3)
      } else {
        this.pw.wrap.translateOnAxis(this.targetVecNorm, step);
      }
    }
  }
}