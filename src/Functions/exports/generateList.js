let prefer = require('../../Databases/tempData');

module.exports = function () {
    let vec = prefer.getVec();
    let text = new String('*Lista de atendimento:*\n\n* -Por ordem do pedido*\n_ (Os que pediram primeiro estão em cima)_\n');

    function compare(a, b) {
        return a.requestDate < b.requestDate;
    }

    vec = vec.sort(compare);

    if (vec.length === 0) {
        text += `\n_Nenhum cliente em atendimento encontrado :(_`
    } else {
        for (let key in vec) {
            let number = new String(vec[key].number);
            number = number.split('@', 1);
            text += `\n*ID: ${key} - ${vec[key].name}*\n_https://api.whatsapp.com/send?phone=${number}_\n`;
        }
    }

    return text;
}