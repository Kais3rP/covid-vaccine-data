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
    <g onClick={onClick}>
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
