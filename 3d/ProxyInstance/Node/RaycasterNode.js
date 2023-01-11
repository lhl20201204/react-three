import _constant from "../../constant"
import PrimitiveNode from "./PrimitiveNode"

export default class RaycasterNode extends PrimitiveNode {
  constructor(raycaster, config) {
    super(config)
    if (!config.res) {
      throw new Error('res 属性必须传')
    }
    const res = _.get(config, 'res')
    this.raycaster = raycaster
    this.camera = _.get(_.find(res, x => _constant.cameraList.includes(x.type)), 'node')
    this.scene = _.get(_.find(res, x => _constant.sceneList.includes(x.type)), 'node')
  }

  checkTouchElement = (type) => (mouse) => {
    if (!this.hadLoad) {
      return;
    }
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true)
    if (intersects) {
      this.promiseWrap?.props?.[type]?.(intersects)
    }
    const uniqIntersects = _.uniqBy(intersects, x => x.object.uuid)
    if (uniqIntersects.length) {
      for (const x of uniqIntersects) {
        x.object?.userData?.[type]?.(x)
      }
    }
  }

  checkClickTouchElement = this.checkTouchElement('onClick')
  checkDbClickTouchElemnt = this.checkTouchElement('onDoubleClick')
}