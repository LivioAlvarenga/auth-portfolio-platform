export const prepositions = [
  'd',
  'de',
  'do',
  'da',
  'dos',
  'das',
  'e',
  'o',
  'a',
  'os',
  'as',
  'às',
  'no',
  'na',
  'nos',
  'nas',
]

const offensiveTerms = [
  'a coisa tá preta',
  'barriga suja',
  'boçal',
  'cabelo ruim',
  'chuta que é macumba',
  'cor de pele',
  'criado-mudo',
  'crioulo',
  'da cor do pecado',
  'denegrir',
  'dia de branco',
  'disputar a negra',
  'esclarecer',
  'escravo',
  'estampa étnica',
  'feito nas coxas',
  'galinha de macumba',
  'humor negro',
  'inhaca',
  'inveja branca',
  'lista negra',
  'macumbeiro',
  'magia negra',
  'meia-tigela',
  'mercado negro',
  'mulata',
  'mulata tipo exportação',
  'não sou tuas negas',
  'nasceu com um pé na cozinha',
  'nega maluca',
  'negra com traços finos',
  'negra de beleza exótica',
  'negro de alma branca',
  'ovelha negra',
  'preto de alma branca',
  'quando não está preso está armado',
  'samba do crioulo doido',
  'serviço de preto',
  'teta de nega',
  'volta pro mar, oferenda',
  'bicha',
  'boquete',
  'cacete',
  'caralho',
  'cu',
  'cú',
  'cuzão',
  'foda',
  'foda-se',
  'foder',
  'nem fodendo',
  'olho do cú',
  'pau',
  'pica',
  'porra',
  'porra nenhuma',
  'pra caralho',
  'puta merda',
  'puta que pariu',
  'punheta',
  'que porra é essa',
  'sacanagem',
  'siririca',
  'teu cu',
  'trepar',
  'xoxota',
]

export const containsOffensiveTerms = (value: string) => {
  return offensiveTerms.some((term) =>
    value.toLowerCase().includes(term.toLowerCase()),
  )
}

// Regex to detect URLs
export const containUrl = (value: string) =>
  /(https?:\/\/|www\.)([\w\d-]+\.)*[\w-]+[.:]\w+(\/[=?&#.]?[\w-]+)*\/?/.test(
    value,
  )

// Protect against SQL Injection
// This function checks for common SQL injection patterns in a given string. It looks for SQL keywords like 'union', 'select', 'insert', 'delete', 'update', 'drop', and 'alter', as well as potentially malicious sequences like "';", "-- ", and attempts to comment out the rest of a query. The goal is to detect and prevent SQL injection attempts, which can compromise database security by allowing attackers to execute arbitrary SQL code.
export const containSqlInjection = (value: string) =>
  /(\b(union|select|insert|delete|update|drop|alter)\b|';|-- |\bOR\b\s+'?\d+'?\s*=\s*'|\/\*|\*\/)/i.test(
    value,
  )

// Protect against XSS
// This function aims to detect potential Cross-Site Scripting (XSS) attacks by examining a given string for HTML tags that could be used maliciously, while allowing safe tags like <br>, <strong>, and <a href="...">. XSS attacks involve injecting malicious scripts into webpages viewed by other users, leading to a variety of security problems such as stolen session cookies or personal data.
export const containXss = (value: string) =>
  /<(?!br\s*\/?\s*)(?!strong\s*\/?\s*)(?!\/strong\s*)(?!a\s+href="[^"]*"\s*\/?\s*)(?!\/a\s*)[^>]+>/gi.test(
    value,
  )
