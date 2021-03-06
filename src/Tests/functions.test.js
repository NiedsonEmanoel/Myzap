const writeName = require('../Models/Utils/writeFileName').writeFileName;
const Fallback = require('../Models/Utils/fallbackResponses');
const Greeting = require('../Models/Utils/greetings');

test('Os nomes estão sendo escritos?', () => {
    expect(writeName('55877565', 'mp3')).toBeDefined();
});

test('As respostas de fallback estão retornando?', () => {
    console.log(Fallback());
    expect(Fallback()).toBeDefined();
});

test('A saudação está certa?', () => {
    let now = new Date();
    let hour = now.getHours();
    let comp;

    if (hour >= 4 && hour <= 12) { comp = 'Bom dia' };
    if (hour > 12 && hour <= 17) { comp = 'Boa tarde' };
    if (hour > 17 || hour < 4) { comp = 'Boa noite' };

    console.log(Greeting() + ` - ${now}`);
    expect(Greeting()).toEqual(comp);
});