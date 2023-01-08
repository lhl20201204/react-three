import _ from "lodash";
import React, { useEffect } from "react";
import * as THREE from 'three';
import _constant from "../../constant";
import { WithStore } from "../../core";
import usePromiseWrap from "../../Hook/usePromiseWrap";
import { Wrap } from "../../ProxyInstance";
import RaycasterNode from "../../ProxyInstance/RaycasterNode";

const Raycaster = function (props, ref) {
  usePromiseWrap(props, ref, {
    type: 'Raycaster',
    onSiblingLoad({ resolve, promise }, config) {
      return {
        filter: (x) => [..._constant.cameraList, ..._constant.sceneList].includes(x.type),
        cb: (res) => {
          const raycaster = new THREE.Raycaster(
            _.get(props, 'origin'),
            _.get(props, 'direction'),
            _.get(props, 'near'),
            _.get(props, 'far'),
          )
          resolve(new Wrap(new RaycasterNode(raycaster, { res, promise }), config))
        }
      }
    },
  })

  useEffect(() => {
    let mouse = new THREE.Vector2();
    const handle = event => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
      ref.current?.checkTouchElement(mouse)
    }
    window.addEventListener('click', handle, false);
    return () => {
      window.removeEventListener('click', handle, false);
      mouse = null
    }
  }, [])

  return props.children
}

export default WithStore(React.forwardRef(Raycaster), {
  name: 'Raycaster'
});