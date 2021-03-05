module.exports = function () {
    let now = new Date();
    let hour = now.getHours();
    let comp;
    
    if (hour >= 4 && hour <= 12) {comp = 'Bom dia'};
    if (hour > 12 && hour <= 17) {comp = 'Boa tarde'};
    if (hour > 17 || hour < 4) {comp = 'Boa noite'};

    delete now;
    delete hour;

    return comp;
}