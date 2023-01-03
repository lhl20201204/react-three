import React, { useEffect } from "react";
import { WrapNode } from "../ProxyInstance";
export default function useWrapNode(node, props, ref) {
  useEffect(() => {
      if (ref) {
        const instance = new WrapNode(node, {
          ref,
        })
        instance.updateProps(props)
        ref.current = instance
      }
  }, [])
}