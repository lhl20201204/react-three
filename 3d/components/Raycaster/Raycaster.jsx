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
    },
  })

  useEffect(() => {
    let mouse = new THREE.Vector2();
    const getHandle = (methodName) => event => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
      ref.current?.[methodName](mouse)
    }
    let handle = getHandle('checkClickTouchElement')
    let handle2 = getHandle('checkDbClickTouchElemnt')
    window.addEventListener('click', handle, false);
    window.addEventListener('dblclick', handle2, false)
    return () => {
      window.removeEventListener('click', handle, false);
      window.removeEventListener('dblclick', handle2, false)
      mouse = null
      handle = null
      handle2 = null
    }
  }, [])

  return props.children
}

export default WithStore(React.forwardRef(Raycaster), {
  name: 'Raycaster'
});