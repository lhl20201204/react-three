import _ from "lodash";
import React, { useEffect, useState } from "react";
import { TextureLoader } from "three";
import { getStore } from "../core/store";

const store = getStore()

const getLoader = (suffix) => {
  if (suffix.match(/(jpg|png|webp)/)) {
    return 'textureLoader'
  }
}

export function usePreload(urlArr, config) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    _.reduce(urlArr, (resourceMap, url) => {
      url = url + ''
      const suffix = url.slice(url.lastIndexOf('.'))
      store[getLoader(suffix)].load(url, (texture) => {
        resourceMap[url] = texture
      })
      return resourceMap;
    }, store.resourceMap)

    store.loadingManager.onProgress = (url, loaded, total) => {
      setProgress(loaded / total)
    }
  }, [])

  return { progress }
}