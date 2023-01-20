import _ from "lodash"

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
  const f = (i) =>  Math.floor((arr1[i]) * (r1)+ (arr2[i]) * (r2))
  return `rgb(${f(0)},${f(1)},${f(2)})`
}

export const getScale = (x) => (
  {
    scaleX: x,
    scaleY: x,
    scaleZ: x,
  }
)

export const getPosition  = (ref, c) => {
  return {
    x: _.get(ref, 'current.x', c?.x ?? 0),
    y: _.get(ref, 'current.y', c?.y ?? 0),
    z: _.get(ref, 'current.z', c?.z ?? 0)
  }
}