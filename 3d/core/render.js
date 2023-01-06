import _ from "lodash";
import _constant from "../constant";
import { getStore } from "./store";
const store = getStore()
export function _render() {
  const scene = store.scene[0]
  const camera = store.camera[0]
  for (const renderer of store.renderer) {
    renderer.render(scene, camera);
  }
  for (const control of store.control) {
    if (Array.isArray(control)) {
      for (const x of control) {
        x.update()
      }
    } else {
      control.update()
    }
  }
}