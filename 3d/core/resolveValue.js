import * as THREE from "three"
import { WrapGroupNode, WrapNode } from "../ProxyInstance"
export function getGroupResolve(getNode, option) {
  return config => {
    const group = new THREE.Group()
    group.add(getNode({config, group}))
    return new WrapGroupNode(group, config, option)
  }
} 

export function getResolve(getNode, option) {
  return config => {
    return new WrapNode(getNode({config}), config, option)
  }
} 
