import { useState } from 'react'

export const useWidth = () => {
  const [width, setWidth] = useState(
    0,
  ) /* useEffect(() => {
    console.log('INSIDE USE EFFECT', ref.current)
    setWidth(ref.current?.getBoundingClientRect().width)
  }, [ref.current]) */

  /*   const ref = useRef(null)
   */ const ref = (node) => {
    if (node) setWidth(node.getBoundingClientRect().width)
  }
  return { width, ref }
}
