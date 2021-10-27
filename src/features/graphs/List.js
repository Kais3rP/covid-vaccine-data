import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/system'
import '../../App.css'
import { useSelector } from 'react-redux'

const List = ({ data }) => {
  return (
    data && (
      <Box>
        {' '}
        <DataGrid
          {...data}
          getRowClassName={(params) => 'grid-cell'}
          hideFooterPagination={true}
          disableExtendRowFullWidth={true}
        />
      </Box>
    )
  )
}

export default List
