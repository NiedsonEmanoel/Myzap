# Venon-DialogFlow
>Integramos a biblioteca Venom ao DialogFlow, permitindo assim uma conversação mais rica no ChatBot.
## Conhecendo o DialogFlow
O DialogFlow (antigo api.ai) é uma plataforma de criação de chatbots da Google com foco no processamento de linguagem natural. O processamento de linguagem natural é utilizado por diversos recursos de inteligência artificial, o seu objetivo é entender a frase e formar a melhor resposta possível para aquela frase. Ele está dividido em diversas fases. Normalização, Remoção de numerais, Remoção de Stopwords, Correção ortográfica, Stemização e Lematização. Essas etapas fazem, basicamente, a quebra da frase, para que seja possível compreender os significados e assim saber em que contexto devemos encaixar o sentido da frase.
### Criando nosso Agente
Após criarmos a conta no Dialogflow, vamos criar nosso agent, que é o bot que irá responder as mensagens, aconselho criarem em português, pois em inglês têm diversas respostas prontas e isso pode conflitar com as respostas que iremos criar.

![](/assets/1.png)
Os agentes do DialogFlow possuem diversas funcionalidades, porém como nessa ocasião estaremos apenas usando o Processamento de Linguagem do DialogFlow, vamos utilizar somente as intents.
* Intents: As intents, são as intenções que você tem de como responder uma determinada frase, entre na aba Intents no menu do lado esquerdo e há um botão na parte central superior para criar uma nova intent.

![](/assets/2.png)
 
