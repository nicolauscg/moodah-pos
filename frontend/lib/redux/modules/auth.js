"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typesafe_actions_1 = require("typesafe-actions");
const effects_1 = require("redux-saga/effects");
const R = __importStar(require("ramda"));
// @ts-ignore
const api_1 = __importDefault(require("../../utils/api"));
const general_1 = require("./general");
const formatFilters_1 = __importDefault(require("../../utils/formatFilters"));
// Reducer
const initialState = {
    userState: {
        kind: 'Validating',
    },
    resetPasswordState: {
        kind: 'Validating',
    }
};
exports.authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "@@auth/LOG_IN" /* LOG_IN */:
            return Object.assign({}, state, { userState: {
                    kind: 'Guest',
                    authProcess: {
                        kind: 'Loading',
                    },
                    forgotPassProcess: {
                        kind: 'Init'
                    },
                } });
        case "@@auth/LOG_IN_SUCCESS" /* LOG_IN_SUCCESS */:
            return Object.assign({}, state, { userState: {
                    kind: 'User',
                } });
        case "@@auth/LOG_IN_FAILED" /* LOG_IN_FAILED */:
            return Object.assign({}, state, { userState: {
                    kind: 'Guest',
                    authProcess: {
                        kind: 'Failed',
                    },
                    forgotPassProcess: {
                        kind: 'Init'
                    },
                } });
        case "@@auth/AUTHENTICATE" /* AUTHENTICATE */:
            return state;
        case "@@auth/AUTHORIZED" /* AUTHORIZED */:
            return Object.assign({}, state, { userState: {
                    kind: 'User',
                } });
        case "@@auth/UNAUTHORIZED" /* UNAUTHORIZED */:
            return Object.assign({}, state, { userState: {
                    kind: 'Guest',
                    authProcess: {
                        kind: 'Init'
                    },
                    forgotPassProcess: {
                        kind: 'Init'
                    },
                } });
        case "@@auth/REQUEST_RESET_PASSWORD" /* REQUEST_RESET_PASSWORD */:
            return Object.assign({}, state, { userState: {
                    kind: 'Guest',
                    authProcess: {
                        kind: 'Init'
                    },
                    forgotPassProcess: {
                        kind: 'Loading'
                    },
                } });
        case "@@auth/REQUEST_RESET_PASSWORD_SUCCESS" /* REQUEST_RESET_PASSWORD_SUCCESS */:
            return Object.assign({}, state, { userState: {
                    kind: 'Guest',
                    authProcess: {
                        kind: 'Init'
                    },
                    forgotPassProcess: {
                        kind: 'Sent'
                    },
                } });
        case "@@auth/VALIDATE_RESET_TOKEN" /* VALIDATE_RESET_TOKEN */:
            return Object.assign({}, state, { resetPasswordState: {
                    kind: 'Validating'
                } });
        case "@@auth/RESET_TOKEN_VALID" /* RESET_TOKEN_VALID */:
            return Object.assign({}, state, { resetPasswordState: {
                    kind: 'Valid',
                    id: action.payload.id,
                    partnerId: action.payload.partnerId,
                } });
        case "@@auth/RESET_TOKEN_INVALID" /* RESET_TOKEN_INVALID */:
            return Object.assign({}, state, { resetPasswordState: {
                    kind: 'Invalid'
                } });
        case "@@auth/RESET_PASSWORD_SUCCESS" /* RESET_PASSWORD_SUCCESS */:
            return Object.assign({}, state, { resetPasswordState: {
                    kind: 'Redirect'
                } });
        default:
            return state;
    }
};
// Actions
exports.logIn = (formValues) => typesafe_actions_1.action("@@auth/LOG_IN" /* LOG_IN */, formValues);
const loginSuccess = () => typesafe_actions_1.action("@@auth/LOG_IN_SUCCESS" /* LOG_IN_SUCCESS */);
const loginFailed = () => typesafe_actions_1.action("@@auth/LOG_IN_FAILED" /* LOG_IN_FAILED */);
exports.authUser = () => typesafe_actions_1.action("@@auth/AUTHENTICATE" /* AUTHENTICATE */);
const authorize = () => typesafe_actions_1.action("@@auth/AUTHORIZED" /* AUTHORIZED */);
const unauthorize = () => typesafe_actions_1.action("@@auth/UNAUTHORIZED" /* UNAUTHORIZED */);
exports.logOut = () => typesafe_actions_1.action("@@auth/LOG_OUT" /* LOG_OUT */);
exports.requestResetPass = (resetForm) => {
    const { email, db } = resetForm;
    return typesafe_actions_1.action("@@auth/REQUEST_RESET_PASSWORD" /* REQUEST_RESET_PASSWORD */, email, db);
};
exports.validateToken = (token, db) => {
    return typesafe_actions_1.action("@@auth/VALIDATE_RESET_TOKEN" /* VALIDATE_RESET_TOKEN */, token, db);
};
const validToken = (id, partnerId) => {
    return typesafe_actions_1.action("@@auth/RESET_TOKEN_VALID" /* RESET_TOKEN_VALID */, { id, partnerId });
};
const invalidToken = () => typesafe_actions_1.action("@@auth/RESET_TOKEN_INVALID" /* RESET_TOKEN_INVALID */);
exports.resetPassword = (formValues, db) => {
    const { transformedValues, id, partnerId } = prepareResetPassword(formValues);
    return typesafe_actions_1.action("@@auth/RESET_PASSWORD" /* RESET_PASSWORD */, JSON.stringify(transformedValues), { id, partnerId, db });
};
const resetPasswordSuccess = () => typesafe_actions_1.action("@@auth/RESET_PASSWORD_SUCCESS" /* RESET_PASSWORD_SUCCESS */);
// Sagas
function* processLogIn(action) {
    try {
        const { access_token, refresh_token } = yield effects_1.call(api_1.default.post, '/auth/get_tokens', JSON.stringify(action.payload));
        yield effects_1.call(setAccessToken, access_token, refresh_token);
        yield effects_1.put(loginSuccess());
    }
    catch (error) {
        yield effects_1.put(loginFailed());
        yield effects_1.put(general_1.addNotif({
            message: 'Invalid Username or Password',
            type: 'danger'
        }));
    }
}
function* processLogOut() {
    yield effects_1.call(clearAccessToken);
    yield effects_1.put(unauthorize());
}
function* authenticate(action) {
    const token = yield effects_1.call(getAccessToken);
    if (token) {
        const refresh = yield effects_1.call(checkAccessToken);
        if (refresh) {
            try {
                const refreshToken = yield effects_1.call(getRefreshToken);
                const { access_token: newAccessToken } = yield effects_1.call(api_1.default.post, '/auth/refresh_token', JSON.stringify({ refresh_token: refreshToken }));
                yield effects_1.call(setAccessToken, newAccessToken, refreshToken);
                yield effects_1.put(authorize());
            }
            catch (_a) {
                yield effects_1.call(processLogOut);
            }
        }
        else {
            yield effects_1.put(authorize());
        }
    }
    else {
        yield effects_1.call(processLogOut);
    }
}
function* requestResetPassServer(action) {
    try {
        const { access_token: AccessToken } = yield effects_1.call(api_1.default.post, '/auth/get_tokens', JSON.stringify({
            db: action.meta,
            username: 'admin',
            password: 'password',
        }));
        const { params, headers } = yield effects_1.call(prepareFetchUser, action.payload, AccessToken);
        try {
            const { results, total } = yield effects_1.call(api_1.default.get, '/res.users', params, headers);
            if (total > 0) {
                try {
                    const user = results[0];
                    yield effects_1.call(api_1.default.put, `/res.users/${user.id}/action_reset_password`, undefined, { 'Access-Token': AccessToken });
                    yield effects_1.put(typesafe_actions_1.action("@@auth/REQUEST_RESET_PASSWORD_SUCCESS" /* REQUEST_RESET_PASSWORD_SUCCESS */));
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    catch (error) {
        console.log(error);
    }
}
function* validateResetToken(action) {
    try {
        const { uid, access_token: AccessToken } = yield effects_1.call(api_1.default.post, '/auth/get_tokens', JSON.stringify({
            db: action.meta,
            username: 'admin',
            password: 'password',
        }));
        try {
            const { login } = yield effects_1.call(api_1.default.put, `/res.partner/${uid}/signup_retrieve_info`, JSON.stringify({
                token: action.payload
            }), { 'Access-Token': AccessToken });
            try {
                const filters = yield effects_1.call(formatFilters_1.default, [
                    { field: 'login', operator: '=', comparator: login }
                ]);
                const { results } = yield effects_1.call(api_1.default.get, '/res.users', {
                    filters,
                    limit: 1
                }, { 'Access-Token': AccessToken });
                yield effects_1.put(validToken(results[0].id, results[0].partner_id));
            }
            catch (error) {
                console.log(error);
            }
        }
        catch (error) {
            yield effects_1.put(invalidToken());
        }
    }
    catch (error) {
        console.log(error);
    }
}
function* resetPasswordServer(action) {
    try {
        const { uid, access_token: AccessToken } = yield effects_1.call(api_1.default.post, '/auth/get_tokens', JSON.stringify({
            db: action.meta.db,
            username: 'admin',
            password: 'password',
        }));
        try {
            yield effects_1.call(api_1.default.put, `/res.users/${action.meta.id}`, action.payload, { 'Access-Token': AccessToken });
            yield effects_1.call(api_1.default.put, `/res.partner/${action.meta.partnerId}/signup_cancel`, undefined, { 'Access-Token': AccessToken });
            yield effects_1.put(resetPasswordSuccess());
            yield effects_1.put(general_1.addNotif({
                message: 'Password changed successfully!',
                type: 'success'
            }));
        }
        catch (error) {
        }
    }
    catch (error) {
        console.log(error);
    }
}
function* logInWatcher() {
    yield effects_1.takeLatest("@@auth/LOG_IN" /* LOG_IN */, processLogIn);
}
function* logOutWatcher() {
    yield effects_1.takeLatest("@@auth/LOG_OUT" /* LOG_OUT */, processLogOut);
}
function* authenticateWatcher() {
    yield effects_1.takeLatest("@@auth/AUTHENTICATE" /* AUTHENTICATE */, authenticate);
}
function* resetPasswordWatcher() {
    yield [
        effects_1.takeLatest("@@auth/REQUEST_RESET_PASSWORD" /* REQUEST_RESET_PASSWORD */, requestResetPassServer),
        effects_1.takeLatest("@@auth/VALIDATE_RESET_TOKEN" /* VALIDATE_RESET_TOKEN */, validateResetToken),
        effects_1.takeLatest("@@auth/RESET_PASSWORD" /* RESET_PASSWORD */, resetPasswordServer),
    ];
}
function* authSaga() {
    yield effects_1.all([
        effects_1.fork(logInWatcher),
        effects_1.fork(logOutWatcher),
        effects_1.fork(authenticateWatcher),
        effects_1.fork(resetPasswordWatcher),
    ]);
}
exports.authSaga = authSaga;
// Side Effects Services
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const checkAccessToken = () => {
    const accessExpire = localStorage.getItem('accessExpire');
    const expirationDate = accessExpire ? new Date(accessExpire) : new Date();
    const today = new Date();
    if (today > expirationDate) {
        const refreshExpire = localStorage.getItem('refreshExpire');
        const refreshExpirationDate = refreshExpire ? new Date(refreshExpire) : new Date();
        return today < refreshExpirationDate;
    }
    return false;
};
const setAccessToken = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessExpire', getIncreasedDate(EXPIRES_IN));
    localStorage.setItem('refreshExpire', getIncreasedDate(REFRESH_EXPIRES_IN));
};
const clearAccessToken = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessExpire');
    localStorage.removeItem('refreshExpire');
};
const prepareFetchUser = (email, token) => {
    const filters = formatFilters_1.default([
        { field: 'login', operator: '=', comparator: email }
    ]);
    const headers = {
        'Access-Token': token
    };
    return {
        params: {
            filters,
        },
        headers,
    };
};
const prepareResetPassword = (formValues) => {
    const { id, partnerId } = formValues;
    const transformedValues = R.pipe(R.dissoc('id'), R.dissoc('partnerId'), R.dissoc('passwordRepeat'))(formValues);
    return { transformedValues, id, partnerId };
};
// Misc.
const EXPIRES_IN = 600;
const REFRESH_EXPIRES_IN = 7200;
const getIncreasedDate = (increase) => {
    let baseDate = new Date();
    baseDate.setSeconds(baseDate.getSeconds() + increase);
    return baseDate.toString();
};
