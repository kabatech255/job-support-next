import React, { useContext, useEffect, useState, useRef, useMemo } from 'react'
import { AuthContext } from '@/provider/AuthProvider'
import { useRouter } from 'next/router'
import Link from 'next/link'
import clsx from 'clsx'
import { Theme, makeStyles, lighten } from '@material-ui/core/styles'
import { Badge, IconButton, Tooltip, Typography } from '@material-ui/core'
import {
  ClickAwayListener,
  Divider,
  Grow,
  MenuList,
  MenuItem,
  Paper,
  Popper,
} from '@material-ui/core'
import NotificationsIcon from '@material-ui/icons/Notifications'
import { Activity } from '@/interfaces/models'
import { requestUri, putRequest } from '@/api'
import { useAuth, useInitialConnector } from '@/hooks'

const useStyles = makeStyles((theme: Theme) => ({
  menuBox: {
    maxWidth: 250,
    maxHeight: 200,
    overflowY: 'scroll',
  },
  row: {
    '&:nth-of-type(even) > .MuiListItem-root': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  item: {
    whiteSpace: 'pre-wrap',
    fontSize: theme.typography.overline.fontSize,
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightBold,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  badge: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
  },
  white: {
    color: theme.palette.common.white,
  },
  unread: {
    backgroundColor: lighten(theme.palette.primary.light, 0.8),
  },
}))

// eslint-disable-next-line react/display-name
const NotificationIcon = React.memo(() => {
  const classes = useStyles()
  const router = useRouter()
  const { auth, config } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  useInitialConnector<Activity[]>({
    path: requestUri.activity.myRecently.replace(':id', String(auth.user.id)),
    onSuccess: (res) => setActivities(res),
    condition: auth.user.is_initialized,
  })
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const read = async () => {
    await putRequest<any, {}>(
      requestUri.activity.read.replace(':id', String(auth.user.id)),
      {},
      undefined,
      config
    ).then((res) => {})
  }

  const handleIcon = async () => {
    handleToggle()
    if (unreadCount > 0 && !open) {
      await read()
    }
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }
    setOpen(false)
  }

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()

      setOpen(false)
    }
  }

  const handleItem = async (link: string, e: React.MouseEvent<EventTarget>) => {
    e.preventDefault()
    handleClose(e)
    router.push(link)
  }

  const unreadCount = useMemo(
    () =>
      activities.reduce((count, activity) => {
        return count + (!activity.is_read ? 1 : 0)
      }, 0),
    [activities]
  )

  return (
    <div>
      <Tooltip title={'???????????????'}>
        <IconButton
          ref={anchorRef}
          aria-controls={open ? 'notification-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleIcon}
          component="span"
          disableRipple
          size={'small'}
        >
          <Badge
            overlap="circular"
            badgeContent={unreadCount}
            variant="dot"
            color="default"
            classes={{
              badge: classes.badge,
            }}
          >
            <NotificationsIcon color={'inherit'} className={classes.white} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper className={classes.menuBox}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                  disablePadding
                >
                  {activities.length > 0 ? (
                    activities.map((activity, index) => (
                      <Link
                        href={activity.replaced_link}
                        passHref
                        key={activity.id}
                      >
                        <a
                          onClick={handleItem.bind(
                            null,
                            activity.replaced_link
                          )}
                          className={classes.row}
                        >
                          <MenuItem
                            divider
                            className={clsx(classes.item, {
                              [classes.unread]: !activity.is_read,
                            })}
                          >
                            {activity.content}
                          </MenuItem>
                        </a>
                      </Link>
                    ))
                  ) : (
                    <Typography style={{ padding: 8 }}>
                      ???????????????????????????
                    </Typography>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
})

export default NotificationIcon
