<h1></h1>
<p align="center">
    <img src="src/Controllers/Classes/Temp/myzap.png" width="250">
    <h1 align="center">MyZAP-Flow</h1>
    <p align="center">MyZAP-Flow é um projeto open source que conecta o Dialogflow ao WhatsApp<br>dando suporte nativo para o reconhecimento de áudios e permite a conexão<br>com outras plataformas por meio de sua API REST.</p>

</p>
<p align="center">
    <img src="https://img.shields.io/github/package-json/v/NiedsonEmanoel/myzap-flow">
    <img src="https://github.com/NiedsonEmanoel/Myzap-Flow/actions/workflows/node.js.yml/badge.svg?branch=main">
    <img src="https://img.shields.io/github/languages/code-size/NiedsonEmanoel/myzap-flow">
</p>
<p align = "center">
    <img src="https://shields.io/badge/license-MIT-green">
</p>
<h1></h1>

<h1>Instalação:</h1>

<p><strong>Para esse projeto é recomendado que se utilize o Node v14, pois se trata de uma versão nova e estável, garantindo a execução do código sem maiores problemas.</strong></p>

<p>Antes que seja efetuado o clone desse projeto você tem que ter em mãos os seguintes arquivos e/ou links:</p>
<ul>
    <li><strong>Link do seu banco de dados Mongo DB</strong></li>
    <span>Ele é similar a esse: <strong>mongodb://localhost:27017/myzap-db</strong>  (Onde o myzap-db é o nome do banco, você pode colocar o que quiser.)</br></span>
    <span><br/>Você pode conseguir um banco de dados mongo com até 512Mb de armazenamento gratuito em:</br>https://www.mongodb.com/cloud/atlas/signup (Solução oficial do Mongo)</br></br>Caso você queira rodar localmente indico esse tutorial do Youtube:</br>https://www.youtube.com/watch?v=aYRkF7sHrbk</span>
    <p> </p>
    <li><strong>Arquivo JSON do seu projeto Google Cloud Platforms</strong></li>
    <span>Esse arquivo é fundamental para que seja efetuada a comunicação com seu Chatbot do Dialogflow </br>Caso você não a tenha siga os passos da sessão <a href="https://github.com/NiedsonEmanoel/Myzap-Flow#configurando-o-dialogflow">Configurando o Dialogflow</a>.</span>
    <p> </p>
    <li><strong>Nome do seu projeto Google Cloud Plataforms</strong></li>
    <p>É o identificador único do seu projeto, geralmente está contido dentro do JSON, mas caso você não saiba na aba <a href="https://github.com/NiedsonEmanoel/Myzap-Flow#configurando-o-dialogflow">Configurando o Dialogflow</a> é mostrado como fazer a coleta deste dado.</p>
    <p> <i><b>Nota do desenvolvedor:</b></br>No arquivo .json contém o nome do seu projeto então por causa disto nas  versões futuras pretendo fazer essa coleta de forma automatizada.</i> </p>
</ul>

#

<h1>Instalação do Projeto</h1>

Para clonar o projeto em seu computador local execute o seguinte comando:
```sh
git clone https://github.com/NiedsonEmanoel/Myzap-Flow
```
#

### Logo após o clone do projeto é necessário que você copie o arquivo .env-example para um arquivo .env

#
Windows:
```sh
cd src/
```
```sh
cp .env-example .env
```

#
Linux ou Mac:
```sh
cd src/ && cp .env-example .env
```
#
<h1>Configurando o Dialogflow</h1>


<h2>Agradecimentos:</h2>

#

## Sobre o autor [META]
Niedson Emanoel – Instagram: [@niedsonemanoel](https://instagram.com/niedsonemanoel) – [contato@niedsonemanoel.com.br](mailto:contato@niedsonemanoel.com.br)

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
#

## Contribua

1. Faça o _fork_ do projeto (<https://github.com/NiedsonEmanoel/Myzap-Flow/fork>)
2. Crie uma _branch_ para sua modificação (`git checkout -b feature/fooBar`)
3. Faça o _commit_ (`git commit -am 'Add some fooBar'`)
4. _Push_ (`git push origin feature/fooBar`)
5. Crie um novo _Pull Request_