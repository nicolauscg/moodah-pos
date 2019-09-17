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
const R = __importStar(require("ramda"));
const typesafe_actions_1 = require("typesafe-actions");
const date_fns_tz_1 = require("date-fns-tz");
const id_1 = __importDefault(require("date-fns/locale/id"));
const initialState = {
    notifs: [],
};
// Reducer
exports.generalReducer = (state = initialState, action) => {
    switch (action.type) {
        case "@@general/ADD_NOTIF" /* ADD_NOTIF */:
            return Object.assign({}, state, { notifs: [
                    action.payload,
                    ...state.notifs,
                ] });
        case "@@general/REMOVE_NOTIF" /* REMOVE_NOTIF */:
            return Object.assign({}, state, { notifs: state.notifs.filter(notif => notif.id !== action.payload) });
        default:
            return state;
    }
};
// Actions
exports.addNotif = (notif) => {
    return typesafe_actions_1.action("@@general/ADD_NOTIF" /* ADD_NOTIF */, exports.prepareNotif(notif));
};
exports.removeNotif = (id) => {
    return typesafe_actions_1.action("@@general/REMOVE_NOTIF" /* REMOVE_NOTIF */, id);
};
// Helper functions
exports.handleNullValue = (value) => {
    if (typeof value !== 'number') {
        return value ? value : '';
    }
    return value;
};
exports.getAccessToken = () => localStorage.getItem('accessToken');
exports.toSuggestion = (data) => {
    return R.pipe(exports.renameKeys({
        id: 'value',
    }), R.ifElse(R.has('displayName'), exports.renameKeys({
        displayName: 'label'
    }), exports.renameKeys({
        name: 'label'
    })))(data);
};
exports.toSuggestions = (data) => {
    return R.map(exports.toSuggestion, data);
};
let id = 0;
exports.prepareNotif = (notif) => {
    return Object.assign({ id: id++ }, notif);
};
exports.fromOdooDatetime = (datetime) => {
    const jktTimezone = 'Asia/Jakarta';
    return date_fns_tz_1.utcToZonedTime(`${datetime} Z`, jktTimezone);
    // return format(
    //   date,
    //   pattern,
    //   { timeZone: jktTimezone, awareOfUnicodeTokens: true, locale: idLocale}
    // )
};
exports.formatDatetime = (pattern, datetime) => {
    const jktTimezone = 'Asia/Jakarta';
    return date_fns_tz_1.format(datetime, pattern, { timeZone: jktTimezone, awareOfUnicodeTokens: true, locale: id_1.default });
};
// Ramda cookbook functions
exports.renameKeys = R.curry((keysMap, obj) => R.reduce((acc, key) => R.assoc(keysMap[key] || key, obj[key], acc), {}, R.keys(obj)));
exports.spreadPath = R.curryN(2, R.converge(R.merge, [R.dissocPath, R.pathOr({})]));
// @ts-ignore
exports.mergeProps = R.curryN(2, R.pipe(R.props, R.mergeAll));
