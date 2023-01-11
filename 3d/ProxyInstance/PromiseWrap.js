import PrimitiveWrap from "./Wrap/PrimitiveWrap"
let pid = 0;
export default class PromiseWrap {
  constructor(config) {
    const {
      promiseRef,
      resolveRef,
      rejectRef,
      type,
    } = config || {}
    this.pid = pid++;
    let resolve = _.get(resolveRef, 'current'),
      reject = _.get(rejectRef, 'current')
    const promise = _.get(promiseRef, 'current') || new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
    promise.then(value => {
      if (value instanceof PrimitiveWrap) {
        value.setLevel(this.level)
      }
      value.props?.onLoad?.(value)
      this._value = value
    })
    this.parentPromiseResolve = null
    this._parent = null
    const parentPromise = new Promise(r1 => {
      this.parentPromiseResolve = r1
    })
    parentPromise.then(p => {
      this._parent = p;
    })
    this.parentPromise = parentPromise
    this._children = [];
    this.childrenPromiseResolve = null
    const childrenPromise = new Promise(r2 => {
      this.childrenPromiseResolve = r2
    })
    childrenPromise.then(c => {
      this._children = c;
    })
    this.childrenPromise = childrenPromise

    this.siblingPromiseResolve = null
    const siblingPromise = new Promise(r3 => {
      this.siblingPromiseResolve = r3;
    })
    this._sibling = []
    siblingPromise.then(s => {
      this._sibling = s;
    })
    this.siblingPromise = siblingPromise;

    this.level = -1;
    this._value = {};
    this.resolve = resolve;
    this.reject = reject;
    this.promise = promise;
    this.type = type;
    const selfAttr = [...Reflect.ownKeys(this), ...Reflect.ownKeys(PromiseWrap.prototype)]
    return new Proxy(this, {
      set(_this, attr, v) {
        if (selfAttr.includes(attr)) {
          _this[attr] = v
        } else {
          _this._value[attr] = v
        }
        return true
      },
      get(_this, attr) {
        return selfAttr.includes(attr) ? _this[attr] : _this._value[attr]
      }
    })
  }

  bindPromiseWrapRelation(level, parent) {
    this.level = level;
    this.parentPromiseResolve(parent)
  }

  _removeFromParent() {
    // TODO
  }
}