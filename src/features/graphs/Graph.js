import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material'
import React, { useEffect } from 'react'
import Chart from 'react-chartjs-2'

const Graph = ({ data }) => {
  console.log(data, data.options)

  return (
    <Grid item xs={12} md={6} xl={4}>
      <Card
        sx={{
          height: '100',
          minWidth: '300px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/*  <CardMedia
          component="img"
          sx={{
            // 16:9
            pt: '56.25%',
          }}
          image="https://source.unsplash.com/random"
          alt="random"
        /> */}
        {data && (
          <Chart
            data={data}
            options={data.options}
            type={data.type}
            plugins={data.plugins}
          />
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            Heading
          </Typography>
          <Typography>
            This is a media card. You can use this section to describe the
            content.
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="outlined" color="secondary" size="small">
            View
          </Button>
          <Button size="small">Edit</Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default Graph
