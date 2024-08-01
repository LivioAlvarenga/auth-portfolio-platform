export function getBaseUrl() {
  return process.env.VERCEL_ENV === 'production'
    ? `https://adm.produtivese.com.br`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:3000`
}
