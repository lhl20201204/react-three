import _constant from "../constant"
import * as THREE from 'three';
import _ from "lodash";

export default (type) => (next) => function (_this, attr) {
  if (_constant.strideAttrList.includes(attr)) {
    const obj = _.get(_this, type)
    return typeof obj[attr] === 'function' ? obj[attr].bind(obj) : obj[attr]
  } else {
    return next(...arguments)
  }
}