import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Badge } from "../reusable/Badge";
import meds from "../../img/meds.png";
import { format } from "date-fns";
import { useGetSummaryQuery } from "../../services";
import Spinner from "../reusable/Spinner";

const Hero = () => {
  const { data, isLoading } = useGetSummaryQuery();

  return (
    <>
      <Container>
        <Typography
          component="h1"
          variant="h6"
          align="center"
          color="text.secondary"
          gutterBottom
        >
          Report aggiornato al: {format(new Date(), "MM/dd/yyyy")}
        </Typography>
      </Container>
      <Container
        sx={{
          pb: 2,
          pt: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            pb: 2,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            borderBottom: "1px solid #000",
          }}
        >
          {" "}
          <Badge width={6}>
            <img src={meds} alt="meds icon" />
          </Badge>
          <Typography
            sx={{ marginLeft: "20px" }}
            component="h1"
            variant="h3"
            align="center"
            color="text.secondary"
          >
            <Spinner isLoading={isLoading} />
            {data
              ? data?.data
                  .reduce((acc, curr) => acc + curr.dosi_somministrate, 0)
                  .toLocaleString("it")
              : null}
          </Typography>
        </Box>{" "}
      </Container>
    </>
  );
};

export default Hero;
