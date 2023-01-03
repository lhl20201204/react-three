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