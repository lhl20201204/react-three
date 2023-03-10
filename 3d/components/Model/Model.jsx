import _ from "lodash";
import React, { useEffect, useRef } from "react";
import * as THREE from 'three';
import { WithStore } from "../../core";
import { getStore } from "../../core/store";
import usePromiseWrap from "../../Hook/usePromiseWrap";
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { ModelNode, WrapModelNode } from "../../ProxyInstance";
const store = getStore();

const getSize = (model) => new THREE.Box3().setFromObject(model, true).getSize(new THREE.Vector3())

const Model = function (props, ref) {
  const actionsRef = useRef([])
  const actionRef = useRef({})
  const configRef = usePromiseWrap(props, ref, {
    type: 'Model',
    f: (config) => {
      const src = _.get(props, 'src') || ''
      const object = store.resourceMap[src]
      if (!object) {
        throw new Error('资源必须先预加载')
      }
      const group = new THREE.Group()
      const model = SkeletonUtils.clone(object.scene || object);
   
      const mixer = new THREE.AnimationMixer(model);
      const onAnimationsLoad = _.get(props, 'onAnimationsLoad');
      const animations = _.get(props, 'animations') || {}
      let i = 0; 
      for (const aname in animations) {
        const obj = store.resourceMap[animations[aname]]
        if (!obj) {
          throw new Error('资源必须先预加载')
        }
        object.animations.push(...obj.animations.map((x, j) => ({
          ...x,
          name: aname + (j ? j : '')
        })))
      }
      object.animations = (onAnimationsLoad?.(object.animations)) || object.animations;
      const actions = []
      const selectedAction = _.get(props, 'action', 0)
      for (const ca of object.animations) {
        const action = mixer.clipAction(ca);
        actions.push({
          i,
          name: ca.name,
          action,
        });
        if ([i, ca.name].includes(selectedAction)) {
          actionRef.current = action;
        }
        i++;
      }
      actionsRef.current = actions;
      const instance = new ModelNode({ model, mixer, actions }, config)
      group.add(model)
      const ret = new WrapModelNode(group, { ...config, instance })
      store.pushModel(ret)
      return ret;
    },
    onDestroy(promiseWrap) {
      if (!store.deleteModel(promiseWrap?.$value)) {
        throw new Error('删除失败')
      }
      actionsRef.current = []
      actionRef.current?.stop?.()
    }
  })

  useEffect(() => {
    const seletedAction = props.action
    if (!_.isNil(seletedAction)) {
      const lsa = actionRef.current
      lsa.stop?.()
      for (const { i, name, action } of actionsRef.current) {
        if ([i, name].includes(seletedAction)) {
          actionRef.current = action;
          action.play()
          const pw = configRef.current.promiseWrap
          pw._changeBox3?.() // 待解决
        }
      }
    }
  }, [props.action])

  return props.children
}

export default WithStore(React.forwardRef(Model), {
  name: 'Model'
});