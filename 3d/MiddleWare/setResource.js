import _ from "lodash"
import _constant from "../constant"
import { getStore } from "../core/store"
const store = getStore()

export default (type) => (next) => function (_this, attr, v) {
  if (_constant.mapAttrList.includes(attr)) {
    Reflect.set(_.get(_this, type), attr, store.resourceMap[v])
  } else {
    next(...arguments)
  }
}