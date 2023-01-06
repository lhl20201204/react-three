import _ from "lodash";
import React, { useEffect } from "react";
import { WithStore } from "../../core";
import { Scene } from "../Scene";
import { CSS2DRenderer, CSS3DRenderer, WebGLRenderer } from '../Renderer'
import { PerspectiveCamera } from "../Camera";
import './index.less'
import AmbientLight from "../Light/AmbientLight";
import { getStore } from "../../core/store";

const store = getStore()

function World(props, ref) {
  useEffect(() => {
    const fn = _.debounce(store.getHandleResize(ref.current), 200, {
      leading: false,
      trailing: true,
    })
    window.addEventListener('resize', fn)
    return () => {
      window.removeEventListener('resize', fn)
    }
  }, [])

  return <div ref={ref} className={'ThreeCanvasWrap'} >
    <Scene>
      <AmbientLight></AmbientLight>
      {props.children}
    </Scene>
    <CSS3DRenderer />
    <WebGLRenderer />
    <CSS2DRenderer />
    <PerspectiveCamera />
  </div>
}
export default WithStore(React.forwardRef(World), {
  name: 'World'
})