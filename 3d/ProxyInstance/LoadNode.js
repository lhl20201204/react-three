export default class LoadNode{
  constructor(promise) {
    this.hadLoad = false
    promise.then(() => this.hadLoad = true)
  }
}