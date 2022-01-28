import { Grid } from '@material-ui/core'
import { GetServerSideProps } from 'next'
import Search from '.'
import { CarModel } from '../../api/Car'
import { getMakes, Make } from '../../getMakes'
import { getModel, Model } from '../database/getModel'
import { getAsString } from '../getAsString'
import { getPaginatedCars } from '../database/getpaginatedCars'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { PaginationRenderItemParams } from '@material-ui/lab'
import { ParsedUrlQuery, stringify } from 'querystring'
import React, { forwardRef, useState } from 'react'
import useSWR from 'swr'
import deepEqual from 'fast-deep-equal'
import { CarPagination } from '../components/CarPagination'
import { CarCard } from '../components/CarCard'

export interface CarsListProps {
  makes: Make[]
  models: Model[]
  cars: CarModel[]
  totalPages: number
  serverQuery: ParsedUrlQuery
}

export default function CarsList({
  makes,
  models,
  cars,
  totalPages,
  serverQuery,
}: CarsListProps) {
  const { query } = useRouter()
  // const [serverQuery] = useState(query)
  const { data } = useSWR('/api/cars?' + stringify(query), {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery)
      ? { cars, totalPages }
      : undefined,
  })

  // console.log(data)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>
      <Grid spacing={4} container item xs={12} sm={7} md={9} lg={10}>
        <Grid item xs={12}>
          <CarPagination totalPages={data?.totalPages} />
        </Grid>
        {(data?.cars || []).map((car) => (
          <Grid key={car.id} item xs={12} sm={6}>
            <CarCard car={car} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <CarPagination totalPages={data?.totalPages} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const make = getAsString(context.query.make)

  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModel(make),
    getPaginatedCars(context.query),
  ])

  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
      serevrQuery: context.query,
    },
  }
}
