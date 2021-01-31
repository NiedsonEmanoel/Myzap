# Venon-DialogFlow
>Integramos a biblioteca Venom ao DialogFlow, permitindo assim uma conversação mais rica no ChatBot.

![](https://camo.githubusercontent.com/df610fa85dd4f78da335757a27a5f57c528a058047d26055f4604f631d8b8a8d/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f76656e6f6d2d626f742e7376673f636f6c6f723d677265656e)
## Conhecendo o DialogFlow
 O DialogFlow (antigo api.ai) é uma plataforma de criação de chatbots da Google com foco no processamento de linguagem natural. O processamento de linguagem natural é utilizado por diversos recursos de inteligência artificial, o seu objetivo é entender a frase e formar a melhor resposta possível para aquela frase. Ele está dividido em diversas fases. Normalização, Remoção de numerais, Remoção de Stopwords, Correção ortográfica, Stemização e Lematização. Essas etapas fazem, basicamente, a quebra da frase, para que seja possível compreender os significados e assim saber em que contexto devemos encaixar o sentido da frase.
## Criando nosso Agente
 Após criarmos a conta no Dialogflow, vamos criar nosso agent, que é o bot que irá responder as mensagens, aconselho criarem em português, pois em inglês têm diversas respostas prontas e isso pode conflitar com as respostas que iremos criar.

![](/assets/1.png)

Os agentes do DialogFlow possuem diversas funcionalidades, porém como nessa ocasião estaremos apenas usando o Processamento de Linguagem do DialogFlow, vamos utilizar somente as intents.
* Intents: **As intents, são as intenções que você tem de como responder uma determinada frase, entre na aba Intents no menu do lado esquerdo e há um botão na parte central superior para criar uma nova intent.**

![](/assets/2.png)
 >Vermelho: Frases para acionar a intent.
>
 >Preto: Respostas da Intent
>
 >Preste atenção ao nome que você deu a sua intent (Nesse caso **“oi”**), ele será utilizado no mapeamento das intents quando estivermos integrando o DialogFlow ao WhatsApp.

 Logo após configurarmos todos os nossos intents, vá até as configurações do DialogFlow, guarde o nome do projeto e clique no nome dele para acessarmos o painel do GCP.

 ![](/assets/3.png)

 Entre no GCP e vá até APIs e serviços e logo após vá em credenciais.
  
![](/assets/4.png)

Vá em contas de serviço e clique no primeiro e-mail que aparecer.

![](/assets/5.png)

Clique em criar chave, nova chave, escolha o formato JSON e faça o download para seu computador.

![](/assets/6.png)

Guarde essa chave em um local seguro pois ela é a autenticadora do seu projeto e em mãos erradas pode lhe trazer grandes dores de cabeça.

Logo após esse processo de download do arquivo JSON crie uma nova variável de ambiente chamada `GOOGLE_APPLICATION_CREDENTIALS` e como valor dessa variável defina o seu **arquivo JSON**.

Faça Log-Off no seu sistema logo após definir as variáveis de ambiente.

![](/assets/7.png)

Ao fim desse processo nosso PC já estará apto para criar a integração com o WhatsApp que será feita com a biblioteca venom. Funcionará da seguinte forma: O usuário interage com o chat configurado no venom, ele envia a mensagem para o dialogflow processar qual a intent, e com a intent nós podemos personalizar o código da maneira como quisermos.

## O que é o Venom?
O **Venom Bot** é uma biblioteca que consegue integrar o seu número do WhatsApp abrindo por debaixo dos panos o WhatsApp Web. Uma vez que é realizada a autenticação via QR Code diretamente do terminal, você conseguirá manipular via código JavaScript toda e qualquer interação disponível no WhatsApp Web, mais especificamente pelo Node.js.

## Instalação do Projeto
Para resolver as dependências rode o seguinte comando:
```sh
npm install
```
Aguarde um pouco enquanto ele baixa as bibliotecas e assim que ele terminar rode o comando para finalmente dar play em seu projeto:
```sh
npm start
```

Vai aparecer em sua janela de comando um código QRescaneie ele com seu WhatsApp e o bot entrará em pleno funcionamento.

![](/assets/8.png)

Basicamente todos os recursos disponíveis no WhatsApp Web nós conseguimos manipular via código. Desde o envio e download de arquivos até a criação e interação de grupos!

![](/assets/9.gif)

ChatBot respondendo as mensagens, via responses do DialogFlow.
## Conclusão
O uso da API Oficial do WhatsApp é quase insustentável e o venom cumpre bem o seu papel em permitir a manipulação do WhatsApp via código.
Se aliando a essa biblioteca temos o DialogFlow que é um serviço da Google poderoso para a criação desses agentes automatizados e utilizar ele junto com o venom nos permite uma liberdade maior do projeto, pois o nosso bot passa a ignorar erros ortográficos e se algum trecho foi escrito em maiúsculo ou não.
Ao invés de perdemos tempo e poluirmos o codigo com testes condicionais para verificar se foi escrito por Ex: `OI` ou `Oi` ou `oi`, podemos ser mais objetivos e definirmos todas essas expressões como uma única Intent.

## F.A.Q
### Arquivos mais importantes do projeto:
> **[index.js](index.js)**
>  
>Arquivo mais importante do projeto e onde podemos configurar as nossas intents e o que fazer logo após ser feita a identificação.
Nesse caso após a identificação o bot responde com as respostas definidas no DialogFlow, mas você é livre para personalizar como quiser.

> **[dialogflow-rq.js](dialogflow-rq.js)**
>
>Arquivo que faz a integração do Venom com o DialogFlow, ele faz um request via API e lhe devolve a Intent, Parameters e as Respostas do DialogFlow.

>**[package.json](package.json)**
>
>Arquivo que o node usa para identificar seu projeto, resolver depedências e executar scripts, você pode alterar, mas não retire essas dependências elas são essenciais para a plena execução do projeto.

## Sobre o autor [META]
Niedson Emanoel – Twitter: [@niedsonemanoel](https://twitter.com/niedsonemanoel) – [niedsonemanoel@gmail.com](mailto:niedsonemanoel@gmail.com)

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

[https://github.com/NiedsonEmanoel](https://github.com/NiedsonEmanoel/)

## Contribua

1. Faça o _fork_ do projeto (<https://github.com/NiedsonEmanoel/venon-dialogflow/fork>)
2. Crie uma _branch_ para sua modificação (`git checkout -b feature/fooBar`)
3. Faça o _commit_ (`git commit -am 'Add some fooBar'`)
4. _Push_ (`git push origin feature/fooBar`)
5. Crie um novo _Pull Request_

