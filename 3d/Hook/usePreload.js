import _ from "lodash";
import React, { useEffect, useState } from "react";
import { getStore } from "../core/store";

const store = getStore()

const getLoader = (url) => {
  if (Array.isArray(url) && url.length === 6) {
    return 'cubeTextureLoader'
  }
  url = url + ''
  const suffix = url.slice(url.lastIndexOf('.'))
  if (suffix.match(/(jpg|png|webp|jpeg)/)) {
    return 'textureLoader'
  }

  if (suffix.match(/fbx/)) {
    return 'fbxLoader'
  }

  if (suffix.match(/glb/)) {
    return 'gltfLoader'
  }

}

export function usePreload(urlArr, config) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    _.reduce(urlArr, (resourceMap, url) => {
      store[getLoader(url)].load(url, (obj) => {
        const ret = config?.onLoad?.(url, obj)
        resourceMap[Array.isArray(url) ? JSON.stringify(url) : url] = ret || obj
      })
      return resourceMap;
    }, store.resourceMap)

    store.loadingManager.onProgress = (url, loaded, total) => {
      setProgress(loaded / total)
    }
  }, [])

  return { progress }
}