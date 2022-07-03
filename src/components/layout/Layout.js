import {
  AppBar,
  Box,
  Container,
  Grid,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import Copyright from "../copyright/Copyright";
import CameraIcon from "@mui/icons-material/CameraAlt";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import badge from "../../img/coccarda.svg";
import { Badge } from "../reusable/Badge";

const URL = "http://cesarepolonara.com/";

const Layout = ({ children, ...props }) => {
  return (
    <Box {...props}>
      <AppBar position="relative">
        <Toolbar>
          <HealthAndSafetyIcon
            sx={{ mr: 2 }}
            color={"secondary"}
            fontSize={"large"}
          />
          <Typography variant="h6" color="inherit" noWrap>
            SARS-CoV2 Vaccine Italian Data
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Hero unit */}
      <Box
        sx={{
          pt: 1,
        }}
      >
        <Container
          sx={{
            backgroundColor: "primary.main",
            pb: 2,
            pt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          maxWidth="false"
        >
          <Badge src={badge} alt="badge" width={6} />

          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Report Anti COVID-19 vaccines
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: 8 }} maxWidth="false">
        {/* End hero unit */}
        {children}
      </Container>
      {/* Footer */}
      <Box sx={{ bgcolor: "primary.main", p: 6 }} component="footer">
        <Typography
          sx={{ fontSize: "0.8rem" }}
          align="center"
          gutterBottom
        >
          Data source:{" "}
          <Link
            sx={{ fontSize: "1rem" }}
            color="text.primary"
            href="https://github.com/italia/covid19-opendata-vaccini"
          >
            https://github.com/italia/covid19-opendata-vaccini
          </Link>
        </Typography>
        <Copyright name={"Cesare Polonara"} url={URL} />
      </Box>
    </Box>
  );
};

export default Layout;
