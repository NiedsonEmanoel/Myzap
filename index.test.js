const messageValid = require('./js/model/util').isMsgValid;

test('Mensagem é válida para o ambiente?', ()=>{
    expect(messageValid('Message', '5587996', process.env.PASS_API)).toBeTruthy();
});