import jwtDecode from 'jwt-decode';
import { getAuthData } from './storage';

export type Role = 'ROLE_OPERATOR' | 'ROLE_ADMIN';

export type TokenData = {
    exp: number;
    user_name: string;
    authorities: Role[];
}

export const getTokenData = (): TokenData | undefined => {
    try {
        return jwtDecode(getAuthData().access_token) as TokenData;
    }
    catch (error) {
        return undefined;
    }
}

export const isAuthenticated = (): boolean => {
    const tokenData = getTokenData();

    return (tokenData && tokenData.exp * 1000 > Date.now()) ? true : false;
}

/* check if user has some role(s)  */
export const hasAnyRoles = (roles: Role[]): boolean => {

    if (roles.length === 0) {
        return true;
    }

    const tokenData = getTokenData();

    /* alternative for loop using some (high order function) */
    // return roles.some(role => tokenData.authorities.includes(role));

    if (tokenData !== undefined) {
        for (var i = 0; i < roles.length; i++) {
            if (tokenData.authorities.includes(roles[i])) {
                return true;
            }
        }
    }

    return false;
}