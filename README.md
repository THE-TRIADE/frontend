# Frontend

Este repositório diz respeito ao frontend da aplicação FamilyRoutine. Ele deve ser usado em conjunto com o repositório do backend, que é uma API REST e está disponível [aqui](https://github.com/THE-TRIADE/backend).

## Pré-requisitos para a compilação e utilização do sistema

Utilizar os seguintes tutoriais para configurar o ambiente de desenvolvimento:

### Instalação e configuração do GIT
Instalar e configurar o GIT no path, se o mesmo não estiver configurado

**Windows:** Baixar e instalar o git do [repositório oficial](https://git-scm.com/downloads)

**Linux:** Instalar utilizando o gerenciador de pacotes do SO (Ex: sudo apt-get install git).

Aplicar as seguintes configurações usando o console (substituir os campos destacados com o nome e login do usuário):

```sh
git config --global user.name "<User Name>"
git config --global user.email "<user.name>@email.com"
```

### Instalação e configuração do Node.js

**Windows e macOS**

Baixar o instalador:

Vá para [nodejs.org/](https://nodejs.org/en/)
```sh
Selecione o botão de download da versão LTS, que é a recomendada para a maioria dos usuários.
Instale o Node ao clicar duas vezes no arquivo de download. Siga a instalação a partir das janelas que vão aparecer na sua tela.
```

**Ubuntu 16.04**
O jeito mais fácil de instalar a versão LTS do Node é usar o NPM a partir do Ubuntu binary distributions repository. Isso pode ser feito de uma maneira muito simples. Rode os seguintes comandos no seu terminal.

```sh
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Configurações Iniciais

Clonar o repositório a partir da branch develop:
```bash
git clone https://github.com/THE-TRIADE/frontend.git -b develop
```

Criar arquivo externalizado `.env` na raiz do projeto com a seguinte configuração:

```VITE_API_URL=<endereço do backend, localmente seria: http://localhost:8080>```

Após, baixar as dependências do projeto:

```bash
npm install
```

### Modo desenvolvimento

Rodar o projeto:

```bash
npm run dev
```

### Modo produção

Buildar o projeto:

```bash
npm run build
```

Por fim, rodar o projeto:

```bash
npm run preview
```
Abra http://localhost:5173 (modo desenvolvimeento) ou http://localhost:4173 (modo produção) no seu browser para ver a tela inicial do projeto.

## Documentação oficial do React.js
- [React.js](https://react.dev/) - aprenda sobre React, funcionalidades e API.
