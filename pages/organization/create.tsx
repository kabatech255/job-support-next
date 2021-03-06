import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Layout } from '@/layouts'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  Box,
  Button,
  Avatar,
  Container,
  CssBaseline,
  Grid,
  Typography,
  MenuItem,
} from '@material-ui/core'
import { TextField } from '@material-ui/core'
import BusinessOutlinedIcon from '@material-ui/icons/BusinessOutlined'
import { Controller, SubmitHandler } from 'react-hook-form'
import { CustomAlert, FormErrorMessage } from '@/components/atoms'
import { CircularButton, CustomLoader } from '@/components/molecules'
import { AlertStatus } from '@/interfaces/common'
import { OrganizationInputs } from '@/interfaces/form/inputs'
import { initialAlertStatus } from '@/lib/initialData'
import { strPatterns } from '@/lib/util'
import { useLocale, useOrganization } from '@/hooks'
import { PasswordTextField } from '@/components/molecules'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(4, 'auto'),
  },
  avatar: {
    margin: theme.spacing(1),
    background: 'linear-gradient(135deg,#fad961,#f76b1c)',
    boxShadow: theme.shadows[2],
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  address: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  submit: {
    margin: theme.spacing(2, 0),
    // background: linerGradient.red,
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
    '&:hover': {
      opacity: theme.palette.action.focusOpacity * 5,
    },
    '&.Mui-disabled': {
      background: theme.palette.action.focus,
      color: theme.palette.action.disabled,
    },
  },
  label: {
    fontSize: '90%',
  },
  body: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2, 3),
  },
}))

const OrganizationCreate = () => {
  const classes = useStyles()
  const {
    auth,
    control,
    errors,
    handleSubmit,
    handlePostalCode,
    loading,
    prefectureList,
    save,
    setError,
  } = useOrganization()
  const [alertStatus, setAlertStatus] = useState<AlertStatus>({
    ...initialAlertStatus,
  })
  const [initialLoader, setInitialLoader] = useState<boolean>(true)
  const { t } = useLocale()
  const options = {
    fullWidth: true,
    className: classes.submit,
  }

  const onSubmit: SubmitHandler<OrganizationInputs> = async (
    data: OrganizationInputs
  ) => {
    await save(data).catch((messages: { key: any; message: string }[]) => {
      messages.forEach(({ key, message }) => {
        setError(key, {
          type: 'invalid',
          message,
        })
      })
    })
  }

  useEffect(() => {
    if (auth.isLogin && !auth.user.is_initialized) {
      setInitialLoader(false)
    }
  }, [auth])

  return (
    <Layout title={t.head.title.organizationStore} canGuest={false}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        ></meta>
      </Head>
      <Container component="section" maxWidth="xs" className={classes.body}>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <BusinessOutlinedIcon />
          </Avatar>
          <Typography component="h2" variant="h5">
            {t.head.title.organizationStore}
          </Typography>
          {initialLoader ? (
            <CustomLoader />
          ) : (
            <form
              className={classes.form}
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        label="?????????"
                        id="name"
                        error={!!errors.name}
                        required
                        size={'small'}
                        autoFocus
                        placeholder="???????????????????????????"
                      />
                    )}
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: {
                        value: true,
                        message: '????????????????????????',
                      },
                    }}
                  />
                  <Box style={{ minHeight: 20 }}>
                    {!!errors.name && (
                      <FormErrorMessage msg={errors.name.message} />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        required
                        label="???????????????"
                        id="name_kana"
                        error={!!errors.name_kana}
                        size={'small'}
                        placeholder="???????????????????????????????????????"
                      />
                    )}
                    name="name_kana"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: {
                        value: true,
                        message: '????????????????????????',
                      },
                      pattern: {
                        value: strPatterns.katakana,
                        message: '??????????????????(??????????????????)?????????????????????',
                      },
                    }}
                  />
                  <Box style={{ minHeight: 20 }}>
                    {!!errors.name_kana && (
                      <FormErrorMessage msg={errors.name_kana.message} />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    control={control}
                    defaultValue=""
                    name="postal_code"
                    rules={{
                      required: {
                        value: true,
                        message: '???????????????????????????',
                      },
                      pattern: {
                        value: strPatterns.postal,
                        message: '????????????????????????????????????',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="postal_code"
                        label="????????????"
                        variant="outlined"
                        placeholder="??????????????????"
                        type="number"
                        error={!!errors.postal_code}
                        size={'small'}
                        required
                      />
                    )}
                  />
                  <Box style={{ minHeight: 20 }}>
                    {!!errors.postal_code && (
                      <FormErrorMessage msg={errors.postal_code.message} />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant={'outlined'}
                    color={'secondary'}
                    onClick={handlePostalCode}
                    classes={{ outlined: classes.address }}
                  >
                    ????????????
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Controller
                    control={control}
                    name="pref_id"
                    rules={{
                      required: {
                        value: true,
                        message: '???????????????????????????',
                      },
                      min: {
                        value: 1,
                        message: '???????????????????????????',
                      },
                    }}
                    defaultValue={0}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="????????????"
                        variant="outlined"
                        size="small"
                        error={!!errors.pref_id}
                        fullWidth
                        select
                      >
                        <MenuItem value={0}>
                          {'???????????????????????????????????????'}
                        </MenuItem>
                        {prefectureList.map((prefecture) => (
                          <MenuItem key={prefecture.id} value={prefecture.id}>
                            {prefecture.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />

                  <Box style={{ minHeight: 20 }}>
                    {!!errors.pref_id && (
                      <FormErrorMessage msg={errors.pref_id.message} />
                    )}
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Controller
                    render={({ field }) => (
                      <TextField
                        {...field}
                        // fullWidth
                        variant="outlined"
                        required
                        label="????????????"
                        id="city"
                        error={!!errors.city}
                        size={'small'}
                        placeholder="XX???"
                      />
                    )}
                    name="city"
                    control={control}
                    defaultValue={''}
                    rules={{
                      required: {
                        value: true,
                        message: '???????????????????????????',
                      },
                    }}
                  />
                  <Box style={{ minHeight: 20 }}>
                    {!!errors.city && (
                      <FormErrorMessage msg={errors.city.message} />
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        label="???????????????"
                        id="address"
                        error={!!errors.address}
                        size={'small'}
                        required
                      />
                    )}
                    name="address"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: '????????????????????????',
                      },
                    }}
                    defaultValue={''}
                  />
                  <Box style={{ minHeight: 20 }}>
                    {!!errors.address && (
                      <FormErrorMessage msg={errors.address.message} />
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="tel"
                    defaultValue=""
                    rules={{
                      required: {
                        value: true,
                        message: '???????????????????????????',
                      },
                      pattern: {
                        value: strPatterns.tel,
                        message: '????????????????????????????????????',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="tel"
                        label="????????????"
                        variant="outlined"
                        placeholder="??????????????????"
                        required
                        fullWidth
                        type="tel"
                        error={!!errors.tel}
                        size={'small'}
                      />
                    )}
                  />
                  <Box style={{ minHeight: 20 }}>
                    {!!errors.tel && (
                      <FormErrorMessage msg={errors.tel.message} />
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <PasswordTextField
                    control={control}
                    error={!!errors.password}
                    textProps={{
                      size: 'small',
                      variant: 'outlined',
                      label: '???????????????????????????????????????',
                    }}
                  />
                  <Box style={{ minHeight: 20 }}>
                    {!!errors.password && (
                      <FormErrorMessage msg={errors.password.message} />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <CircularButton
                      loading={loading}
                      submitText={t.common.store}
                      onClick={handleSubmit(onSubmit)}
                      options={options}
                    />
                  </Box>
                </Grid>
              </Grid>
            </form>
          )}
        </div>
        <CustomAlert
          alertStatus={alertStatus}
          setAlertStatus={setAlertStatus}
        />
      </Container>
    </Layout>
  )
}
export default OrganizationCreate
