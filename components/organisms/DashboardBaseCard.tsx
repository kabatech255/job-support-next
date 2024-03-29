import React from 'react'
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import Link from 'next/link'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from '@material-ui/core'
import { Header, FooterLink } from '@/interfaces/common/dashboard'
import { ScheduleIcon } from '@/components/atoms/icons'
import { linerGradient } from '@/assets/color/gradient'
import { CustomLoader } from '@/components/molecules'
import { useLocale } from '@/hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerRoot: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
    },
    headerColor: {
      background: linerGradient.primary,
      color: theme.palette.common.white,
    },
    subHeaderColor: {
      color: theme.palette.common.white,
    },
    content: {
      marginTop: theme.spacing(8),
      padding: '16px 0',
    },
    scroll: {
      overflowX: 'scroll',
    },
    footer: {
      padding: '8px 0',
    },
    linkColor: {},
    loaderColor: {
      color: theme.palette.primary.main,
    },
  })
)

type Props = {
  header: Header
  children: React.ReactNode
  footerLink: FooterLink
  wrapClasses?: any
  classes?: any
  scroll?: boolean
  loading?: boolean
}

const DashboardBaseCard = ({
  header,
  children,
  footerLink,
  wrapClasses,
  classes,
  scroll,
  loading,
}: Props) => {
  const defaultClasses = { ...useStyles(), ...classes }
  const { t } = useLocale()

  return (
    <Card className={wrapClasses}>
      <CardHeader
        title={header.title}
        titleTypographyProps={{
          variant: 'h6',
        }}
        subheader={header.subTitle}
        avatar={header.avatar}
        classes={{
          root: defaultClasses.headerRoot,
          subheader: defaultClasses.subHeaderColor,
        }}
        className={defaultClasses.headerColor}
      />
      <CardContent
        className={clsx(defaultClasses.content, {
          [defaultClasses.scroll]: !!scroll,
        })}
      >
        {loading !== undefined && !!loading ? (
          <CustomLoader colorClasses={{ root: defaultClasses.loaderColor }} />
        ) : (
          children
        )}
      </CardContent>

      <CardActions
        disableSpacing
        classes={{
          root: defaultClasses.footer,
        }}
      >
        <Link href={footerLink.to} passHref>
          <Button
            variant={'outlined'}
            color={footerLink.color}
            size={'small'}
            className={defaultClasses.linkColor}
          >
            {footerLink.text || t.common.more}
          </Button>
        </Link>
      </CardActions>
    </Card>
  )
}

DashboardBaseCard.propTypes = {
  header: PropTypes.object,
  footerLink: PropTypes.object,
}

DashboardBaseCard.defaultProps = {
  header: {
    avatar: <ScheduleIcon />,
    title: 'メインタイトル',
    subTitle: 'サブタイトル',
  },
  footerLink: {
    to: '/',
    color: 'primary',
    text: 'more',
  },
}

export default DashboardBaseCard
