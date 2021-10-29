import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentRegion } from './map.slice'
const Region = ({ id, d, transform }) => {
  const dispatch = useDispatch()
  const onClick = (e) => {
    dispatch(setCurrentRegion(id))
    e.stopPropagation()
  }
  const currentRegion = useSelector((state) => state.map.region)
  return (
    <g
      style={{ outline: 'none' }}
      tabIndex="0"
      onClick={onClick}
      onBlur={() => dispatch(setCurrentRegion(null))}
    >
      <path
        className="region"
        id={id}
        d={d}
        transform={transform}
        fill={currentRegion === id ? '#F00' : '#005b96'}
      />
      <title>{id}</title>
    </g>
  )
}

export default Region
