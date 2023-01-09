import _ from "lodash";
import React, { useEffect, useState } from "react";
import { TextureLoader } from "three";
import { getStore } from "../core/store";

const store = getStore()

const getLoader = (url) => {
  if (Array.isArray(url) && url.length === 6) {
    return 'cubeTextureLoader'
  }
  url = url + ''
  const suffix = url.slice(url.lastIndexOf('.'))
  if (suffix.match(/(jpg|png|webp)/)) {
    return 'textureLoader'
  }
}

export function usePreload(urlArr, config) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    _.reduce(urlArr, (resourceMap, url) => {
      store[getLoader(url)].load(url, (texture) => {
        resourceMap[Array.isArray(url) ? JSON.stringify(url) : url] = texture
      })
      return resourceMap;
    }, store.resourceMap)

    store.loadingManager.onProgress = (url, loaded, total) => {
      setProgress(loaded / total)
    }
  }, [])

  return { progress }
}