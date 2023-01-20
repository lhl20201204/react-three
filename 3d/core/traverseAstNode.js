import _ from "lodash"
import _constant from "../constant"

export function traverseAstNode(parentAstItem) { 
   for(const childAstItem of parentAstItem.children) {
      const onParentMounted = _.get(childAstItem, _constant.onParentMounted)
      if(onParentMounted) {
          onParentMounted.call(childAstItem.value.current, parentAstItem);
      }
      traverseAstNode(childAstItem)
   }
}