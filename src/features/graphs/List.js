import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/system";
import "../../App.css";
import { useSelector } from "react-redux";

const List = ({ data }) => {
  return (
    data && (
      <Box sx={{ height: 400 }}>
        {" "}
        <DataGrid
          {...data}
          getRowClassName={(params) => "grid-cell"}
          hideFooterPagination={false}
          disableExtendRowFullWidth
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
    )
  );
};

export default List;
