import PromiseWrap from "../ProxyInstance/PromiseWrap"
import _ from "lodash";

function getMidOrder(pre, suf) {
  const prel = pre.length
  const sufl = suf.length
  if (prel !== sufl) {
    throw new Error()
  }
  const ret = {
    name: pre[0],
    children: [],
  }
  const nPre = pre.slice(1)
  const nSuf = suf.slice(0, -1)
  const len = nPre.length
  let s = 0;
  for (let i = 0; i <= len; i++) {
    const childPre = nPre.slice(s, i)
    const childSuf = nSuf.slice(s, i)
    const childPreKey = [...childPre].sort().join('##')
    const childSufKey = [...childSuf].sort().join('##')
    if (s < i && childPreKey === childSufKey) {
      ret.children.push(getMidOrder(childPre, childSuf))
      s = i
    }
  }
  return ret;
}

export function getAst(pre, suf) {
  const ast = getMidOrder(pre, suf.map(x => x.name))
  const dict = _.reduce(suf, (obj, v) => {
    obj[v.name] = _.omit(v, ['name'])
    return obj
  }, {})
  const transform = (a, level = 1, parent = null) => {
    const { current } = dict[a.name].value
    if ((current instanceof PromiseWrap)) {
      current._addToParent(level, parent)
      const childrenPromiseWrap = a.children.map(c => dict[c.name].value.current)
      current.childrenPromiseResolve(childrenPromiseWrap)
      childrenPromiseWrap.map(pw => {
        if (pw instanceof PromiseWrap) {
          pw.siblingPromiseResolve(childrenPromiseWrap.filter(x => x !== pw))
        }
      })
    }
    return ({
      ...dict[a.name],
      key: a.name,
      level,
      children: a.children.map(c => transform(c, level + 1, current))
    })
  }
  return transform(ast)
}