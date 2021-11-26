import { Container, Typography } from '@mui/material'
import React from 'react'

const Header = ({ title, sub }) => {
  return (
    <Container
      sx={{ backgroundColor: 'secondary.main', p: 10, mt: 2, mb: 2 }}
      maxWidth="false"
    >
      <Typography color={'text.secondary'} variant={'h4'} align={'center'}>
        {title}
      </Typography>
      <Typography color={'text.secondary'} variant={'h6'} align={'center'}>
        {sub}
      </Typography>
    </Container>
  )
}

export default Header
