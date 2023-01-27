import _constant from "../constant"
import _ from "lodash";
import { firstToLowercase } from "../Util";

export default (type) => (next) => function (_this, attr, v) {
  if (_constant.box3AttrList.includes(attr)) {
    Reflect.set(_.get(_this, type), firstToLowercase(attr.slice(3)), v)
  } else {
    next(...arguments)
  }
}