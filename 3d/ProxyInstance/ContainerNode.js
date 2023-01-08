import _constant from "../constant"

export default class ContainerNode{
  constructor(res) {
    this.camera = _.get(_.find(res, x => _constant.cameraList.includes(x.type)), 'node')
    this.scene = _.get(_.find(res, x => _constant.sceneList.includes(x.type)), 'node')
    this.renderer = _.map(_.filter(res, x => _constant.rendererList.includes(x.type)), x => _.get(x, 'node'))
    this.control = _.get(_.find(res, x => _constant.controlList.includes(x.type)), 'node', null)
    console.log(this)
  }

  render() {
    for(const renderer of this.renderer) {
      renderer.render(this.scene, this.camera)
    }
    this.control?.update?.()
  }
}