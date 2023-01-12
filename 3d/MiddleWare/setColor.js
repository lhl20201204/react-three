import _constant from "../constant"
import * as THREE from 'three';
import _ from "lodash";

export default (type) => (next) => function (_this, attr, v) {
  if (_constant.colorAttrList.includes(attr)) {
    Reflect.set(_.get(_this, type), attr, new THREE.Color(v))
  } else {
    next(...arguments)
  }
}