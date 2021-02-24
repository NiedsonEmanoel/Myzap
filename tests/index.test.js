const messageValid = require('../js/model/util').isMsgValid;
const Fallback = require('../js/model/util').fallbackResponses;
const writeName = require('../js/model/util').writeName;
const preferences = require('../js/model/preferences');

test('A lista de ignorados está iniciada?', ()=>{
    expect(preferences.ignoreContact !== undefined).toBeTruthy();
});

test('A lista de primeiros ignorados está iniciada?', ()=>{
    expect(preferences.firstIgnore !== undefined).toBeTruthy();
});

test('Os nomes estão sendo escritos?', ()=>{
    expect(writeName('55877565', 'false')).toBeDefined();
});

test('As respostas de fallback estão retornando?', ()=>{
    expect(Fallback()).toBeDefined();
})

test('Mensagem é válida para o ambiente?', ()=>{
    expect(messageValid('Message', '5587996', process.env.PASS_API)).toBeTruthy();
});