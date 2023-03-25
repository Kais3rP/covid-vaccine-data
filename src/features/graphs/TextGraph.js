import { Container, Typography, Box, Grid } from "@mui/material";
import React from "react";
import { Badge } from "../../components/reusable/Badge";
import useMediaQuery from "@mui/material/useMediaQuery";
import Cockade from "../../components/reusable/svg/Cockade";

const TextGraph = ({ Comp1, Comp2, title }) => {
  const matches = useMediaQuery("(min-width:900px)");
  return (
    <Box sx={{ mt: 2 }}>
      <Container
        sx={{
          pb: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Typography color="primary" variant="h5" sx={{ mb: 3 }}>
          {title}
        </Typography>
      </Container>
      <Grid
        container
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          flexWrap: "wrap",
          backgroundColor: "primary.main",
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            position: "relative",
            pb: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "4rem",
              top: 0,
              transform: "translateY(-55%)",
            }}
          >
            <Cockade />
          </Box>
          {Comp1 && <Comp1 />}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            position: "relative",
            pb: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {matches && (
            <Box
              sx={{
                position: "absolute",
                width: "4rem",
                top: 0,
                transform: "translateY(-55%)",
              }}
            >
              <Cockade />
            </Box>
          )}
          {Comp2 && <Comp2 />}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TextGraph;
