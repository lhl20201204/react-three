import _ from "lodash"
import * as THREE from 'three'
import _constant from "../constant"

const firstTo = (m) => (str) => {
  if (!str) {
    return ''
  }
  return str[0][m]() + str.slice(1)
}
export const firstToUppercase = firstTo('toUpperCase')

export const firstToLowercase = firstTo('toLowerCase')


export const mixColor = (arr1, arr2, r2) => {
  const r1 = 1 - r2
  const f = (i) => Math.floor((arr1[i]) * (r1) + (arr2[i]) * (r2))
  return `rgb(${f(0)},${f(1)},${f(2)})`
}

export const getScale = (x) => (
  {
    scaleX: x,
    scaleY: x,
    scaleZ: x,
  }
)

export const getRotation = (x) => (
  {
    rotationX: x,
    rotationY: x,
    rotationZ: x,
  }
)

export const getInnerRotation = (x) => (
  {
    innerRotationX: x,
    innerRotationY: x,
    innerRotationZ: x,
  }
)

export const getPosition = (ref, c) => {
  if (typeof ref === 'number') {
    return {
      x: ref,
      y: ref,
      z: ref,
    }
  }
  return {
    x: _.get(ref, 'current.x', c?.x ?? 0),
    y: _.get(ref, 'current.y', c?.y ?? 0),
    z: _.get(ref, 'current.z', c?.z ?? 0)
  }
}

export const getInnerPosition = (ref, c) => {
  if (typeof ref === 'number') {
    return {
      innerX: ref,
      innerY: ref,
      innerZ: ref,
    }
  }
  return {
    innerX: _.get(ref, 'current.innerX', c?.x ?? 0),
    innerY: _.get(ref, 'current.innerY', c?.y ?? 0),
    innerZ: _.get(ref, 'current.innerZ', c?.z ?? 0)
  }
}

export const getNeedRaycasterChildren = (obj) => {
  const ret = []
  obj.traverse((x) => {
    if (x.isScene
      || x?.userData?.[_constant.__isBox3__]
      || x?.userData?.[_constant.__type__]?.endsWith?.(_constant.__wrapFlag__)
    ) {
      return
    }
    ret.push(x)
  })
  return ret;
}

export const getWorldPointToLocalPosition = (object, vec3) => {
  if (!object instanceof THREE.Object3D) {
    return
  }
  const parent = object.parent;
  return vec3.sub(parent.getWorldPosition(new THREE.Vector3())).divide(parent.getWorldScale(new THREE.Vector3(1, 1, 1)))
}

export const multi = (v1, v2) => new THREE.Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
