import { Container, Typography, Box } from "@mui/material";
import { Badge } from "../../components/reusable/Badge";
import React from "react";
import gum from "../../img/gum.png";
import Cockade from "../../components/reusable/svg/Cockade";

const BadgeTextGraph = ({ title, data, badgePosition }) => {
  return (
    <Container
      sx={{
        backgroundColor: "primary.main",
        p: 6,
        pb: 1,
        position: "relative",
        mt: 6,
        mb: 2,
      }}
      maxWidth="false"
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translateX(-50%) translateY(-25%)",
          width: "4rem",
          mr: 4,
        }}
      >
        <Cockade />
      </Box>

      <Typography color={"text.primary"} variant={"h6"} align={"center"}>
        {title}
      </Typography>
      <Typography
        sx={{ mt: 2 }}
        color={"text.primary"}
        variant={"h3"}
        align={"center"}
      >
        {data}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "20px",
            right: 0,
            // transform: "translateX(-50%) translateY(-25%)",
            width: "4rem",
            mr: 4,
          }}
        >
          <img src={gum} alt="gum" />
        </Box>
      </Box>
    </Container>
  );
};

export default BadgeTextGraph;
