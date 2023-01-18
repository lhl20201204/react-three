import _ from "lodash";
import React, { useEffect } from "react";
import * as THREE from 'three';
import _constant from "../../constant";
import { WithStore } from "../../core";
import usePromiseWrap from "../../Hook/usePromiseWrap";
import { WrapSelfNode } from "../../ProxyInstance";
import { RaycasterNode } from "../../ProxyInstance";

const Raycaster = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'Raycaster',
    onSiblingLoad({ resolve }, config) {
      return {
        filter: (x) => [..._constant.cameraList, ..._constant.sceneList].includes(x.type),
        cb: (res) => {
          const raycaster = new THREE.Raycaster(
            _.get(props, 'origin'),
            _.get(props, 'direction'),
            _.get(props, 'near'),
            _.get(props, 'far'),
          )
          resolve(new WrapSelfNode(new RaycasterNode(raycaster, { ...config, res }), config))
        }
      }
    }
  })

  useEffect(() => {
    ref.current?.promise.then(() => {
      ref.current.addEvent(props)
    })
    return () => {
      ref.current?.promise.then(() => {
        ref.current.removeEvent(props)
      })
    }
  }, _constant.eventList.map(x => props[x]))

  return props.children
}

export default WithStore(React.forwardRef(Raycaster), {
  name: 'Raycaster'
});