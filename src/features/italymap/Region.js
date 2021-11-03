import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentRegion } from './map.slice'

const Region = ({ id, d, transform, type, deselectOnBlur }) => {
  const dispatch = useDispatch()
  const onClick = (e) => {
    dispatch(setCurrentRegion({ id, type }))
    e.stopPropagation()
  }

  const currentRegion = useSelector((state) => state.map.region)
  console.log('CURRENT MAP REGION', currentRegion?.id, currentRegion?.type)
  return (
    <g
      style={{ outline: 'none' }}
      tabIndex="0"
      onClick={onClick}
      onBlur={() => {
        if (deselectOnBlur) dispatch(setCurrentRegion(null))
      }}
    >
      <path
        className="region"
        id={id}
        d={d}
        transform={transform}
        fill={
          currentRegion?.id === id && currentRegion?.type === type
            ? '#F00'
            : '#005b96'
        }
      />
      <title>{id}</title>
    </g>
  )
}

export default Region
