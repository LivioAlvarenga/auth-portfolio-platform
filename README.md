<h1 align="center">
	🔐 Auth Portfolio Platform - Segurança e Escalabilidade para Aplicações Modernas 🚀
</h1>

<p align="center">
 <a href="#-sobre-o-projeto">Sobre</a> •
 <a href="#-tecnologias">Tecnologias</a> •
 <a href="#-emails">Emails</a> •
 <a href="#-pastas">Estrutura de Pastas</a> •
 <a href="#-script">Scripts</a> •
 <a href="#-db">Banco de Dados</a> •
 <a href="#-v-ambiente">Variáveis de Ambiente</a> •
 <a href="#-designer-system">Designer System</a> •
 <a href="#-tests">Testes</a> •
 <a href="#-ci">CD/CI</a> •
 <a href="#-solid">Princípios SOLID</a> •
 <a href="#-auth">Porque o AuthJs</a> •
 <a href="#-autor">Autor</a> •
 <a href="#-licença">Licença</a>
</p>

&nbsp;
<a id="-sobre-o-projeto"></a>

## 💻 Sobre o projeto

&nbsp;
<img src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/login-desktop-screen-auth-portfolio-platform.JPG" alt="Tela de Login - Auth Portfolio Platform" align="center" />

&nbsp;

O **Auth Portfolio Platform** é uma solução de autenticação robusta e escalável, projetada para atender às necessidades de aplicações modernas. Este projeto foi criado com o objetivo de fornecer uma alternativa open source a sistemas de autenticação complexos, permitindo que desenvolvedores integrem facilmente autenticação via email e senha, autenticação com providers populares como Google e GitHub, e login via magic link.

Desenvolvido com uma arquitetura baseada em princípios SOLID e TDD, o projeto segue as melhores práticas de desenvolvimento, garantindo segurança e performance. A gestão de sessões é feita diretamente no banco de dados PostgreSQL, permitindo um controle preciso sobre as sessões dos usuários, incluindo dados detalhados sobre dispositivos e navegadores utilizados.

O projeto é open source e licenciado sob a MIT License, encorajando a comunidade a contribuir para sua evolução e aprimoramento contínuos. Nosso objetivo é criar uma plataforma de autenticação que não dependa de soluções SaaS, dando mais liberdade e controle aos desenvolvedores.

&nbsp;

<p align="center">
  <a href="#license"><img src="https://img.shields.io/github/license/LivioAlvarenga/auth-portfolio-platform?color=ff0000"></a>
  <a href="https://github.com/LivioAlvarenga/auth-portfolio-platform/issues"><img src="https://img.shields.io/github/issues/LivioAlvarenga/auth-portfolio-platform" alt="issue site auth-portfolio-platform" /></a>
  <a href="https://github.com/LivioAlvarenga/auth-portfolio-platform"><img src="https://img.shields.io/github/languages/count/LivioAlvarenga/auth-portfolio-platform" alt="total amount of programming languages used in the project" /></a>
  <a href="https://github.com/LivioAlvarenga/auth-portfolio-platform"><img src="https://img.shields.io/github/languages/top/LivioAlvarenga/auth-portfolio-platform" alt="most used language in the projects" /></a>
  <a href="https://github.com/LivioAlvarenga/auth-portfolio-platform"><img src="https://img.shields.io/github/repo-size/LivioAlvarenga/auth-portfolio-platform" alt="repository size" /></a>
<p>

<p align="center">
  <a href= "https://auth-portfolio.livioalvarenga.com.br/"><img alt="deploy badge Vercel" height=40 src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/vercel-badge.svg?t=2024-08-28T19%3A06%3A38.548Z"></a>
<p>

|    ![Tela de Login - Auth Portfolio Platform](https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/register-screen.JPG)     | ![Tela de Login - Auth Portfolio Platform](https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/verify-email-opt-screen.JPG) |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| ![Tela de Login - Auth Portfolio Platform](https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/forgot-password-screen.JPG) |  ![Tela de Login - Auth Portfolio Platform](https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/reset-password-screen.JPG)  |

&nbsp;
<a id="-tecnologias"></a>

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto

&nbsp;

<p align="center">
  <!-- <a href= ""><img alt="" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=ECD53F&logo=.ENV&label=Managing Environment Variables&message=.ENV&color=ECD53F"></a> -->
  <a href= "https://nodejs.org/en/" target="_blank" rel="noopener noreferrer"><img alt="Node.js badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/nodejs-badge.svg"></a>
  <a href= "https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer"><img alt="TypeScript badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/typescript-badge.svg"></a>
  <a href= "https://www.javascript.com/" target="_blank" rel="noopener noreferrer"><img alt="JavaScript badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/javascript-badge.svg"></a>
  <a href= "https://nextjs.org/" target="_blank" rel="noopener noreferrer"><img alt="NextJs badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/nextjs-badge.svg"></a>
  <a href= "https://pt-br.legacy.reactjs.org/" target="_blank" rel="noopener noreferrer"><img alt="ReactJs badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/react-badge.svg"></a>
  <a href= "https://react-hook-form.com/" target="_blank" rel="noopener noreferrer"><img alt="React Hook Form badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/reactHookForm-badge.svg"></a>
  <a href= "https://html5.org/"><img alt="HTML5 badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/html-badge.svg"></a>
  <a href= "https://www.w3.org/Style/CSS/Overview.en.html"><img alt="CSS badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/css-badge.svg"></a>
  <a href= "https://tailwindcss.com/"><img alt="Tailwindcss badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/tailwindcss-badge.svg"></a>
  <a href= "https://www.radix-ui.com/"><img alt="Radix Ui badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/radix-ui-badge.svg"></a>
  <a href= "https://ui.shadcn.com/"><img alt="Shadcn Ui badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/shadcnui-badge.svg"></a>
  <a href= "https://zod.dev/" target="_blank" rel="noopener noreferrer"><img alt="ZOD badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/zod-badge.svg"></a>
  <a href= "https://www.dotenv.org/" target="_blank" rel="noopener noreferrer"><img alt="Dotenv badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/dotenv-badge.svg"></a>
  <a href= "https://www.docker.com/"><img alt="Docker badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/docker-badge.svg"></a>
  <a href= "https://jwt.io/"><img alt="JSON Web Tokens Badge" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/jwt-badge.svg"></a>
  <a href= "https://github.com/LivioAlvarenga/auth-portfolio-platform/actions"><img alt="badge github actions" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/github-actions-badge.svg"></a>
  <a href= "https://jestjs.io/pt-BR/"><img alt="badge github actions" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/jest-badge.svg"></a>
  <a href= "https://code.visualstudio.com/download" target="_blank" rel="noopener noreferrer"><img alt="vscode download" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/vsCode-badge.svg"></a>
  <a href= "https://prettier.io/" target="_blank" rel="noopener noreferrer"><img alt="code formatter prettier" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/prettier-badge.svg"></a>
  <a href= "https://eslint.org/" target="_blank" rel="noopener noreferrer"><img alt="code standardization eslint" src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/eslint-badge.svg"></a>
</p>

&nbsp;

<a id="-emails"></a>

## ✉️ Emails

Para garantir uma comunicação eficaz e profissional com os usuários, utilizamos a biblioteca **@react-email/components** juntamente com **react-email** para criar templates de emails personalizados. Para simular o envio de emails durante o desenvolvimento, usamos o serviço [Ethereal](https://ethereal.email/), que permite testar a funcionalidade de envio de emails sem custos e sem impactar usuários reais.

|     ![Tela de Login - Auth Portfolio Platform](https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/email-welcome.png)     |   ![Tela de Login - Auth Portfolio Platform](https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/email-verify-opt.png)    |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| ![Tela de Login - Auth Portfolio Platform](https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/email-forgot-password.png) | ![Tela de Login - Auth Portfolio Platform](https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/email-password-change.png) |

### Envio de Emails

O envio dos emails é gerenciado pelo **Nodemailer**, utilizando um `transporter` configurado para enviar emails por meio do Ethereal. Criamos uma rota específica no projeto para lidar com o envio de emails, garantindo que cada tipo de email tenha seu próprio template adequado.

### Armazenamento de Emails

Para manter um histórico dos emails enviados e gerenciar os diferentes tipos de emails, criamos duas entidades no banco de dados:

- **email_logs**: Armazena um registro de todos os emails enviados, incluindo informações como destinatário, conteúdo, e status do envio.
- **email_types**: Contém os diferentes tipos de emails que podem ser enviados pelo sistema, como emails de boas-vindas, verificação de email, recuperação de senha, etc.

### Tipos de Emails Enviados

1. **Email de Boas-Vindas**: Enviado após o registro do usuário, dando as boas-vindas ao novo usuário.

2. **Verificação de Email**: Enviado juntamente com o email de boas-vindas, contendo um código OTP para validação do email. O usuário precisa inserir este código para verificar seu email e ativar a conta.

3. **Esqueci a Senha**: Enviado quando o usuário solicita a recuperação de senha. Este email contém um link que redireciona o usuário para a página de redefinição de senha.

4. **Notificação de Modificação de Senha**: Enviado para o usuário notificando que sua senha foi modificada com sucesso, garantindo que o usuário esteja ciente de mudanças em sua conta.

5. **Magic Link**: Enviado quando o usuário opta por fazer login utilizando um link mágico. O email contém um link que permite ao usuário logar-se automaticamente ao clicar nele.

---

Com essa estrutura, garantimos que todos os emails enviados pelo sistema sejam gerenciados de forma organizada e que o usuário tenha uma experiência consistente e segura ao interagir com nossa plataforma.

&nbsp;

<a id="-pastas"></a>

## 📁 Estrutura de Pastas

O projeto segue o padrão do Next.js com a estrutura baseada no diretório `src`, onde estão organizadas as principais funcionalidades da aplicação. Abaixo, uma visão geral das principais pastas e seus propósitos:

- **@types**: Contém definições de tipos TypeScript que são usadas em todo o projeto, permitindo um melhor suporte a tipagem estática.
- **app**: Diretório principal do Next.js App Router, onde estão organizadas as rotas e páginas da aplicação.
- **components**: Reúne os componentes React reutilizáveis utilizados em diferentes partes da aplicação.
- **contexts**: Armazena os contextos do React, que são responsáveis por gerenciar e compartilhar estados globais entre os componentes.
- **controllers**: Contém a lógica dos controladores, que fazem a ponte entre os casos de uso e a camada de apresentação.
- **infra**: Esta pasta agrupa a infraestrutura do projeto, como configurações de banco de dados e integrações com serviços externos.
- **lib**: Contém bibliotecas e módulos auxiliares que oferecem funcionalidades reutilizáveis em todo o projeto.
- **repositories**: Responsável pela comunicação com o banco de dados, implementando as operações de CRUD e outras interações com os dados.
- **schemas**: Armazena os esquemas de validação, geralmente utilizando Zod, para garantir a integridade dos dados em diferentes partes da aplicação.
- **styles**: Contém arquivos de estilo global e configurações relacionadas ao TailwindCSS.
- **tests**: Reúne os testes unitários e de integração para assegurar a qualidade e o funcionamento correto do código.
- **use-cases**: Define os casos de uso, que encapsulam as regras de negócios e são chamados pelos controladores.
- **utils**: Contém funções utilitárias e helpers que facilitam tarefas comuns em diversas partes do projeto.

Além dessas pastas dentro de `src`, o projeto também possui outros diretórios e arquivos na raiz, como configurações do ESLint, Prettier, Docker, e o `.env` para variáveis de ambiente.

Essa organização modular segue as melhores práticas de desenvolvimento, facilitando a manutenção, a escalabilidade e a colaboração no projeto.

&nbsp;

<a id="-script"></a>

## 📜 Scripts

Este projeto conta com uma série de scripts automatizados que facilitam o desenvolvimento, teste e manutenção da aplicação. Abaixo, você encontra uma descrição dos principais scripts disponíveis no `package.json`:

- **`dev`**: Inicia a aplicação em modo de desenvolvimento. Este script é um diferencial do projeto, pois executa uma sequência de comandos de forma automatizada:

  1. **`services:up`**: Inicia os serviços necessários via Docker Compose, como o banco de dados PostgreSQL.
  2. **`wait-for-postgres`**: Executa o script TypeScript que verifica se o PostgreSQL está pronto para aceitar conexões antes de prosseguir.
  3. **`migration:up`**: Aplica as migrações do banco de dados para garantir que a estrutura esteja atualizada.
  4. **`next dev`**: Inicia o servidor de desenvolvimento do Next.js.

  Este fluxo garante que o ambiente de desenvolvimento esteja completamente configurado e pronto para uso com apenas um comando (`npm run dev`).

- **`build`**: Compila a aplicação para produção, gerando os arquivos otimizados.
- **`start`**: Inicia a aplicação em modo de produção, utilizando os arquivos gerados pelo comando `build`.

- **`lint:prettier:check`**: Verifica o formato do código utilizando o Prettier, garantindo que ele siga as convenções definidas.

- **`lint:prettier:fix`**: Corrige automaticamente o formato do código utilizando o Prettier.

- **`lint:eslint:check`**: Executa o ESLint para verificar a conformidade do código com as regras de lint definidas.

- **`services:up`**: Sobe os serviços definidos no `docker-compose.yaml` que estão localizados na pasta `src/infra`, incluindo o banco de dados PostgreSQL.

- **`services:stop`**: Pausa os serviços que foram iniciados pelo Docker Compose.

- **`services:down`**: Derruba os serviços iniciados pelo Docker Compose e remove os contêineres.

- **`test`**: Inicia os serviços necessários via Docker e executa os testes de integração e unitários. Este comando usa `concurrently` para rodar o servidor Next.js e os testes ao mesmo tempo.

- **`test:watch`**: Executa os testes em modo de observação, reexecutando-os sempre que há mudanças no código.

- **`migration:create`**: Cria uma nova migração no diretório de migrações (`src/infra/migrations`), utilizando `node-pg-migrate`.

- **`migration:up`**: Aplica as migrações do banco de dados utilizando o ambiente de desenvolvimento.

- **`wait-for-postgres`**: Um script especial que verifica se o PostgreSQL está pronto para aceitar conexões antes de prosseguir com o fluxo de inicialização. Ele evita erros que poderiam ocorrer ao tentar aplicar migrações ou iniciar o servidor antes que o banco de dados esteja totalmente inicializado.

- **`prepare`**: Configura o Husky para gerenciar hooks de Git, garantindo que o código seja verificado e testado antes de cada commit.

- **`commit`**: Inicia o Commitizen para facilitar a padronização das mensagens de commit, seguindo as convenções estabelecidas.

### Diferencial

Um dos grandes diferenciais deste projeto é a capacidade de iniciar todo o ambiente de desenvolvimento com apenas um comando: **`npm run dev`**. Este comando automatiza toda a sequência necessária para levantar os serviços de backend, aguardar o banco de dados estar pronto, aplicar as migrações e finalmente iniciar o servidor de desenvolvimento do Next.js. Isso reduz a complexidade e evita erros comuns durante o setup do ambiente, permitindo que você foque no desenvolvimento e testes do código.

&nbsp;
<a id="-db"></a>

## 🗄️ Banco de Dados

Neste projeto, utilizamos **PostgreSQL** como nosso banco de dados principal devido à sua robustez, escalabilidade e suporte avançado a funcionalidades como transações, índices, e operações complexas. A comunicação com o banco é feita por meio do pacote `pg`, enquanto as migrações de banco de dados são gerenciadas com `node-pg-migrate`.

### Uso do Supabase

O Supabase é utilizado neste projeto exclusivamente para armazenamento de dados e arquivos (storage). Toda a lógica de autenticação e gestão de credenciais é implementada internamente no sistema, garantindo que a aplicação seja totalmente independente e não dependa de serviços externos para funcionalidades críticas.

### Estrutura de Repositórios e SOLID

A estrutura de repositórios foi projetada seguindo os princípios SOLID, particularmente o Princípio da Inversão de Dependência (Dependency Inversion Principle). Isso significa que, dentro do diretório de repositórios (`repositories`), temos implementações específicas para o PostgreSQL que seguem as interfaces definidas para cada entidade. Essa abordagem permite que o sistema seja flexível e fácil de manter. Se decidirmos trocar o banco de dados no futuro, podemos fazer isso implementando novos repositórios sem alterar o restante da aplicação.

### SQL Puro vs. ORM

Optamos por utilizar **SQL puro** em vez de um ORM (Object-Relational Mapping) para garantir o máximo de controle e flexibilidade sobre as queries executadas. Essa escolha nos permite otimizar as consultas conforme necessário, utilizar funcionalidades avançadas do PostgreSQL sem as limitações que um ORM pode impor, e manter a clareza e previsibilidade do código. Evitar um ORM também nos livra de possíveis complicações na depuração e manutenção, que muitas vezes surgem com abstrações excessivas.

### Personalização das Entidades

As entidades no projeto seguem o padrão utilizado pelo NextAuth, mas foram personalizadas para atender às necessidades específicas da aplicação. Isso inclui a implementação de funcionalidades adicionais e ajustes que garantem uma integração perfeita com nosso sistema de autenticação personalizado.

&nbsp;
<a id="-v-ambiente"></a>

## 🔐 Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para gerenciar configurações sensíveis e específicas de cada ambiente (desenvolvimento, staging, produção). Essas variáveis são armazenadas em arquivos `.env`, que permitem a configuração e o comportamento adequado da aplicação em diferentes contextos.

### Arquivo `.env.development`

No ambiente de desenvolvimento, utilizamos o arquivo `.env.development`, que contém variáveis que não apresentam riscos de segurança e são necessárias para que a aplicação funcione localmente. Esse arquivo é incluído no repositório para que todos os desenvolvedores possam facilmente configurar e executar a aplicação em suas máquinas. As variáveis configuram, por exemplo, a conexão com o banco de dados PostgreSQL local, o segredo de autenticação, o tempo de duração da sessão, entre outras. No ambiente de produção, essas variáveis são preenchidas com dados reais e sensíveis, que não são compartilhados no repositório.

### Arquivo `.env` (Ignorado)

Para proteger dados sensíveis, utilizamos o arquivo `.env`, que está incluído no `.gitignore`, garantindo que ele não seja compartilhado no repositório. Esse arquivo contém informações críticas, como credenciais de acesso a serviços externos (ex.: Google, GitHub, servidor de email). Para garantir que outros desenvolvedores saibam quais variáveis devem ser configuradas no `.env`, incluímos um arquivo `.env.example` no repositório.

### Arquivo `.env.example`

O arquivo `.env.example` serve como um guia para os desenvolvedores que precisam configurar suas próprias variáveis de ambiente locais. Ele lista todas as variáveis necessárias, mas sem os valores sensíveis, que devem ser preenchidos por cada desenvolvedor. Este exemplo inclui as variáveis necessárias para a configuração dos providers de autenticação (Google, GitHub), configuração do serviço de email, e do bucket para armazenamento de imagens. Cada desenvolvedor ou administrador deve preencher essas variáveis com os valores apropriados para seu ambiente específico.

&nbsp;
<a id="-designer-system"></a>

## 🎨 Estilização e Acessibilidade

Para este projeto, escolhemos utilizar **TailwindCSS** como a principal ferramenta de estilização devido à sua flexibilidade e facilidade de uso. Embora não tenhamos nada contra o uso de CSS puro, o Tailwind se mostrou uma escolha ideal, especialmente em conjunto com o **Next-Themes** para gestão de temas, permitindo uma integração eficiente e responsiva ao longo de toda a aplicação.

### Estrutura de Estilos

Na pasta `styles`, organizamos todos os nossos tokens de design, componentes de tipografia e configurações globais.

- **Tokens de Design**: Dentro da pasta `tokens`, criamos uma série de arquivos que definem os principais tokens de design, como cores, tamanhos de fontes, espaçamentos, e muito mais. Estes tokens são projetados para serem facilmente integrados com o TailwindCSS, estendendo sua configuração para suportar o design system específico do projeto.

- **Componente Text**: Desenvolvemos um componente `Text` que utiliza a biblioteca `tailwind-variants`, permitindo a aplicação de estilos de texto de forma dinâmica e responsiva. Este componente facilita a aplicação de tipografia consistente em toda a aplicação, com variantes configuradas para ajustar automaticamente os tamanhos de fontes de acordo com o dispositivo (mobile, tablet, desktop). Além disso, ele é altamente flexível, permitindo a personalização de classes e a escolha da tag HTML utilizada para renderização.

### Design Responsivo

O design do projeto foi pensado para ser completamente responsivo, adaptando-se perfeitamente desde dispositivos móveis até desktops. O uso de **TailwindCSS** em conjunto com nossos tokens de design permite que as classes sejam organizadas e padronizadas de maneira eficiente, utilizando o plugin `prettier-plugin-tailwindcss` para manter a consistência do código.

### Temas Light e Dark

Com o **Next-Themes**, oferecemos suporte completo a temas claro e escuro, proporcionando uma experiência de usuário agradável e adaptável às preferências de cada um. Todos os tokens e configurações foram projetados para se integrar perfeitamente com esta funcionalidade, garantindo uma transição suave entre os temas.

| ![Tela de Boas-Vindas](https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/register-screen.JPG) | ![Tela de Verificação de Email](https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/register-screen-dark.JPG) |
| :---------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------: |

### Acessibilidade

A acessibilidade foi uma prioridade na construção deste projeto. Nosso design system foi criado com base em componentes do **shadcn/ui**, que oferece uma vasta gama de componentes altamente acessíveis. A escolha do Shadcn foi baseada na sua excelência em acessibilidade e na facilidade de integração com o TailwindCSS e o Next-Themes. O resultado é uma interface clean, funcional e fácil de manter, garantindo que todos os usuários possam interagir com a aplicação de maneira eficiente.

O **Shadcn/UI** juntamente com nosso design system proporciona uma interface não só bonita, mas também funcional e acessível para todos os usuários, independentemente do dispositivo que estão utilizando.

Em resumo, a combinação de **TailwindCSS**, **Next-Themes**, e **shadcn/ui** nos permitiu criar uma aplicação que é tanto esteticamente agradável quanto altamente funcional, mantendo a acessibilidade e a consistência como pontos centrais do nosso design.

&nbsp;
<a id="-tests"></a>

## 🧪 Testes

Os testes desempenham um papel crucial na qualidade e robustez deste projeto. Adotamos uma abordagem de **Test-Driven Development (TDD)** em várias APIs, onde os testes são escritos antes mesmo de começar a implementação, garantindo que as funcionalidades sejam desenvolvidas de acordo com as expectativas desde o início.

<img src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/tests-results.JPG" alt="Resultados de test do Auth Portfolio Platform" align="center" />

### Tipos de Testes

- **Testes de Integração**: Em nossos testes de integração, testamos os casos de uso completos, desde a API até o final do caso de uso. Isso garante que todas as partes do sistema estejam funcionando de maneira coesa, integrando corretamente os diferentes componentes e verificando que a lógica de negócios está sendo executada conforme o esperado.

- **Testes Unitários**: Nos testes unitários, focamos em validar partes isoladas do código, como utilidades e schemas de sanitização utilizando o Zod. Esses testes garantem que cada componente individual funcione corretamente e ajudem a prevenir regressões em funcionalidades específicas.

### Ferramentas e Integração Contínua

- **Jest**: Atualmente, utilizamos o **Jest** como nossa principal ferramenta de testes, aproveitando sua ampla adoção e robustez para garantir a qualidade do código. O Jest permite criar e executar tanto testes unitários quanto de integração de maneira eficiente.

- **CI com GitHub Actions**: Os testes fazem parte do nosso processo de **Integração Contínua (CI)**, sendo executados automaticamente a cada pull request ou commit. Utilizamos **GitHub Actions** para orquestrar esses testes, garantindo que apenas código que passa em todos os testes seja mesclado na base de código principal.

### Prospecção Futura

Estamos avaliando a adoção do **Vitest** como ferramenta de testes futura. O Vitest promete ser uma alternativa mais leve e rápida ao Jest, especialmente em grandes bases de código TypeScript, mantendo a compatibilidade com o ecossistema de ferramentas já estabelecido.

Através dessa abordagem rigorosa e estruturada de testes, garantimos que a aplicação se mantém estável, segura e fácil de manter, enquanto continuamos a evoluir o código com confiança.

&nbsp;
<a id="-ci"></a>

## 🚀 CI/CD (Integração e Entrega Contínuas)

Neste projeto, adotamos uma abordagem rigorosa e padronizada para **CI/CD** (Integração e Entrega Contínuas), garantindo que o código seja sempre de alta qualidade antes de ser mesclado e implantado em produção.

### Commits Padronizados com Husky e Commitlint

Utilizamos **Husky** para configurar hooks do Git, garantindo que os commits sejam verificados antes mesmo de serem enviados. Com a integração do **Commitlint** (`npx commitlint --edit $1`), validamos os commits para que sigam o padrão **Conventional Commits**, evitando a "vergonha" de enviar commits fora do padrão para um Pull Request (PR).

O padrão que seguimos para commits é o seguinte:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Exemplos de tipos de commits que utilizamos:

- **feat**: Um novo recurso adicionado ao projeto
- **fix**: Correção de um bug no projeto
- **build**: Alterações no sistema de build ou em dependências externas (ex: gulp, npm)
- **chore**: Tarefas que não alteram o código de produção (ex: atualizações de dependências)
- **ci**: Alterações em arquivos de configuração e scripts de CI (ex: Travis, CircleCI)
- **docs**: Alterações que afetam apenas a documentação
- **style**: Alterações de estilo que não afetam o significado do código (ex: formatação)
- **refactor**: Mudanças no código que não adicionam recursos ou corrigem bugs
- **perf**: Alterações no código que melhoram o desempenho
- **test**: Adição ou correção de testes

### Validação Automática com GitHub Actions

Adotamos o **GitHub Actions** para automatizar o processo de CI, onde várias validações são realizadas antes que um PR seja aprovado:

1. **Commitlint Action**: Validamos todos os commits no PR para garantir que seguem o padrão `Conventional Commits`. O merge só é permitido se todos os commits passarem por essa validação.

2. **ESLint Check**: Rodamos `npm run lint:eslint:check` para verificar a conformidade do código com as regras de lint definidas. O merge só é habilitado se o código passar nessa verificação.

3. **Prettier Check**: Usamos `npm run lint:prettier:check` para garantir que o código está formatado corretamente de acordo com as regras do Prettier. O merge é bloqueado se houver problemas de formatação.

4. **Testes Automatizados**: Todos os testes são executados automaticamente em uma action. Somente após a aprovação em todos os testes, o merge é permitido.

Essa abordagem nos dá a segurança de que o código que chega à branch principal está sempre em conformidade com os padrões de qualidade do projeto.

<<<<<<< HEAD
<img src="https://chpfldfxmaovtlouzcwg.supabase.co/storage/v1/object/public/assets-public/images/readme/ci-gihub-actions.JPG" alt="Resultados de test do Auth Portfolio Platform" align="center" />

=======
>>>>>>> 82a9d47259b19c26d72c600e629aa683e09282ba
### Estratégia de Branching

Optamos por uma estratégia de branching simples, onde cada nova funcionalidade é desenvolvida em uma branch específica para aquela feature. Essa estratégia é conhecida como **Feature Branching**, que não deve ser confundida com o Git Flow. Embora o Git Flow seja uma excelente estratégia, optamos pela simplicidade do Feature Branching.

Além das feature branches, mantemos uma branch fixa para ajustes rápidos, garantindo que correções urgentes possam ser aplicadas rapidamente.

### Deploy com Vercel

O deploy do projeto é realizado automaticamente na **Vercel**, uma plataforma otimizada para projetos Next.js, que facilita o processo de entrega contínua, garantindo que as mudanças aprovadas na branch principal sejam implantadas imediatamente.

### Conclusão

Com essa estrutura de CI/CD bem definida, conseguimos manter um alto padrão de qualidade no código e nos processos de desenvolvimento, minimizando a possibilidade de erros e garantindo a estabilidade e a escalabilidade do projeto.

&nbsp;
<a id="-solid"></a>

## 🧩 Princípios SOLID no Projeto

Os princípios SOLID são fundamentais para criar sistemas escaláveis, fáceis de manter e com baixo acoplamento. A seguir, detalharemos como cada um desses princípios foi aplicado em uma rota específica do projeto.

### 1. **Princípio da Responsabilidade Única (SRP - Single Responsibility Principle)**

**Aplicação no Projeto:**

- **Route Handler (`route.ts`)**: Este arquivo é responsável apenas por mapear os métodos HTTP (`GET`, `POST`, `PUT`, `DELETE`, etc.) para a função que manipula a lógica associada à rota, delegando o trabalho ao controller.
- **Controller (`index.ts`)**: O controller tem a responsabilidade única de gerir as requisições e respostas HTTP. Ele não lida com lógica de negócios complexa ou com interações diretas com o banco de dados, mas sim com a sanitização de dados, tratamento de erros e chamada das factories e use cases.
- **Factory (`make-login-credential.ts`)**: A factory é responsável por compor o caso de uso, montando suas dependências (repositories, por exemplo). Ela encapsula o processo de criação dos objetos necessários para o caso de uso.
- **Use Case (`login-credential.ts`)**: O caso de uso concentra toda a lógica de negócio para o login de um usuário. Ele é responsável por todas as etapas do processo de login, desde a verificação de credenciais até a criação de sessões e cookies.
- **Repositories (`pg-user-repository.ts`)**: Os repositórios implementam a interação direta com o banco de dados. Eles têm a responsabilidade única de realizar operações de CRUD (Create, Read, Update, Delete) sobre as entidades.

**Benefício**: Cada parte do sistema tem uma responsabilidade claramente definida, o que facilita a manutenção e a evolução do código sem introduzir efeitos colaterais indesejados.

### 2. **Princípio do Aberto/Fechado (OCP - Open/Closed Principle)**

**Aplicação no Projeto:**

- **Factories e Repositories**: A implementação de repositórios segue este princípio, onde o repositório base (`UserRepository`) define as operações a serem implementadas. Novas funcionalidades podem ser adicionadas ao sistema sem modificar o código existente, simplesmente criando novas implementações de repositórios (por exemplo, utilizando outro banco de dados ou outro ORM).
- **Use Cases**: Novos casos de uso podem ser adicionados sem alterar o código existente, apenas criando novas classes de use cases que implementem as regras de negócio desejadas.

**Benefício**: O sistema é extensível sem precisar modificar o código existente, o que reduz a probabilidade de introduzir bugs e facilita a adição de novas funcionalidades.

### 3. **Princípio da Substituição de Liskov (LSP - Liskov Substitution Principle)**

**Aplicação no Projeto:**

- **Interfaces de Repositórios**: As interfaces definidas para os repositórios (ex.: `UserRepository`) garantem que qualquer implementação concreta (como `PgUserRepository`) possa ser substituída por outra implementação (como uma que use MongoDB, por exemplo) sem quebrar o código que depende dela.

**Benefício**: Facilita a troca e a substituição de componentes do sistema sem necessitar alterações significativas no código que os utiliza, mantendo a compatibilidade e a previsibilidade do comportamento do sistema.

### 4. **Princípio da Segregação de Interfaces (ISP - Interface Segregation Principle)**

**Aplicação no Projeto:**

- **Interfaces Específicas**: Cada repositório implementa interfaces específicas para as operações necessárias, evitando que uma classe seja forçada a implementar métodos que não utiliza. Por exemplo, a interface `UserRepository` contém apenas métodos relacionados aos usuários, sem misturar outras responsabilidades.

**Benefício**: As classes que implementam as interfaces não são sobrecarregadas com métodos desnecessários, o que torna o código mais limpo, fácil de entender e manter.

### 5. **Princípio da Inversão de Dependência (DIP - Dependency Inversion Principle)**

**Aplicação no Projeto:**

- **Use Cases e Repositories**: No caso de uso (`LoginCredentialUseCase`), as dependências (repositories e cookie management) são injetadas através do construtor, o que permite a inversão de controle. Isso significa que o caso de uso não depende diretamente de implementações concretas, mas sim de abstrações (interfaces). A factory é responsável por fornecer as implementações corretas para as interfaces.
- **Factories**: As factories invertem o controle da criação das dependências, permitindo que o código de alto nível (casos de uso) dependa de abstrações e não de implementações concretas.

**Benefício**: Isso facilita o teste unitário e a substituição de componentes por mocks ou outras implementações sem alterar o código principal. Também promove a criação de código mais modular e desacoplado.

---

**Resumo dos Benefícios:**

- **Manutenção Simplificada**: Ao aplicar SOLID, o sistema é dividido em partes menores e mais gerenciáveis, onde cada parte tem uma responsabilidade bem definida.
- **Facilidade de Evolução**: O código é aberto para extensão e fechado para modificação, permitindo que novas funcionalidades sejam adicionadas sem impactar o que já foi implementado.
- **Flexibilidade e Reusabilidade**: Componentes podem ser facilmente substituídos ou reutilizados em diferentes partes do sistema, promovendo a modularidade e a flexibilidade.
- **Testabilidade**: O desacoplamento entre os componentes facilita a criação de testes unitários e de integração, aumentando a confiabilidade do código.

&nbsp;
<a id="-auth"></a>

## 🔑 Por que o AuthJs (NextAuth)?

Quando decidimos implementar a autenticação no **Auth Portfolio Platform**, queríamos evitar a dependência de plataformas SaaS para gerenciar credenciais de usuários. A ideia de ficar preso a um serviço externo, com suas próprias limitações e custos, não era atraente. Por isso, optamos pelo **NextAuth**.

### Vantagens do NextAuth

O NextAuth foi escolhido por várias razões:

- **Variedade de Providers**: O NextAuth oferece uma ampla gama de providers (Google, GitHub, etc.), o que facilita a integração com várias plataformas populares.
- **Robustez**: É uma solução robusta e madura, com boas práticas de autenticação já incorporadas, o que nos deu uma base sólida para trabalhar.
- **Extensibilidade**: Embora tenhamos feito várias personalizações, o NextAuth foi flexível o suficiente para nos permitir integrar essas modificações sem grandes complicações.

### Customizações Realizadas

Apesar das vantagens, fizemos algumas mudanças importantes para adaptar o NextAuth às nossas necessidades específicas:

#### 1. **Estratégia de Autenticação Baseada em Banco de Dados**

Optamos por gerenciar as sessões diretamente no banco de dados. Isso nos dá mais controle sobre as sessões de usuário, permitindo, por exemplo, encerrar sessões de maneira centralizada. Embora isso pudesse ser feito com JWT, a complexidade aumentaria, e ter as sessões no banco de dados nos permite uma visualização mais clara e intuitiva. Um dos nossos requisitos é mostrar ao usuário suas sessões ativas, permitindo que ele feche qualquer uma delas, exceto a atual, o que é mais fácil de implementar com sessões no banco de dados.

#### 2. **Autenticação com Email e Senha**

O NextAuth não facilita o uso de autenticação com email e senha, chegando até a desencorajá-la. Por isso, implementamos manualmente toda a lógica necessária para:

- **Registro de Usuário (Register)**
- **Esqueci Minha Senha (Forgot Password)**
- **Redefinição de Senha (Reset Password)**
- **Verificação de Email (Verify Email OTP)**
- **Login**

Após o login, criamos a sessão manualmente, gerando e gerenciando os tokens. Todas essas funcionalidades foram desenvolvidas de forma separada, cada uma com seu próprio caso de uso, garantindo um sistema modular e desacoplado.

#### 3. **Magic Link**

Implementamos o login via Magic Link de forma manual, integrando-o ao nosso processo de autenticação para fornecer uma experiência de usuário fluida e segura.

#### 4. **Integração com Providers (Google e GitHub)**

Utilizamos os providers do NextAuth, como Google e GitHub, mas integramos profundamente esses processos com nosso sistema:

- **Callback Personalizado**: No callback do NextAuth, coletamos os dados do usuário e os adicionamos em cookies personalizados. O NextAuth adiciona as informações nas tabelas padrão e retorna, mas interceptamos esse processo para integrar com nossos casos de uso.
- **União de Contas**: Se um usuário já tiver uma conta criada com credenciais (email e senha) e depois tentar entrar com Google ou GitHub, nossa lógica personalizada edita o usuário e cria uma nova conta ligada à mesma identidade, gerenciando as sessões conforme necessário.

#### 5. **Gerenciamento de Sessões por Dispositivo**

Adicionamos uma funcionalidade que o NextAuth não implementa nativamente: o controle de sessões por dispositivo. Cada sessão é associada a um dispositivo específico, permitindo ao usuário ver suas sessões ativas e encerrar qualquer uma delas de forma granular.

### Emails de Notificação

Todo esse sistema de autenticação é acompanhado de notificações via email para garantir que o fluxo seja o mais amigável e seguro possível para o usuário. Os emails são enviados utilizando **React Mail**, garantindo uma apresentação profissional e consistente.

---

Com essas customizações, conseguimos criar um sistema de autenticação robusto, seguro e totalmente adaptado às nossas necessidades, sem depender de soluções SaaS. Além disso, o controle granular sobre sessões e a flexibilidade na integração de providers nos permitem oferecer uma experiência de usuário de alta qualidade, mantendo o controle total sobre os dados e processos.

&nbsp;
<a id="-autor"></a>

## 🦸 Autor

Olá, eu sou Livio Alvarenga, Engenheiro de Produção | Dev Full Stack. Sou aficcionado por tecnologia, programação, processos e planejamento. Uni todas essas paixões em uma só profissão. Dúvidas, sugestões e críticas são super bem vindas. Seguem meus contatos.

- [www.livioalvarenga.com](https://livioalvarenga.com)
- contato@livioalvarenga.com

&nbsp;

<p align="center">
  <a href= "https://www.livioalvarenga.com/"><img alt="portfólio livio alvarenga" src="https://raw.githubusercontent.com/LivioAlvarenga/LivioAlvarenga/3109a24e71f07dbad193ae0ddbc43b69b39c7adf/files/badgePortifolioLivio.svg"></a>
  <a href= "https://www.linkedin.com/in/livio-alvarenga/"><img alt="perfil LinkedIn livio alvarenga" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=0A66C2&logo=LinkedIn&label=LinkedIn&message=Livio Alvarenga&color=0A66C2"></a>
  <a href= "https://twitter.com/AlvarengaLivio"><img alt="perfil twitter livio alvarenga" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=1DA1F2&logo=Twitter&label=Twitter&message=@AlvarengaLivio&color=1DA1F2"></a>
  <a href= "https://www.instagram.com/livio_alvarenga/"><img alt="perfil Instagram livio alvarenga" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=E4405F&logo=Instagram&label=Instagram&message=@livio_alvarenga&color=E4405F"></a>
  <a href= "https://www.facebook.com/profile.php?id=100083957091312"><img alt="perfil Facebook livio alvarenga" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=1877F2&logo=Facebook&label=Facebook&message=Livio Alvarenga&color=1877F2"></a>
  <a href= "https://www.youtube.com/channel/UCrZgsh8IWyyNrRZ7cjrPbcg"><img alt="perfil YouTube livio alvarenga" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=FF0000&logo=YouTube&label=Youtube&message=Livio Alvarenga&color=FF0000"></a>
</p>
<p align="center">
 <a href= "https://cursos.alura.com.br/vitrinedev/livioalvarenga"><img alt="perfil vitrinedev livio alvarenga" align="center" height="30" src="https://raw.githubusercontent.com/LivioAlvarenga/LivioAlvarenga/e0f5b5a82976af114d957c20f0c78b4d304a68a0/files/vitrinedev.svg"></a>
</p>

---

&nbsp;
<a id="-licença"></a>

## 📝 Licença

Este projeto é [MIT licensed](./LICENSE).

##### _#CompartilheConhecimento_
