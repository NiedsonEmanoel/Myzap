export const TOKEN_KEY = '&app-token';
export const ID_USUARIO = '&id-usuario';
export const NOME_USUARIO = '&nome-usuario';
export const USER_TYPE = '&user-type';
export const PROFILE_LINK = '&profile-link';
export const MENU_PREFERENCE = '&menu-user';
export const COUNT_ATTENDANCE = '&count-attendance';
export const NOTIF_PREFERENCE = '&notif-user';

export const login = token => { sessionStorage.setItem(TOKEN_KEY, token) };
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export const logout = () => {
    document.cookie.split(";").forEach((c) => {
        document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/");
    });

    sessionStorage.clear()

    window.location.href = '/admin/login';
};

export const setIdUsuario = id => sessionStorage.setItem(ID_USUARIO, id);
export const getIdUsuario = () => sessionStorage.getItem(ID_USUARIO);

export const setNomeUsuario = id => sessionStorage.setItem(NOME_USUARIO, id);
export const getNomeUsuario = () => sessionStorage.getItem(NOME_USUARIO);

export const setTipoUsuario = id => sessionStorage.setItem(USER_TYPE, id);
export const getTipoUsuario = () => sessionStorage.getItem(USER_TYPE);

export const setProfileLinkUsuario = id => sessionStorage.setItem(PROFILE_LINK, id);
export const getProfileLinkUsuario = () => sessionStorage.getItem(PROFILE_LINK);

export const setMenuPreference = id => localStorage.setItem(MENU_PREFERENCE, id);
export const getMenuPreference = () => localStorage.getItem(MENU_PREFERENCE);

export const getAttendanceCount = () => localStorage.getItem(COUNT_ATTENDANCE);
export const setToZeroAttendanceCount = () => localStorage.setItem(COUNT_ATTENDANCE, "0");
export const setAttendanceCountOnePlus = () => {
    let number = parseInt(getAttendanceCount());
    number++;

    let newNumber = new String(number)
    localStorage.setItem(COUNT_ATTENDANCE, newNumber);
}

export const setNotifPreference = id => sessionStorage.setItem(NOTIF_PREFERENCE, id);
export const getNotifPreference = () => sessionStorage.getItem(NOTIF_PREFERENCE);