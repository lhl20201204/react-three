import _ from "lodash";
import _constant from "../constant";
import { getStore } from "./store";
const store = getStore()
export function _render() {
  for(const container of store.container) {
    container.render()
  }
}