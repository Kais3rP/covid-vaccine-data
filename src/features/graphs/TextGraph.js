import { Container, Typography, Box } from '@mui/material'
import React from 'react'
import badge from '../../img/coccarda.svg'
import { Badge } from '../../components/reusable/Badge'

const TextGraph = ({ Comp1, Comp2, title }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Container
        sx={{
          pb: 2,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <Typography color="primary" variant="h5">
          {title}
        </Typography>
      </Container>
      <Container
        sx={{
          p: 4,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          backgroundColor: 'primary.main',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            pb: 2,
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Badge
            src={badge}
            alt="coccarda"
            width={6}
            position="absolute"
            top="-80px"
            left="50%"
          />
          {Comp1 && <Comp1 />}
        </Box>
        <Box
          sx={{
            position: 'relative',
            pb: 2,
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Badge
            src={badge}
            alt="coccarda"
            width={6}
            position="absolute"
            top="-80px"
            left="50%"
          />
          {Comp2 && <Comp2 />}
        </Box>
      </Container>
    </Box>
  )
}

export default TextGraph
