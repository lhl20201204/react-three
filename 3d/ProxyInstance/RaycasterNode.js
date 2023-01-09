import _constant from "../constant"
import LoadNode from "./LoadNode"

export default class RaycasterNode extends LoadNode{
  constructor(raycaster, {
    res,
    promise
  }) {
    super(promise)
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
      this.props?.[type]?.(intersects)
    }
    const uniqIntersects = _.uniqBy(intersects,x => x.object.uuid)
    if (uniqIntersects.length) {
      for(const x of uniqIntersects) {
        x.object?.userData?.proxy?.props?.[type]?.(x)
      }
    }
  }

 checkClickTouchElement = this.checkTouchElement('onClick')
 checkDbClickTouchElemnt = this.checkTouchElement('onDoubleClick')
}