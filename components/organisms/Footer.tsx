import React from 'react'
import styles from '@/assets/scss/Module/footer.module.scss'
import { Box, Typography } from '@material-ui/core'
import Link from '@material-ui/core/Link'
import { BIRTH_DAY, APP_URL } from '@/lib/util'
import { makeStyles } from '@material-ui/core/styles'
import { useLocale } from '@/hooks'

const useStyles = makeStyles(() => ({
  logoby: {
    position: 'absolute',
    pointerEvents: 'none',
    color: 'transparent',
  },
}))

const Footer = () => {
  const classes = useStyles()
  const { t } = useLocale()
  const Copyright = () => {
    return (
      <Typography variant="body2" align="center">
        {'Copyright © '}
        <Link color="inherit" href={APP_URL}>
          {t.siteTitle}
        </Link>{' '}
        {new Date(BIRTH_DAY).getFullYear()}
        {' - '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    )
  }

  return (
    <footer className={styles.footer}>
      <div className="u-container">
        <Copyright />
        <Box className={classes.logoby}>
          Logo created by{' '}
          <a href="https://www.designevo.com/" title="Free Online Logo Maker">
            DesignEvo logo maker
          </a>
        </Box>
      </div>
    </footer>
  )
}

export default Footer
