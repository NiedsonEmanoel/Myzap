
export const TOKEN_KEY = '&app-token';
export const ID_USUARIO = '&id-usuario';
export const NOME_USUARIO = '&nome-usuario';
export const USER_TYPE  = '&user-type';
export const PROFILE_LINK = '&profile-link';

export const login = token => {localStorage.setItem(TOKEN_KEY, token)};
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const logout = () => {localStorage.clear()};

export const setIdUsuario = id => localStorage.setItem(ID_USUARIO, id);
export const getIdUsuario = () => localStorage.getItem(ID_USUARIO);

export const setNomeUsuario = id => localStorage.setItem(NOME_USUARIO, id);
export const getNomeUsuario = () => localStorage.getItem(NOME_USUARIO);

export const setTipoUsuario = id => localStorage.setItem(USER_TYPE, id);
export const getTipoUsuario = () => localStorage.getItem(USER_TYPE);

export const setProfileLinkUsuario = id => localStorage.setItem(PROFILE_LINK, id);
export const getProfileLinkUsuario = () => localStorage.getItem(PROFILE_LINK);