module.exports = class {
    static #inAttendace = [];
    static #first = [];

    static addAttendace(name, number, photo) {
        const now = new Date();
        const user = {
            "name": name,
            "number": number,
            "photoUrl": photo,
            "requestDate": now,
            "messagesClient": {
                "content": [],
                "date": []
            }
        }
        this.#first.push(number);
        this.#inAttendace.push(user);
    }

    static addMessage(number, message) {
        for (let key in this.#inAttendace) {
            if (this.#inAttendace[key].number === number) {
                let date = new Date();

                this.#inAttendace[key].messagesClient.content.push(message);
                this.#inAttendace[key].messagesClient.date.push(date);
            }
        }
    }

    static containsByNumber(number) {
        for (let key in this.#inAttendace) {
            if (this.#inAttendace[key].number === number) { return true; }
        }
        return false;
    }

    static removeByNumber(number) {
        if (this.containsByNumber(number)) {
            for (let key in this.#inAttendace) {
                if (this.#inAttendace[key].number === number) {
                    this.#inAttendace = this.#inAttendace.splice((key + 1), 1);
                    console.log('apagado');
                }
            }
        } else {
            console.log('Numero não está na lista de atendimento');
        }
    }

    static isFirst(number) {
        if(this.#first.includes(number)){
            let index = this.#first.indexOf(number);
            this.#first = this.#first.splice(index+1, 1)
            return true;
        }
    }

    static getVec() {
        return this.#inAttendace;
    }
}