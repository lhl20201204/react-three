import _ from "lodash"
import _constant from "../constant"

export function traverseAstNode(nodeRef) { 
   for(const childRef of nodeRef.children) {
      const onParentMounted = _.get(childRef, _constant.onParentMounted)
      if(onParentMounted) {
          onParentMounted.call(childRef.value.current, nodeRef);
      }
      traverseAstNode(childRef)
   }
}