import _ from "lodash"
import _constant from "../constant"
export default (type) => function (_this, attr) {
   return _.get(_this, type)[attr]
}