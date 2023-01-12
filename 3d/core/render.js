import _ from "lodash";
import _constant from "../constant";
import { getStore } from "./store";
const store = getStore()
export function _render() {
  try {
    for (const container of store.container) {
      container.render()
    }
    const dela = store.clock.getDelta()
    for (const model of store.modelList) {
      model.mixer.update(dela)
    }
  } catch (e) {
    console.error(e)
  }
}