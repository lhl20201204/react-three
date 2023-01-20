const funRef = '__funRef'
const containerList = ['Container']
const sceneList = ['Scene']
const cameraList = ['PerspectiveCamera']
const rendererList = ['WebGLRenderer', 'CSS2DRenderer', 'CSS3DRenderer']
const controlList = ['OrbitControls', 'TrackballControls']
const findAttrList = ['FindAttr']
const raycasterList = ['Raycaster']
const __proxy__ = '$$__proxy__'
const __type__ = '$$__type__'
const __isHovering__ = '$$__hovering__'
const __stride__ = '$$__stride__'

const _constant = {
  __isHovering__,
  __stride__,
  eventList: ['click', 'dblClick', 'mouseDown', 'mouseUp', 'mouseMove'],
  cameraList,
  rendererList,
  sceneList,
  controlList,
  containerList,
  findAttrList,
  raycasterList,
  excludeList: [
    ...containerList,
    ...sceneList,
    ...cameraList,
    ...rendererList,
    ...controlList,
    ...findAttrList,
    ...raycasterList,
  ],
  excludeAttrList: [
    __proxy__,
    __type__,
  ],
  grandAddList: ['SkeletonHelper'],
  promise: 'value.current.promise',
  node: 'value.current.node',
  group: 'value.current.group',
  child: 'value.current.child',
  onParentMounted: 'value.current.onParentMounted',
  funRef,
  propsOmit: [funRef, __proxy__, __type__, 'children', 'ref'],
  mapAttrList: ['map'],
  colorAttrList: ['color'],
  strideAttrList: ['moveForward', 'distVec'],
  __proxy__,
  __type__,
}
export default _constant