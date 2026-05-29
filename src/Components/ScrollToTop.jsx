import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const getScrollTargets = () => {
  if (typeof document === 'undefined') {
    return []
  }

  const targets = new Set()
  const root = document.getElementById('root')

  if (document.scrollingElement) {
    targets.add(document.scrollingElement)
  }

  targets.add(document.documentElement)
  targets.add(document.body)

  const scope = root ?? document.body

  if (scope) {
    scope.querySelectorAll('*').forEach((element) => {
      const style = window.getComputedStyle(element)
      const overflowY = style.overflowY

      if (
        element.scrollHeight > element.clientHeight &&
        ['auto', 'scroll', 'overlay'].includes(overflowY)
      ) {
        targets.add(element)
      }
    })
  }

  return Array.from(targets)
}

const scrollToTop = (target) => {
  if (!target) {
    return
  }

  if (typeof target.scrollTo === 'function') {
    target.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
    return
  }

  target.scrollTop = 0
  target.scrollLeft = 0
}

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    scrollToTop(window)

    getScrollTargets().forEach((target) => {
      if (target !== window) {
        scrollToTop(target)
      }
    })
  }, [pathname])

  return null
}

export default ScrollToTop