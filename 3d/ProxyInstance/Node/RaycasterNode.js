import _constant from "../../constant"
import PrimitiveNode from "./PrimitiveNode"
import { firstToUppercase } from "../../Util"
import _ from "lodash"

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
    this._mouse = {}
    this._events = _constant.eventList
    this._handles = []
    this._lastUniqIntersects = []
    this._listenerMethodNameList = []
    this._penetrate = _.get(this.props, 'noPenetrate', false)
  }

  checkTouchElement = (type) => () => {
    if (!this.hadLoad) {
      return;
    }
    const mouse = this._mouse
    this.raycaster.setFromCamera(mouse, this.camera);
    let intersects = this.raycaster.intersectObjects(this.scene.children, true)
    if (!this._penetrate) {
      intersects = intersects.slice(0, 1)
    }
    if (intersects) {
      this.promiseWrap?.props?.[type]?.(intersects)
    }
    const getUid = x => x.object.uuid
    const uniqIntersects = _.uniqBy(intersects, getUid)

    if (['onMouseMove'].includes(type)) {
      const uniqIntersectsId = uniqIntersects.map(getUid);
      const lastUniqIntersectsId = this._lastUniqIntersects.map(getUid);
      const over = _.uniqBy(uniqIntersects.filter(x => !lastUniqIntersectsId.includes(getUid(x))), getUid)
      const out = _.uniqBy(this._lastUniqIntersects.filter(x => !uniqIntersectsId.includes(getUid(x))), getUid)
      for (const x of over) {
        if (x.object?.userData && !x.object.userData[_constant.__isHovering__]) {
          x.object?.userData?.[_constant.__proxy__]?.props?.onMouseOver?.(x)
          x.object.userData[_constant.__isHovering__] = true
        }
      }
      for (const x of out) {
        if (x.object?.userData && x.object.userData[_constant.__isHovering__]) {
          x.object?.userData?.[_constant.__proxy__]?.props?.onMouseOut?.(x)
          x.object.userData[_constant.__isHovering__] = false
        }
      }
      for (const x of uniqIntersects) {
        x.object?.userData?.[_constant.__proxy__]?.props?.onMouseMove?.(x)
      }
    } else if (uniqIntersects.length) {
      for (const x of uniqIntersects) {
        x.object?.userData?.[_constant.__proxy__]?.props?.[type]?.(x)
      }
    }
    this._lastUniqIntersects = uniqIntersects
  }

  onClickEvent = this.checkTouchElement('onClick')
  onDblClickEvent = this.checkTouchElement('onDoubleClick')
  onMouseDownEvent = this.checkTouchElement('onMouseDown')
  onMouseUpEvent = this.checkTouchElement('onMouseUp')
  onMouseMoveEvent = this.checkTouchElement('onMouseMove')

  getHandle = methodName => event => {
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this._mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    this[methodName]()
  }

  addEvent = (props) => {
    this._mouse = {};
    this._handles = this._events.map(name => {
      const methodName = 'on' + firstToUppercase(name) + 'Event'
      return ({ name, fn: this.getHandle(methodName), methodName })
    })
    let len = this._events.length;
    for (let i = 0; i < len; i++) {
      let type = this._events[i];
      if (props[type]) {
        if (type === 'mouseMove') {
          this._listenerMethodNameList.push(this._handles[i].methodName)
        } 
        window.addEventListener(type.toLowerCase(), this._handles[i].fn, false);
      }
    }
   
  }

  removeEvent = (props) => {
    let len = this._events.length;
    for (let i = 0; i < len; i++) {
      let type = this._events[i];
      if (props[type]) {
        window.removeEventListener(type.toLowerCase(), this._handles[i].fn, false);
      }
    }
    this._listenerMethodNameList = []
  }
}