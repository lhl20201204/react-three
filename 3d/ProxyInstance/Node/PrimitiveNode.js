export default class PrimitiveNode{
  constructor(config) {
    if (!config.type || !config.promiseWrap || !config.props) {
      console.log(config)
      throw new Error('实例化失败')
    }
    this.promiseWrap = _.get(config, 'promiseWrap')
    this.hadLoad = false;
    this.promiseWrap.promise.then(() => this.hadLoad = true)
    this.type = _.get(config, 'type')
    this.props = _.get(config, 'props')
    this.level = -1
  }
}