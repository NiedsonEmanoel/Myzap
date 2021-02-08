function s() {
let NomeContato = "Jooj";
let TelefoneContato = "8787878";
let CpfContato = "55555"
let query = 'update Cadastro set Nome = "'+NomeContato+'" where Telefone = "'+TelefoneContato+'" AND CPF = "'+CpfContato+'"'
console.log(query);
}
s();