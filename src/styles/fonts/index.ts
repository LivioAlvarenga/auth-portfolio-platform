import { Roboto } from 'next/font/google'
// import localFont from 'next/font/local'

const sans400 = Roboto({
  variable: '--font-sans400',
  display: 'swap',
  weight: '400',
  subsets: ['latin'],
})

const sans500 = Roboto({
  variable: '--font-sans500',
  display: 'swap',
  weight: '500',
  subsets: ['latin'],
})

const sans700 = Roboto({
  variable: '--font-sans700',
  display: 'swap',
  weight: '700',
  subsets: ['latin'],
})

export { sans400, sans500, sans700 }
