import React, { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    opacity: 0,
  },
  show: {
    animation: '$fadeIn forwards 1s 3s',
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '67%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
}))

type Props = {
  children: React.ReactNode
  optionClasses?: any
  className?: any
}

const AnimationBoxByScroll = ({
  children,
  optionClasses,
  className,
}: Props) => {
  const [isReached, setIsReached] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)
  const classes = { ...useStyles(), ...optionClasses }

  const handleShow = () => {
    if (!ref) {
      return false
      // console.log(rect)
      // console.log(window.scrollY)
      // console.log(window.scrollY + window.innerHeight)
    }

    const rect = ref.current!.getBoundingClientRect().top
    console.log(rect < window.scrollY + window.innerHeight)
    if (rect < window.scrollY + window.innerHeight) {
      setIsReached(true)
    }

    // const current = window.scrollY + window.innerHeight
    // if (ref !== null && current > ref.current!.offsetTop) {
    // }
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      window.addEventListener('scroll', handleShow)
    }
    return () => {
      window.removeEventListener('scroll', handleShow)
      isMounted = false
    }
  }, [setIsReached])

  return (
    <div
      ref={ref}
      className={clsx([classes.root, className], {
        [classes.show]: isReached,
      })}
    >
      {children}
    </div>
  )
}

export default AnimationBoxByScroll
