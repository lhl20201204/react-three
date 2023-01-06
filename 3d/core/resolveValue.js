import * as THREE from "three"
import { WrapGroupNode, WrapNode } from "../ProxyInstance"
export function getGroupResolve(getNode) {
  return config => {
    const group = new THREE.Group()
    group.add(getNode({config, group}))
    return new WrapGroupNode(group, config)
  }
} 

export function getResolve(getNode) {
  return config => {
    return new WrapNode(getNode({config}), config)
  }
} 
