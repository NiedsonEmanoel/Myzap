
export const TOKEN_KEY = '&app-token';
export const ID_USUARIO = '&id-usuario';
export const NOME_USUARIO = '&nome-usuario';
export const USER_TYPE  = '&user-type';
export const PROFILE_LINK = '&profile-link';

export const login = token => {sessionStorage.setItem(TOKEN_KEY, token)};
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const logout = () => {sessionStorage.clear()};

export const setIdUsuario = id => sessionStorage.setItem(ID_USUARIO, id);
export const getIdUsuario = () => sessionStorage.getItem(ID_USUARIO);

export const setNomeUsuario = id => sessionStorage.setItem(NOME_USUARIO, id);
export const getNomeUsuario = () => sessionStorage.getItem(NOME_USUARIO);

export const setTipoUsuario = id => sessionStorage.setItem(USER_TYPE, id);
export const getTipoUsuario = () => sessionStorage.getItem(USER_TYPE);

export const setProfileLinkUsuario = id => sessionStorage.setItem(PROFILE_LINK, id);
export const getProfileLinkUsuario = () => sessionStorage.getItem(PROFILE_LINK);