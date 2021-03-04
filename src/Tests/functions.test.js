const writeName = require('../Models/Utils/writeFileName').writeFileName;
const Fallback = require('../Models/Utils/fallbackResponses');

test('Os nomes estão sendo escritos?', ()=>{
    expect(writeName('55877565', 'mp3')).toBeDefined();
});

test('As respostas de fallback estão retornando?', ()=>{
    console.log(Fallback());
    expect(Fallback()).toBeDefined();
})