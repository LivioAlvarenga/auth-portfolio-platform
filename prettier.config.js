module.exports = {
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
  tailwindFunctions: ['tw', 'clsx', 'twMerge', 'cva', 'cn', 'tv'],
  printWidth: 80, // Limite de colunas
  tabWidth: 2, // Tamanho da tabulação
  singleQuote: true, // Usa aspas simples
  trailingComma: 'all', // Adiciona vírgula no último item
  arrowParens: 'always', // Adiciona parênteses nas arrow functions
  semi: false, // Remove os pontos e vírgulas
  endOfLine: 'lf', // Define o fim de linha
}
