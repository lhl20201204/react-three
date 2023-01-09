import _ from "lodash";
export function findNode(option, obj) {
  const res = []
  for(const child of obj.children) {
    const ret = findNode(option ,child)
    if (ret.length){
      res.push(...ret)
    }
  }
  if (obj.key === option.key 
    || obj.type === option.type 
    || (Array.isArray(option.key) && option.key.includes(obj.key))
    || (Array.isArray(option.type) && option.type.includes(obj.type))
    ) { 
    res.push(obj)
  }
  return res
}