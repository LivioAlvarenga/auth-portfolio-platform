export const keyframes = {
  enterFromTop: {
    from: { opacity: '0', transform: 'translateY(200px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  exitToTop: {
    from: { opacity: '1', transform: 'translateY(0)' },
    to: { opacity: '0', transform: 'translateX(200px)' },
  },
  enterFromLeft: {
    from: { opacity: '0', transform: 'translateX(-200px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  exitToLeft: {
    from: { opacity: '1', transform: 'translateX(0)' },
    to: { opacity: '0', transform: 'translateX(-200px)' },
  },
  enterFromBottom: {
    from: { opacity: '0', transform: 'translateY(-200px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  exitToBottom: {
    from: { opacity: '1', transform: 'translateY(0)' },
    to: { opacity: '0', transform: 'translateY(200px)' },
  },
  enterFromRight: {
    from: { opacity: '0', transform: 'translateX(200px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  exitToRight: {
    from: { opacity: '1', transform: 'translateX(0)' },
    to: { opacity: '0', transform: 'translateX(200px)' },
  },
  scaleIn: {
    from: { opacity: '0', transform: 'rotateX(-10deg) scale(0.9)' },
    to: { opacity: '1', transform: 'rotateX(0deg) scale(1)' },
  },
  scaleOut: {
    from: { opacity: '1', transform: 'rotateX(0deg) scale(1)' },
    to: { opacity: '0', transform: 'rotateX(-10deg) scale(0.95)' },
  },
  fadeIn: {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  fadeOut: {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },
  slideIn: {
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0)' },
  },
  slideOut: {
    from: { transform: 'translateY(0)' },
    to: { transform: 'translateY(-100%)' },
  },
  bounceOpacity: {
    '0%': { opacity: '1' },
    '50%': { opacity: '0.2' },
    '100%': { opacity: '1' },
  },
  ripple: {
    from: { transform: 'scale(1)', opacity: '1' },
    to: { transform: 'scale(4)', opacity: '0' },
  },
}

export const animation = {
  scaleIn: 'scaleIn 200ms ease',
  scaleOut: 'scaleOut 200ms ease',
  fadeIn: 'fadeIn 200ms ease',
  fadeOut: 'fadeOut 200ms ease',
  enterFromTop: 'enterFromTop 250ms ease',
  exitToTop: 'exitToTop 250ms ease',
  enterFromLeft: 'enterFromLeft 250ms ease',
  exitToLeft: 'exitToLeft 250ms ease',
  enterFromBottom: 'enterFromBottom 250ms ease',
  exitToBottom: 'exitToBottom 250ms ease',
  enterFromRight: 'enterFromRight 250ms ease',
  exitToRight: 'exitToRight 250ms ease',
  slideIn: 'slideIn 200ms ease-out',
  slideOut: 'slideOut 200ms ease-out',
  bounceOpacityOne: 'bounceOpacity 1500ms ease-in-out 0ms infinite',
  bounceOpacityTwo: 'bounceOpacity 1500ms ease-out 375ms infinite',
  bounceOpacityThree: 'bounceOpacity 1500ms ease-in-out 700ms infinite',
  ripple: 'ripple 300ms linear',
}

export const transitionDuration = {
  '1200': '1200ms',
  '1500': '1500ms',
  '1800': '1800ms',
  '2000': '2000ms',
  '2500': '2500ms',
  '3000': '3000ms',
}
