/**
 * Retorna a URL base adequada dependendo do ambiente (frontend ou backend).
 *
 * No frontend:
 * - Retorna uma string vazia para que a URL base seja relativa, permitindo que as requisições
 *   API sejam feitas no mesmo domínio, o que evita problemas de CORS (Cross-Origin Resource Sharing).
 *
 * No backend:
 * - Verifica a variável de ambiente `VERCEL_ENV` para determinar se está em produção.
 *   - Se estiver em produção, retorna a URL base do domínio de produção.
 *   - Se não estiver em produção, verifica se a variável `VERCEL_URL` está definida.
 *     - Se `VERCEL_URL` estiver definida, retorna a URL com o subdomínio gerado pelo Vercel.
 *     - Se `VERCEL_URL` não estiver definida, assume que está em desenvolvimento local e retorna `http://localhost:3000`.
 *
 * @returns {string} A URL base apropriada para o ambiente atual.
 */
export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Estamos no frontend, retorna uma string vazia para que a URL base seja relativa.
    return ''
  }

  // Estamos no backend (Node.js), retorna a URL base do ambiente.
  return process.env.VERCEL_ENV === 'production'
    ? `https://adm.produtivese.com.br`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:3000`
}
