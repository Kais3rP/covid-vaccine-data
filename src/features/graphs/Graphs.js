import { Box } from "@mui/material";
import AdministrationSites from "./AdministrationSites";
import AnagraphicGraph from "./AnagraphicGraph";
import DeliveredGraph from "./DeliveredGraph";
import SummaryGraph from "./SummaryGraph";
import TextGraph from "./TextGraph";
import TotalDosesAdministered from "./TotalDosesAdministered";
import WeeklyGraph from "./WeeklyGraph";

const Graphs = () => {
  return (
    <Box>
      <TextGraph
        title="First and second doses"
        Comp1={() => <TotalDosesAdministered type="firstDose" />}
        Comp2={() => <TotalDosesAdministered type="secondDose" />}
      />
      <TextGraph
        title="Third and fourth doses"
        Comp1={() => <TotalDosesAdministered type="thirdDose" />}
        Comp2={() => <TotalDosesAdministered type="fourthDose" />}
      />
      <SummaryGraph />
      <WeeklyGraph />
      <AnagraphicGraph />
      <DeliveredGraph />
      <AdministrationSites />
    </Box>
  );
};

export default Graphs;
