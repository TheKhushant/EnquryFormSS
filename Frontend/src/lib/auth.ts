// Client-side session flag for the admin area.
// NOTE: this only gates the UI. The backend API is not authenticated yet, so
// this is not a security boundary (see final report / README).
const KEY = "ss_admin_session";

export const isAdminLoggedIn = () => {
    try {
        return sessionStorage.getItem(KEY) === "1";
    } catch {
        return false;
    }
};

export const setAdminSession = (loggedIn: boolean) => {
    try {
        if (loggedIn) sessionStorage.setItem(KEY, "1");
        else sessionStorage.removeItem(KEY);
    } catch {
        // storage unavailable (private mode): the guard will send the user to login
    }
};
