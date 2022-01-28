import { getMakes } from '../../getMakes'
import { GetServerSideProps } from 'next'
import { Paper, Grid, makeStyles, SelectProps, Button } from '@material-ui/core'
import { Make } from '../../getMakes'
import { Formik, Form, useField, useFormikContext } from 'formik'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import router, { Router, useRouter } from 'next/router'
import { Field } from 'formik'
import { getModel, Model } from '../database/getModel'
import { getAsString } from '../getAsString'
import useSWR from 'swr'

export interface SearchProps {
  makes: Make[]
  models: Model[]
  singleColumn?: Boolean
}
interface GetAsString {
  getAsString?: string | string[]
  context: any
}
const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 'auto',
    maxWidth: 520,
    padding: theme.spacing(3),
  },
  break: {
    display: 'flex',
  },
}))
const prices = [500, 1000, 5000, 15000, 25000, 50000, 250000]
export default function Search({ makes, models, singleColumn }: SearchProps) {
  const classes = useStyles()
  const { query } = useRouter()
  const smValue = singleColumn ? 12 : 6
  const inititalValues = {
    make: query.make || 'all',
    model: query.model || 'all',
    minPrice: query.minPrice || 'all',
    maxPrice: query.maxPrice || 'all',
  }
  return (
    <Formik
      initialValues={inititalValues}
      onSubmit={(values) => {
        router.push(
          { pathname: '/cars', query: { ...values, page: 1 } },
          undefined,
          { shallow: true }
        )
      }}
    >
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={smValue}>
                <FormControl
                  fullWidth
                  variant='filled'
                  sx={{ m: 1, minWidth: 120 }}
                >
                  <InputLabel id='search-make'>Make</InputLabel>
                  <Field
                    name='make'
                    as={Select}
                    labelId='search-make'
                    label='Make'
                  >
                    <MenuItem value='all' className={classes.break}>
                      <em>All Makes</em>
                    </MenuItem>
                    {makes.map((make) => (
                      <MenuItem
                        key={make.make}
                        value={make.make}
                        className={classes.break}
                      >
                        {`${make.make} (${make.count})`}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <ModelSelect make={values.make} name='model' models={models} />
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <FormControl
                  fullWidth
                  variant='filled'
                  sx={{ m: 1, minWidth: 120 }}
                >
                  <InputLabel id='search-min-price'>Min Price</InputLabel>
                  <Field
                    name='minPrice'
                    as={Select}
                    labelId='search-min-price'
                    label='Min Price'
                  >
                    <MenuItem value='all' className={classes.break}>
                      <em>No Min</em>
                    </MenuItem>
                    {prices.map((price) => (
                      <MenuItem
                        key={price}
                        className={classes.break}
                        value={price}
                      >
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <FormControl
                  fullWidth
                  variant='filled'
                  sx={{ m: 1, minWidth: 120 }}
                >
                  <InputLabel id='search-max-price'>Max Price</InputLabel>
                  <Field
                    name='maxPrice'
                    as={Select}
                    labelId='search-max-price'
                    label='Max Price'
                  >
                    <MenuItem value='all' className={classes.break}>
                      <em>No Max</em>
                    </MenuItem>
                    {prices.map((price) => (
                      <MenuItem
                        key={price}
                        className={classes.break}
                        value={price}
                      >
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  )
}
export interface ModelSelectProps extends SelectProps {
  name: string
  models: Model[]
  make: string
}
export function ModelSelect({ models, make, ...props }: ModelSelectProps) {
  const { setFieldValue } = useFormikContext()
  const classes = useStyles()
  const [field] = useField({
    name: props.name,
  })
  const { data } = useSWR<Model[]>('/api/models?make=' + make, {
    dedupingInterval: 60000,
    onSuccess: (newValues) => {
      if (!newValues.map((a) => a.model).includes(field.value)) {
        setFieldValue('model', 'all')
      }
    },
  })
  const newModels = data || models
  return (
    <FormControl fullWidth variant='filled' sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id='search-model'>Model</InputLabel>
      <Select
        name='model'
        labelId='search-model'
        label='Model'
        {...field}
        {...props}
      >
        <MenuItem className={classes.break} value='all'>
          <em>All Models</em>
        </MenuItem>
        {newModels.map((model) => (
          <MenuItem
            key={model.model}
            className={classes.break}
            value={model.model}
          >
            {`${model.model} (${model.count})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (
  ctx
) => {
  const make = getAsString(ctx.query.make)

  const [makes, models] = await Promise.all([getMakes(), getModel(make)])

  return { props: { makes, models } }
}
