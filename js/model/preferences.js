module.exports = class {
    static ignoreContact = [];
    static firstIgnore = [];

    static remFirstIgnore(from){
        for (let numero in this.firstIgnore) {
            if (this.firstIgnore[numero] == from) {
                this.firstIgnore = this.firstIgnore.splice((numero + 1), 1);
                console.log('First ignore removed from ' +from)
            }
        }
    }

    static addIgnore(from){
        this.ignoreContact.push(from);
        this.firstIgnore.push(from);
        console.log('Ignore added from '+from)
    }

    static remIgnore(from){
        for(let key in this.ignoreContact){
            if(this.ignoreContact[key] == from) {
                this.ignoreContact = this.ignoreContact.splice((key+1), 1);
                console.log('Ignore removed from '+from);
            }
        }

        this.remFirstIgnore(from);
    }
}