import Link from 'next/link'
import { AppBar, Typography, Toolbar, IconButton } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { AvatarMenu } from '@/components/molecules'
import clsx from 'clsx'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { UserModel } from '@/interfaces'
import { drawerWidth } from '@/lib/util'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    toolBarWrap: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    toolBar: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    title: {
      flexGrow: 1,
    },
  })
)

interface Props {
  user: UserModel | []
  toggleMenu: () => void
}

const MypageHeader = ({ user, toggleMenu }: Props) => {
  const classes = useStyles()
  const handleDrawerToggle = () => {
    toggleMenu()
  }

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <div className={classes.toolBarWrap}>
        <Toolbar className={clsx([classes.toolBar, 'container'])}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            <Link href="/">{process.env.NEXT_PUBLIC_SITE_NAME}</Link>
          </Typography>
          {!Array.isArray(user) && <AvatarMenu user={user} />}
        </Toolbar>
      </div>
    </AppBar>
  )
}

export default MypageHeader
