import { CarModel } from '../../api/Car'
import * as React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import Avatar from '@mui/material/Avatar'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { makeStyles } from '@material-ui/core'
import Link from 'next/link'

export interface CarCardProps {
  car: CarModel
}

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
  achorTag: {
    textDecoration: 'none',
  },
}))

export function CarCard({ car }: CarCardProps) {
  const classes = useStyles()

  return (
    <Link
      href='/car/[make]/[brand]/[id]'
      as={`/car/${car.make}/${car.model}/${car.id}`}
    >
      <a className={classes.achorTag}>
        <Card elevation={5}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label='recipe'>
                R
              </Avatar>
            }
            action={
              <IconButton aria-label='settings'>
                <MoreVertIcon />
              </IconButton>
            }
            title={car.make + ' ' + car.model}
            subheader={`$ ${car.price}`}
          />
          <CardMedia
            component='img'
            height={300}
            // width={400}
            image={car.photoUrl}
            alt={car.make + ' ' + car.model}
          />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              {car.details}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label='add to favorites'>
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label='share'>
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>
      </a>
    </Link>
  )
}
