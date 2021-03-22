function getColor (value) {
    switch (value) {
        case 1:
            return 'default';
        case 2:
            return 'primary';
        case 3:
            return 'secondary'; 
        default:

    }
}

export default getColor;