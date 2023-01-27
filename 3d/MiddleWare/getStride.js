import _constant from "../constant"
import * as THREE from 'three';
import _ from "lodash";

export default (type) => (next) => function (_this, attr) {
  if (_constant.strideAttrList.includes(attr)) {
    return _.get(_this, type)[attr]
  } else {
    return next(...arguments)
  }
}