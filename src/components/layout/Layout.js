import {
  AppBar,
  Box,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import Copyright from "../copyright/Copyright";
import CameraIcon from "@mui/icons-material/CameraAlt";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import badge from "../../img/coccarda.svg";
import { Badge } from "../reusable/Badge";

const URL = 'http://mc-polonara.vercel.app/'

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
          <Badge src={coccarda} alt="coccarda" width={6} />

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
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright name={'Cesare Polonara'} url={URL} />
      </Box>
    </Box>
  );
};

export default Layout;
