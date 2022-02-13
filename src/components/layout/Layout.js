import {
  AppBar,
  Box,
  Container,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material'
import React from 'react'
import Copyright from '../copyright/Copyright'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import coccarda from '../../img/coccarda.svg'
import { Badge } from '../reusable/Badge'

const URL = 'http://mc-polonara.vercel.app/'

const Layout = ({ children, ...props }) => {
  return (
    <Box {...props}>
      <AppBar position="relative">
        <Toolbar>
          <HealthAndSafetyIcon sx={{ mr: 2 }} />
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
            backgroundColor: 'primary.main',
            pb: 2,
            pt: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
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
            Report Vaccini Anti COVID-19
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: 8 }} maxWidth="false">
        {/* End hero unit */}
        {children}
      </Container>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Built and maintained by
          <Box sx={{ display: 'inline', ml: 1, mr: 1 }}>
            {' '}
            <a
              className=""
              href="http://mc-polonara.vercel.app/"
              rel="noreferrer noopener"
            >
              Cesare Polonara
            </a>
          </Box>
          !
        </Typography>
        <Copyright name={"Cesare Polonara"}url={URL} />
      </Box>
    </Box>
  )
}

export default Layout
