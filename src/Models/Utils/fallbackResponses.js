module.exports = function fallbackResponses() {
    let response = [
        'Lamento, mas não compreendi.',
        'Desculpe, mas não compreendi.',
        'Infelizmente, não captei o que deseja.',
        'Não consegui compreender, desculpe.',
        'Não entendi, me desculpe.',
        'Poderia repetir? Eu não consegui entender.',
        'Eu ainda não estou configurado para entender isso :(\nPoderia tentar com outras palavras?',
        'Me desculpe, mas não entendi',
        'Perdão, mas não consegui te entender',
        'Não consegui captar, poderia repetir?'
    ];
    let index = Math.floor(Math.random() * 10);
    return response[index];
}