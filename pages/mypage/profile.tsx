import React, { useState, useEffect } from 'react'
import { loginAction } from '@/globalState/user/action'
import clsx from 'clsx'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { MypageLayout } from '@/layouts'
import { MypageTitle, FormErrorMessage, CustomAlert } from '@/components/atoms'
import { CircularButton, FormTitle } from '@/components/molecules'
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  Tooltip,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Paper,
} from '@material-ui/core'
import { PhotoCamera } from '@material-ui/icons'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined'
import { User } from '@/interfaces/models'
import { useForm, Controller } from 'react-hook-form'
import { ProfileInputs } from '@/interfaces/form/inputs'
import { strPatterns, STORAGE_URL, API_DIRECT_URL } from '@/lib/util'
import { defaultErrorHandler, putRequest } from '@/api'
import { AlertStatus } from '@/interfaces/common'
import { initialAlertStatus } from '@/lib/initialData'
import { useAuth } from '@/hooks'

const usePaperStyles = makeStyles((theme: Theme) =>
  createStyles({
    facePaper: {
      cursor: 'pointer',
      overflow: 'hidden',
    },
    output: {
      zIndex: 1,
      width: '100%',
      minHeight: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    trash: {
      position: 'absolute',
      bottom: -30,
      right: 0,
      color: theme.palette.grey[600],
    },
    fill: {
      position: 'relative',
      top: 0,
      left: 0,
      width: '100%',
      height: 0,
      paddingBottom: '56.25%',
      background: theme.palette.grey[200],
    },
    mark: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
  })
)

const FacePaper = ({ preview }: { preview: any }) => {
  const classes = usePaperStyles()
  return (
    <Tooltip title={'???????????????????????????'}>
      <Paper className={classes.facePaper}>
        {preview !== null ? (
          <output className={classes.output}>
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt={'?????????????????????'} />
            }
          </output>
        ) : (
          <div className={classes.fill}>
            <div className={classes.mark}>
              <IconButton
                color="default"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </div>
          </div>
        )}
      </Paper>
    </Tooltip>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      margin: 0,
      background: 'linear-gradient(135deg,#fad961,#f76b1c)',
      boxShadow: theme.shadows[2],
    },
    wrap: {
      width: 500,
      maxWidth: '100%',
      margin: '0 auto',
      textAlign: 'center',
    },
    none: {
      display: 'none',
    },
    top: {
      paddingTop: theme.spacing(4),
      // paddingBottom: theme.spacing(4),
    },
    footer: {
      justifyContent: 'center',
      padding: theme.spacing(2),
    },
    err: {
      minHeight: 20,
      textAlign: 'left',
    },
    checkRow: {
      display: 'flex',
      alignItems: 'center',
    },
    subFlag: {
      color: theme.palette.text.secondary,
      '& .MuiTypography-body1': {
        fontSize: theme.typography.body2.fontSize,
      },
    },
  })
)

const Profile = () => {
  const classes = useStyles()
  const { auth, dispatch, config } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const [alertStatus, setAlertStatus] = useState<AlertStatus>({
    ...initialAlertStatus,
  })
  const [preview, setPreview] = useState<any>(null)
  const [thumbnailData, setThumbnailData] = useState<any>(null)
  const [defaultValues, setDefaultValues] = useState<ProfileInputs>({
    family_name: '',
    given_name: '',
    family_name_kana: '',
    given_name_kana: '',
    file: null,
    delete_flag: false,
  })
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<ProfileInputs>({
    defaultValues,
  })
  const handleDeleteFlag = () => {
    setValue('delete_flag', !getValues('delete_flag'))
  }

  const handleUpdate = async (data: ProfileInputs) => {
    if (auth.isLogin) {
      setLoading(true)
      const submitData = new FormData()
      submitData.append('family_name', data.family_name)
      submitData.append('family_name_kana', data.family_name_kana)
      submitData.append('given_name', data.given_name)
      submitData.append('given_name_kana', data.given_name_kana)
      submitData.append('delete_flag', data.delete_flag ? '1' : '0')
      if (!(thumbnailData === null || data.delete_flag)) {
        submitData.append('file', thumbnailData)
      }
      await putRequest<User, FormData>(
        `/user/${auth.user.id}/profile`,
        submitData,
        (err) => {
          setAlertStatus((prev) => ({
            ...prev,
            msg: '????????????????????????????????????????????????',
            severity: 'error',
            show: true,
          }))
          defaultErrorHandler(err)
        },
        {
          headers: {
            'X-HTTP-Method-Override': 'PUT',
            'Content-Type': 'multipart/form-data',
            ...config.headers,
          },
        },
        API_DIRECT_URL
      )
        .then((response: User) => {
          if (data.delete_flag) {
            setPreview(null)
          }
          setThumbnailData(null)
          setAlertStatus((prev) => ({
            ...prev,
            msg: '???????????????????????????????????????',
            severity: 'success',
            show: true,
          }))
          dispatch(
            loginAction({ ...response, jwt: config.headers.Authorization })
          )
          setThumbnailData(null)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handlePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files!.length === 0) {
      return false
    }
    if (!event.target.files![0].type.match('image.*')) {
      return false
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target!.result)
    }
    reader.readAsDataURL(event.target.files![0])
    setThumbnailData(event.target.files![0])
  }

  useEffect(() => {
    if (auth.isLogin) {
      setValue('family_name', auth.user.family_name)
      setValue('given_name', auth.user.given_name)
      setValue('family_name_kana', auth.user.family_name_kana)
      setValue('given_name_kana', auth.user.given_name_kana)
      setValue('file', null)
      setValue('delete_flag', false)
      if (!!auth.user.file_path) {
        setPreview(`${STORAGE_URL}/${auth.user.file_path}`)
      }
    }
  }, [auth, setValue, setPreview])

  return (
    <MypageLayout title={'??????????????????'}>
      <MypageTitle>
        <div className="u-container">??????????????????</div>
      </MypageTitle>
      <section>
        <Card className={clsx(['u-container', classes.top])}>
          <div>
            <div className={classes.wrap}>
              <FormTitle
                title={'????????????????????????'}
                icon={<AccountCircleOutlinedIcon />}
              />
            </div>
          </div>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <CardContent>
              <Grid container spacing={2} className={classes.wrap}>
                <Grid item xs={6}>
                  <Controller
                    control={control}
                    name="family_name"
                    rules={{
                      required: {
                        value: true,
                        message: '??????????????????',
                      },
                      maxLength: {
                        value: 20,
                        message: '20???????????????????????????',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="family_name"
                        label="???"
                        variant="outlined"
                        type="text"
                        placeholder="??????"
                        required
                        fullWidth
                        size={'small'}
                        error={!!errors.family_name}
                      />
                    )}
                  />
                  <p className={classes.err}>
                    {!!errors.family_name && (
                      <FormErrorMessage msg={errors.family_name.message} />
                    )}
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    control={control}
                    name="given_name"
                    rules={{
                      required: {
                        value: true,
                        message: '??????????????????',
                      },
                      maxLength: {
                        value: 20,
                        message: '20???????????????????????????',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="given_name"
                        label="???"
                        variant="outlined"
                        type="text"
                        placeholder="??????"
                        required
                        fullWidth
                        size={'small'}
                        error={!!errors.given_name}
                      />
                    )}
                  />
                  <p className={classes.err}>
                    {!!errors.given_name && (
                      <FormErrorMessage msg={errors.given_name.message} />
                    )}
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    control={control}
                    name="family_name_kana"
                    rules={{
                      required: {
                        value: true,
                        message: '?????????????????????',
                      },
                      pattern: {
                        value: strPatterns.katakana,
                        message: '??????????????????(??????????????????)?????????????????????',
                      },
                      maxLength: {
                        value: 20,
                        message: '20???????????????????????????',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="family_name_kana"
                        label="??????"
                        variant="outlined"
                        type="text"
                        placeholder="?????????"
                        required
                        size={'small'}
                        fullWidth
                        error={!!errors.family_name_kana}
                      />
                    )}
                  />
                  <p className={classes.err}>
                    {!!errors.family_name_kana && (
                      <FormErrorMessage msg={errors.family_name_kana.message} />
                    )}
                  </p>
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    control={control}
                    name="given_name_kana"
                    rules={{
                      required: {
                        value: true,
                        message: '?????????????????????',
                      },
                      pattern: {
                        value: strPatterns.katakana,
                        message: '??????????????????(??????????????????)?????????????????????',
                      },
                      maxLength: {
                        value: 20,
                        message: '20???????????????????????????',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="given_name_kana"
                        label="??????"
                        variant="outlined"
                        type="text"
                        placeholder="?????????"
                        required
                        size={'small'}
                        fullWidth
                        error={!!errors.given_name_kana}
                      />
                    )}
                  />
                  <p className={classes.err}>
                    {!!errors.given_name_kana && (
                      <FormErrorMessage msg={errors.given_name_kana.message} />
                    )}
                  </p>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="file"
                    render={({ field }) => (
                      <div {...field}>
                        <input
                          type="file"
                          accept="image/svg+xml,.png,.jpg,.jpeg,.gif"
                          className={classes.none}
                          id="thumbnail"
                          name="file"
                          multiple
                          onChange={handlePreview.bind(null)}
                        />
                        <label htmlFor="thumbnail">
                          <FacePaper preview={preview} />
                        </label>
                        <Controller
                          control={control}
                          name="delete_flag"
                          render={({ field }) => (
                            <FormControlLabel
                              {...field}
                              control={
                                <Checkbox
                                  checked={getValues('delete_flag')}
                                  onChange={handleDeleteFlag}
                                  name="delete_flag"
                                  color="primary"
                                  size={'small'}
                                />
                              }
                              label="????????????????????????"
                              className={classes.subFlag}
                            />
                          )}
                        />
                      </div>
                    )}
                  />
                  <p className={classes.err}>
                    {!!errors.file && (
                      <FormErrorMessage msg={errors.file.message} />
                    )}
                  </p>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions className={classes.footer}>
              <div className={classes.wrap}>
                <CircularButton
                  loading={loading}
                  onClick={handleSubmit(handleUpdate)}
                />
              </div>
            </CardActions>
          </form>
        </Card>
      </section>
      <CustomAlert alertStatus={alertStatus} setAlertStatus={setAlertStatus} />
    </MypageLayout>
  )
}

export default Profile
