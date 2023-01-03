import React, { useEffect, useRef } from "react";
import * as THREE from 'three'
import { WrapGroupNode } from "../ProxyInstance";
export default function useWrapGroupNode(node, props, ref) {
  useEffect(() => {
      if (ref) {
        const group = new THREE.Group()
        group.add(node);
        const instance = new WrapGroupNode(group, {
          ref
        })
        instance.updateProps(props)
        ref.current = instance
      }
  }, [])
}