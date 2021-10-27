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
import CameraIcon from '@mui/icons-material/CameraAlt'
import badge from '../../img/coccarda.svg'
import { Badge } from '../reusable/Badge'

const Layout = ({ children, ...props }) => {
  return (
    <Box {...props}>
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Covid Data
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
          <Badge src={badge} alt="coccarda" width={6} />

          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Report Vaccini Anti COVID-19
          </Typography>
          {/*
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            Something short and leading about the collection below—its contents,
            the creator, etc. Make it short and sweet, but not too short so
            folks don&apos;t simply skip over it entirely.
          </Typography> */}
          {/*   <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained">Main call to action</Button>
              <Button variant="outlined">Secondary action</Button>
            </Stack> */}
        </Container>
      </Box>

      <Container sx={{ py: 8 }} maxWidth="false">
        {/* End hero unit */}
        {children}
      </Container>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
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
        <Copyright />
      </Box>
    </Box>
  )
}

export default Layout
