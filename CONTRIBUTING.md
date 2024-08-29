# Contribuindo para o Auth Portfolio Platform

Primeiramente, agradecemos por considerar contribuir para o **Auth Portfolio Platform**! 🎉

Este guia irá ajudar você a entender como contribuir de maneira eficaz e eficiente. Seja você um desenvolvedor experiente ou alguém que está começando, todas as contribuições são bem-vindas.

## Como Contribuir

### 1. Reporte Problemas

Se você encontrou um bug, tem uma sugestão ou quer solicitar uma nova funcionalidade, por favor, abra uma [issue](https://github.com/LivioAlvarenga/auth-portfolio-platform/issues). Certifique-se de fornecer detalhes suficientes para que possamos entender e reproduzir o problema.

### 2. Discuta e Proponha Melhorias

Antes de começar a trabalhar em uma nova funcionalidade ou em uma correção, verifique se há uma issue aberta relacionada. Caso não exista, você pode abrir uma nova issue para discutir a mudança proposta. Isso ajuda a garantir que o trabalho esteja alinhado com a visão do projeto e evita esforços duplicados.

### 3. Contribua com Código

#### Estrutura de Branches

Utilizamos uma estratégia simples de branch para novas funcionalidades:

- **`main`**: Branch principal, contendo o código de produção.
- **`feature/nome-da-feature`**: Crie uma nova branch a partir da `main` para cada nova funcionalidade ou correção de bug. Nomeie a branch de forma descritiva.

**Nota:** A `main` deve estar sempre pronta para ser implantada em produção.

#### Passos para Contribuir

1. **Fork o Repositório**: Crie um fork do repositório para o seu próprio GitHub.

2. **Clone o Repositório**: Clone o fork para o seu ambiente de desenvolvimento local.

   ```bash
   git clone https://github.com/seu-usuario/auth-portfolio-platform.git
   cd auth-portfolio-platform
   ```

3. **Crie uma Branch**: Crie uma nova branch para a funcionalidade ou correção que você deseja implementar.

   ```bash
   git checkout -b feature/nome-da-feature
   ```

4. **Implemente as Mudanças**: Adicione suas alterações ou novas funcionalidades. Certifique-se de seguir os princípios SOLID e o estilo de código estabelecido.

5. **Teste suas Alterações**: Execute todos os testes para garantir que suas mudanças não quebrem nada.

   ```bash
   npm run test
   ```

6. **Commite suas Mudanças**: Escreva mensagens de commit claras e concisas, seguindo o padrão de [Conventional Commits](https://www.conventionalcommits.org/). Exemplo:

   ```bash
   git commit -m "feat: adiciona autenticação com Facebook"
   ```

7. **Envie para o seu Fork**:

   ```bash
   git push origin feature/nome-da-feature
   ```

8. **Abra um Pull Request**: No GitHub, vá para o seu fork e abra um Pull Request (PR) para a branch `main` do repositório original. Descreva suas mudanças e vincule qualquer issue relacionada.

### 4. Código de Conduta

Este projeto segue um [Código de Conduta](./CODE_OF_CONDUCT.md). Ao participar, você está concordando em segui-lo.

### Estilo de Código

- **Linting**: O projeto utiliza ESLint e Prettier para garantir a consistência do código. Por favor, execute `npm run lint:eslint:check` e `npm run lint:prettier:check` antes de enviar o PR.

- **Testes**: Certifique-se de adicionar ou atualizar testes para cobrir suas mudanças. Os testes são uma parte crítica do nosso processo de CI/CD e são necessários para que seu PR seja aceito.

- **Commitlint**: Utilizamos o Commitlint para garantir que as mensagens de commit sigam os padrões do [Conventional Commits](https://www.conventionalcommits.org/). Isso é verificado automaticamente nos PRs.

### Fluxo de CI/CD

O projeto utiliza GitHub Actions para CI/CD:

- **Teste de Commits**: Antes de fazer merge, todos os commits são verificados quanto ao estilo e conformidade usando Husky e Commitlint.

- **Linting e Formatação**: O código é verificado automaticamente quanto à formatação e aos padrões de linting antes do merge.

- **Testes Automatizados**: Todos os testes são executados automaticamente. O merge só será permitido se todos os testes passarem.

### Dúvidas?

Se você tiver qualquer dúvida sobre o processo de contribuição, não hesite em abrir uma [issue](https://github.com/LivioAlvarenga/auth-portfolio-platform/issues) ou entrar em contato diretamente por [email](mailto:livioalvarenga@gmail.com).

Agradecemos mais uma vez por sua contribuição! 💪🚀
