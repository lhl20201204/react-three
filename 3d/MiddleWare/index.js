import setValue from "./setValue";
import setResource from "./setResource";
import setColor from "./setColor";
import getValue from "./getValue";
export function useMiddleWare(middleWare, fn) {
  return middleWare.reverse().reduce((p, v) => v(p), fn)
}

export {
  setValue,
  setResource,
  setColor,
  getValue
}