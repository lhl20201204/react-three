import PrimitiveNode from "./PrimitiveNode";

export default class ModelNode extends PrimitiveNode{
  constructor(res, config) {
     super(config)
     this.model = _.get(res, 'model')
     this.mixer = _.get(res, 'mixer')
     this.actions = _.get(res, 'actions')
  }

  update(t) {
    this.mixer.update(t)
  }
}