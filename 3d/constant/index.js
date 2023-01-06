const findAttr = 'attr'
const funRef = '__funRef'
const _constant = {
  cameraList: ['PerspectiveCamera'],
  rendererList: ['WebGLRenderer', 'CSS2DRenderer', 'CSS3DRenderer'],
  sceneList: ['Scene'],
  controlList: ['OrbitControls'],
  findAttrList: ['FindAttr'],
  promise: 'value.current.promise',
  node: 'value.current.node',
  group: 'value.current.group',
  child: 'value.current.child',
  onParentMounted: 'value.current.onParentMounted',
  findAttr,
  funRef,
  propsOmit: [ findAttr, funRef, 'children', 'ref']
}
export default _constant