import * as THREE from 'three'

export class Stride { // 先通过代理挂给元素， 后续改成proxy挂
  constructor(pw) {
    this.pw = pw;
    this.distVec = 0;
    this.targetVecNorm = new THREE.Vector3();
    this.desVec3 = new THREE.Vector3()
  }

  _setDes(x, y, z) {
    let desVec3 = x instanceof THREE.Vector3 ? x : new THREE.Vector3(x, y, z);
    let oriVec3 = new THREE.Vector3(this.pw.x, this.pw.y, this.pw.z);
    this.distVec = desVec3.distanceTo(oriVec3)
    this.desVec3 = desVec3;
    this.targetVecNorm = new THREE.Vector3().subVectors(desVec3, oriVec3).normalize();
  }

  moveForward(step) {
    if (this.distVec > 0) {
      this.distVec = Math.max(0, this.distVec - step);
      if (this.distVec === 0) {
        this.pw.group.position.copy(this.desVec3)
      } else {
        this.pw.group.translateOnAxis(this.targetVecNorm, step);
      }
    }
  }
}