const findAttr = 'attr'
const funRef = '__funRef'
const containerList = ['Container']
const sceneList = ['Scene']
const cameraList = ['PerspectiveCamera']
const rendererList = ['WebGLRenderer', 'CSS2DRenderer', 'CSS3DRenderer']
const controlList = ['OrbitControls', 'TrackballControls']
const findAttrList = ['FindAttr']

const _constant = {
  cameraList,
  rendererList,
  sceneList,
  controlList,
  containerList,
  findAttrList,
  excludeList: [
    ...containerList,
    ...sceneList,
    ...cameraList,
    ...rendererList,
    ...controlList,
    ...findAttrList
  ],
  promise: 'value.current.promise',
  node: 'value.current.node',
  group: 'value.current.group',
  child: 'value.current.child',
  onParentMounted: 'value.current.onParentMounted',
  findAttr,
  funRef,
  propsOmit: [findAttr, funRef, 'children', 'ref']
}
export default _constant