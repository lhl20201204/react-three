import { useRef } from "react"

export default function usePromise() {
  const resolveRef = useRef()
  const rejectRef = useRef()
  const promiseRef = useRef(new Promise(r => {
    resolveRef.current = r
    rejectRef.current = r
  }))
  return {
    resolveRef,
    rejectRef,
    promiseRef,
  }
}