import React, { useState } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, IconButton, Popover, Tooltip } from '@material-ui/core'
import { useLocale } from '@/hooks'
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined'

const useStyles = makeStyles((theme: Theme) => ({
  help: {
    color: theme.palette.text.hint,
  },
  helpText: {
    color: theme.palette.text.hint,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    lineHeight: 2,
  },
  popover: {
    // pointerEvents: 'none',
  },
  helpPaper: {
    padding: theme.spacing(1),
  },
  item: {
    paddingLeft: theme.spacing(2),
  },
}))

export type Props = {
  children?: React.ReactNode
  point?: React.ReactNode
  tooltip?: string
}

const HelpBox = ({ children, point, tooltip = '' }: Props) => {
  const classes = useStyles()
  const [helpEl, setHelpEl] = useState<HTMLElement | null>(null)
  const handleHelpOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setHelpEl(event.currentTarget)
  }

  const { t } = useLocale()

  const handleHelpClose = () => {
    setHelpEl(null)
  }
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setHelpEl(event.currentTarget)
  }

  const helpOpen = Boolean(helpEl)

  return (
    <div style={{ display: 'inline-block' }}>
      <Tooltip title={tooltip}>
        <Typography
          aria-owns={helpOpen ? 'simple-popover' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          // onMouseEnter={handleHelpOpen}
          // onMouseLeave={handleHelpClose}
        >
          {point !== undefined ? (
            point
          ) : (
            <IconButton
              color="inherit"
              aria-label="help"
              component="span"
              size="small"
              className={classes.help}
            >
              <HelpOutlineOutlinedIcon />
            </IconButton>
          )}
        </Typography>
      </Tooltip>
      <Popover
        id="simple-popover"
        className={classes.popover}
        classes={{
          paper: classes.helpPaper,
        }}
        open={helpOpen}
        anchorEl={helpEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleHelpClose}
        disableRestoreFocus
      >
        {children !== undefined ? (
          children
        ) : (
          <Typography className={classes.helpText} component={'div'}>
            <p>{t.label.passwordRule}</p>
            <ul>
              {t.rule.password.map((rule, index) => (
                <li className={classes.item} key={`rule_${index}`}>
                  {rule}
                </li>
              ))}
              {/* <li className={classes.item}>
                &#9313; ?????????[A???Z]?????????1???????????????
              </li>
              <li className={classes.item}>
                &#9314; ?????????[a???z]?????????1???????????????
              </li>
              <li className={classes.item}>
                &#9315; ??????[0???9]?????????1???????????????
              </li> */}
              {/* <li className={classes.item}>
                ?????????????????????????????????-????????????????????????_??????????????????????????????=????????????????????????????????????????????????????
              </li> */}
            </ul>
          </Typography>
        )}
      </Popover>
    </div>
  )
}

export default HelpBox
