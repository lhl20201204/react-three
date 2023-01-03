import _ from "lodash";
import React from "react";
import _constant from "../../constant";
import { WithStore } from "../../core";
import useFindWrap from "../../Hook/useFindWrap";

const FindAttr = function (props, ref) {
  useFindWrap({ 
    type: 'FindAttr',
    attrType: _.get(props, _constant.findAttr)}, props, ref)
  return props.children
}

export default WithStore(React.forwardRef(FindAttr), {
  name: 'FindAttr'
});

