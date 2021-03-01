"use strict";
module.exports = class {
    static ignoreContact = [];
    static firstIgnore = [];

    static remFirstIgnore(from){
        for (let numeros in this.firstIgnore) {
            if (this.firstIgnore[numeros].number == from) {
                this.firstIgnore = this.firstIgnore.splice((numeros + 1), 1);
                console.log('First ignore removed from ' +from)
            }
        }
    }

    static addIgnore(from, name, pic, ){
        const contact = {
            "number":from,
            "name":name,
            "photo":pic
        }
        this.ignoreContact.push(contact);
        this.firstIgnore.push(contact);
        console.log('\n'+this.ignoreContact[0].name);
        console.log('Ignore added from '+contact.number)
    }

    static remIgnore(from){
        console.log(this.ignoreContact);
        for(let key in this.ignoreContact){
            if(this.ignoreContact[key].number == from) {
                this.ignoreContact = this.ignoreContact.splice((key+1), 1);
                console.log('Ignore removed from '+from);
            }
        }

        this.remFirstIgnore(from);
    }
}