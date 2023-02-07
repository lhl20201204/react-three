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
    this.$pid = pid++;
    let resolve = _.get(resolveRef, 'current'),
      reject = _.get(rejectRef, 'current')
    const promise = _.get(promiseRef, 'current') || new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
    promise.then(value => {
      if (value instanceof PrimitiveWrap) {
        value.setLevel(this.$level)
      }
      this.$value = value 
      value.props?.onLoad?.(value)
    })
    this.$parentPromiseResolve = null
    this.$parent = null
    const parentPromise = new Promise(r1 => {
      this.$parentPromiseResolve = r1
    })
    parentPromise.then(p => {
      this.$parent = p;
    })
    this.$parentPromise = parentPromise
    this.$children = [];
    this.$childrenPromiseResolve = null
    const childrenPromise = new Promise(r2 => {
      this.$childrenPromiseResolve = r2
    })
    childrenPromise.then(c => {
      this.$children = c;
    })
    this.$childrenPromise = childrenPromise

    this.$siblingPromiseResolve = null
    const siblingPromise = new Promise(r3 => {
      this.$siblingPromiseResolve = r3;
    })
    this.$sibling = []
    siblingPromise.then(s => {
      this.$sibling = s;
    })
    this.$siblingPromise = siblingPromise;

    this.$level = -1;
    this.$value = {};
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
          _this.$value[attr] = v
        }
        return true
      },
      get(_this, attr) {
        return selfAttr.includes(attr) ? _this[attr] : _this.$value[attr]
      }
    })
  }

  _addToParent(level, parent) {
    this.$level = level;
    this.$parentPromiseResolve(parent)
  }

  _removeFromParent() {
    this.onDestroyed()
  }
}