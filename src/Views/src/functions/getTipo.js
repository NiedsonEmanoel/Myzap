function getTipo (value){
    switch (value) {
        case 1:
            return 'Funcionário';
        case 2:
            return 'Gerente';
        case 3:
            return 'Administrador' 
        default:

    }
}

export default getTipo;