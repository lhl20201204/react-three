import setValue from "./setValue";
import setResource from "./setResource";
import setColor from "./setColor";
import setBox3 from "./setBox3";
import getValue from "./getValue";
import getStride from "./getStride";
export function useMiddleWare(middleWare, fn) {
  return middleWare.reverse().reduce((p, v) => v(p), fn)
}

export {
  setValue,
  setResource,
  setColor,
  setBox3,
  getValue,
  getStride,
}