import { Container, Typography, Box } from '@mui/material'
import { Badge } from '../../components/reusable/Badge'
import React from 'react'
import coccarda from '../../img/coccarda.svg'
import gum from '../../img/gum.png'

const BadgeTextGraph = ({ title, data, badgePosition }) => {
  return (
    <Container
      sx={{
        backgroundColor: 'primary.main',
        p: 6,
        pb: 1,
        position: 'relative',
        mt: 6,
        mb: 2,
      }}
      maxWidth="false"
    >
      <Badge
        src={coccarda}
        alt="coccarda"
        width={6}
        left={badgePosition === 'left' ? '20px' : '100%'}
        top="-50px"
        position={'absolute'}
      />

      <Typography color={'text.primary'} variant={'h6'} align={'center'}>
        {title}
      </Typography>
      <Typography
        sx={{ mt: 2 }}
        color={'text.primary'}
        variant={'h3'}
        align={'center'}
      >
        {data}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        {' '}
        <Badge src={gum} alt="gum" width={3.5} />
      </Box>
    </Container>
  )
}

export default BadgeTextGraph
