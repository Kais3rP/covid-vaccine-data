import { Box } from "@mui/system";
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Spinner = ({ isLoading }) => {
  return (
    <Box sx={{ m: 4 }}>
      {" "}
      <ClipLoader
        color={"red"}
        loading={isLoading}
        cssOverride={override}
        size={25}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </Box>
  );
};

export default Spinner;
