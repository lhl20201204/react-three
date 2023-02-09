const funRef = '__funRef'
const containerList = ['Container']
const sceneList = ['Scene']
const cameraList = ['PerspectiveCamera']
const rendererList = ['WebGLRenderer', 'CSS2DRenderer', 'CSS3DRenderer']
const controlList = ['OrbitControls', 'TrackballControls', 'FirstPersonControls']
const findAttrList = ['FindAttr']
const raycasterList = ['Raycaster']
const __proxy__ = '$$__proxy__'
const __type__ = '$$__type__'
const __isHovering__ = '$$__hovering__'
const __stride__ = '$$__stride__'
const __isBox3__ = '$$__isBox3__'
const __LastInsections__ = '$__LastInsections__'

const _constant = {
  __LastInsections__,
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
    __isHovering__,
    __stride__,
    __isBox3__,
  ],
  grandAddList: ['SkeletonHelper'],
  promise: 'value.current.promise',
  node: 'value.current.node',
  wrap: 'value.current.wrap',
  child: 'value.current.child',
  onParentMounted: 'value.current.onParentMounted',
  funRef,
  propsOmit: [funRef, __proxy__, __type__, 'children', 'ref'],
  mapAttrList: ['map'],
  colorAttrList: ['color'],
  box3AttrList: ['boxVisible'],
  __isBox3__,
  strideAttrList: ['goToLookAt', 'distVec'],
  wrapName: 'wrap',
  __proxy__,
  __type__,
  __needRaycasterChildren__: '$$__needRaycasterChildren__',
  __wrapFlag__: '__$$__Of__Wrap',
}
export default _constant