import _constant from "../constant"
export default (type) => function (_this, attr, v) {
  const obj = _.get(_this, type)
  if (typeof (Reflect.get(obj, attr)) === 'function') {
    obj[attr](v)
  } else {
    Reflect.set(obj, attr, v)
  }
}