/** Coaster Error Messages */
export const COASTERS_LINKED = { code: 'ACCOUNT_ALREADY_LINKED', message: 'This coaster is already linked to your account.', status: 400};
export const COASTERS_NOT_FOUND = { code: 'COASTERS_NOT_FOUND', message: 'This coaster does not exist.', status: 404};
export const COASTERS_NOT_LINKED = { code: 'COASTERS_NOT_LINKED', message: 'This coaster is not linked to this Fonz account.', status: 404};
export const COASTER_ACC_REVOKED = { code: 'COASTER_ACC_REVOKED', message: 'Coaster removed from Fonz account.', status: 100};
export const COASTERS_LINK_EXISTS = { code: 'COASTERS_LINK_EXISTS', message: 'This coaster is already linked to a different Fonz account. That account must disconnect that coaster before you can add it to your account.', status: 404};


/** Auth Error Messages */
export const AUTH_NOT_FOUND = { code: 'ACCOUNT_NOT_FOUND', message: "Account could not be found", status: 404};
export const AUTH_INVALID_PASSWORD = { code: 'INVALID_PASSWORD', message: "Invalid password provided, password should be atleast 12 characters long and less than 72", status: 401};
export const AUTH_INVALID_TOKEN = { code: 'INVALID_TOKEN', message: "Invalid refresh token provided, login again", status: 401};
export const AUTH_INVALID_USER = { code: 'INVALID_USER', message: "There is an account already using this email.", status: 403};
export const AUTH_INVALID_EMAIL = { code: 'INVALID_EMAIL', message: "Invalid email address provided", status: 401};

/** Sessions Error Messages */
export const SESSIONS_NOT_FOUND = { code: 'SESSIONS_NOT_FOUND', message: "Sessions could not be found", status: 404};