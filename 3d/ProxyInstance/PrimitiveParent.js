import _constant from "../constant";

let id = 0;
const exclude = [..._constant.cameraList, ..._constant.rendererList]
export default class PrimitiveParent {
  constructor(config) {
    this.id = id++
    this.resolve = _.get(config, 'resolve')
    this.reject = _.get(config, 'reject')
    this.promise = _.get(config, 'promise')
  }
  updateProps(props) {
    this.props = props
    for (const attr in props) {
      if ([
        'children',
        'ref'
      ].includes(attr)) {
        continue
      }
      this[attr] = props[attr] || 0
    }
  }

  onParentMounted(parentAstItem) {
    const parentNode = _.get(parentAstItem, _constant.node, _.get(parentAstItem, _constant.child))
    const child = this.group || this.node
    if (exclude.includes(this.type)) {
      return
    }
    if (child && parentNode) {
      parentNode.add(child)
    }
  }
}