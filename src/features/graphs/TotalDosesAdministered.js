import { Typography } from "@mui/material";
import { useMemo } from "react";
import Spinner from "../../components/reusable/Spinner";
import { useAdministeredSummaryData } from "./hooks";

const TotalDosesAdministered = ({ type }) => {
  const { data, isLoading } = useAdministeredSummaryData();

  const title = useMemo(() => {
    switch (type) {
      case "firstDose":
        return "1 dose";
      case "secondDose":
        return "2 doses";
      case "thirdDose":
        return "3 doses";
      case "fourthDose":
        return "4 doses";
      default:
        return "1 dose";
    }
  }, [type]);

  return isLoading ? (
    <Spinner isLoading={isLoading} />
  ) : (
    <>
      {" "}
      <Typography variant="h5" sx={{ mt: "3rem" }}>
        {title}
      </Typography>
      <Typography variant="h4"> {data[type].total}</Typography>
      <Typography>{data[type].percentageOnTotal}% of people</Typography>
      <Typography>
        {data[type].percentageOnOver12}% of people over 12
      </Typography>
    </>
  );
};

export default TotalDosesAdministered;
