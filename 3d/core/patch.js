import { update } from "./update";
import { mount } from "./mount";

export function patch(isFirst) {
  if(isFirst){
    mount()
  }else{
    update()
  }
}