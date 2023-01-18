import _ from "lodash";
import _constant from "../constant";
import { getStore } from "./store";
const store = getStore()
export function _render() {
  for (const container of store.container) {
    container.render()
  }
  const dela = store.clock.getDelta()
  for (const model of store.modelList) {
    model.mixer.update(dela)
  }
  const time = { clock: store.clock }
  for(const subscribe of store.subscribeList) {
    subscribe.cb(time, subscribe._owner, subscribe.watch.map(uid => store.uidMap[uid]))
  }

  for(const raycaster of store.raycaster) {
    for(const m of raycaster._listenerMethodNameList) {
      requestAnimationFrame(() =>_.size(raycaster._mouse) && raycaster[m]())
    }
  }
}