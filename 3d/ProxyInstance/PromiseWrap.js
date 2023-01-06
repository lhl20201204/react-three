import PrimitiveParent from "./PrimitiveParent"

export default class PromiseWrap {
  constructor(config) {
    const {
      promiseRef,
      resolveRef,
      rejectRef,
      type,
    } = config || {}
    let resolve = _.get(resolveRef, 'current'),
      reject = _.get(rejectRef, 'current')
    const promise = _.get(promiseRef, 'current') || new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
    promise.then(value => {
      if (value instanceof PrimitiveParent) {
        value.setLevel(this.level)
      }
      this.value = value
    })
    this.parentPromiseResolve = null
    this.parent = null
    this.parentPromise = new Promise(r1=> {
      this.parentPromiseResolve = r1
    })
    this.children = [];
    this.level = -1;
    this.value = {};
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
          _this.value[attr] = v
        }
        return true
      },
      get(_this, attr) {
        return selfAttr.includes(attr) ? _this[attr] : _this.value[attr]
      }
    })
  }
}