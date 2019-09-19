"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typesafe_actions_1 = require("typesafe-actions");
const effects_1 = require("redux-saga/effects");
const humps_1 = require("humps");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const reactstrap_1 = require("reactstrap");
const api_1 = __importDefault(require("../../utils/api"));
const formatFilters_1 = __importDefault(require("../../utils/formatFilters"));
const general_1 = require("./general");
const initialState = {
    locationState: {
        kind: 'Fetching'
    },
    locationParams: {
        filters: [
            { field: 'active', operator: '=', comparator: 'True' }
        ],
        limit: 10,
        offset: 0
    },
    parentLocationState: {
        kind: 'Fetching'
    },
    ownerState: {
        kind: 'Fetching'
    },
    createLocationState: {
        kind: 'Draft'
    },
};
// reducer
exports.locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case "@@location/FETCH_LOCATION" /* FETCH_LOCATION */:
            return Object.assign({}, state, { locationState: {
                    kind: 'Fetching'
                } });
        case "@@location/FETCH_LOCATION_SUCCESS" /* FETCH_LOCATION_SUCCESS */:
            return Object.assign({}, state, { locationState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@location/FETCH_LOCATION_FAILED" /* FETCH_LOCATION_FAILED */:
            return Object.assign({}, state, { locationState: {
                    kind: 'Failed',
                    message: 'Failed'
                } });
        case "@@location/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */:
            return Object.assign({}, state, { locationParams: action.payload });
        case "@@location/FETCH_PARENT_LOCATION" /* FETCH_PARENT_LOCATION */:
            return Object.assign({}, state, { parentLocationState: {
                    kind: 'Fetching'
                } });
        case "@@location/FETCH_PARENT_LOCATION_SUCCESS" /* FETCH_PARENT_LOCATION_SUCCESS */:
            return Object.assign({}, state, { parentLocationState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@location/FETCH_PARENT_LOCATION_FAILED" /* FETCH_PARENT_LOCATION_FAILED */:
            return Object.assign({}, state, { parentLocationState: {
                    kind: 'Failed',
                    message: 'Failed'
                } });
        case "@@location/FETCH_OWNERS" /* FETCH_OWNER */:
            return Object.assign({}, state, { ownerState: {
                    kind: 'Fetching'
                } });
        case "@@location/FETCH_OWNERS_SUCCESS" /* FETCH_OWNER_SUCCESS */:
            return Object.assign({}, state, { ownerState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@location/FETCH_OWNERS_FAILED" /* FETCH_OWNER_FAILED */:
            return Object.assign({}, state, { ownerState: {
                    kind: 'Failed',
                    message: 'Failed'
                } });
        case "@@location/CREATE_LOCATION" /* CREATE_LOCATION */:
            return Object.assign({}, state, { createLocationState: {
                    kind: 'Submit'
                } });
        case "@@location/CREATE_LOCATION_SUCCESS" /* CREATE_LOCATION_SUCCESS */:
            return Object.assign({}, state, { createLocationState: {
                    kind: 'Success',
                    parentLocation: action.payload
                } });
        case "@@location/RESET_CREATE_LOCATION" /* RESET_CREATE_LOCATION */:
            return Object.assign({}, state, { createLocationState: {
                    kind: 'Draft'
                } });
        default:
            return state;
    }
};
// Actions
exports.getLocations = (params, dispatch) => {
    const formattedFilters = formatFilters_1.default(params.filters);
    return typesafe_actions_1.action("@@location/FETCH_LOCATION" /* FETCH_LOCATION */, Object.assign({}, params, { filters: formattedFilters }), dispatch);
};
const getLocationsSuccess = (response) => {
    const { results, total } = response;
    const tableRows = Array.isArray(results) ? prepareLocationTable(results) : [];
    return typesafe_actions_1.action("@@location/FETCH_LOCATION_SUCCESS" /* FETCH_LOCATION_SUCCESS */, { locations: tableRows, total });
};
exports.setParams = (newParams, dispatch) => {
    const { filters } = newParams;
    const appendedFilters = [
        ...filters
    ];
    return typesafe_actions_1.action("@@location/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */, Object.assign({}, newParams, { filters: appendedFilters }), dispatch);
};
exports.getParentLocations = (params, dispatch) => {
    const formattedFilters = formatFilters_1.default(params.filters);
    return typesafe_actions_1.action("@@location/FETCH_PARENT_LOCATION" /* FETCH_PARENT_LOCATION */, Object.assign({}, params, { filters: formattedFilters }), dispatch);
};
const getParentLocationsSuccess = (response) => {
    const { results } = response;
    const selectItems = Array.isArray(results) ? prepareParentLocationSelection(results) : [];
    return typesafe_actions_1.action("@@location/FETCH_PARENT_LOCATION_SUCCESS" /* FETCH_PARENT_LOCATION_SUCCESS */, { parentLocations: selectItems });
};
exports.getOwners = (params, dispatch) => {
    const formattedFilters = formatFilters_1.default(params.filters);
    return typesafe_actions_1.action("@@location/FETCH_OWNERS" /* FETCH_OWNER */, Object.assign({}, params, { filter: formattedFilters }), dispatch);
};
const getOwnersSuccess = (response) => {
    const { results } = response;
    const selectItems = Array.isArray(results) ? prepareOwnerSelection(results) : [];
    return typesafe_actions_1.action("@@location/FETCH_OWNERS_SUCCESS" /* FETCH_OWNER_SUCCESS */, { owners: selectItems });
};
exports.submitLocation = (formValues, dispatch) => {
    return typesafe_actions_1.action("@@location/CREATE_LOCATION" /* CREATE_LOCATION */, formValues, dispatch);
};
const submitLocationSuccess = (id) => typesafe_actions_1.action("@@location/CREATE_LOCATION_SUCCESS" /* CREATE_LOCATION_SUCCESS */, id);
exports.resetSubmitLocation = () => typesafe_actions_1.action("@@location/RESET_CREATE_LOCATION" /* RESET_CREATE_LOCATION */);
// Sagas
function* updateParams(action) {
    yield effects_1.put(exports.getLocations(action.payload, action.meta));
}
function* fetchLocations(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/stock.location', action.payload, { 'Access-Token': token }, action.meta);
        yield effects_1.put(getLocationsSuccess(humps_1.camelizeKeys(response)));
    }
    catch (error) {
        console.log('error:', error);
    }
}
function* createLocation(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.post, '/stock.location', JSON.stringify(humps_1.decamelizeKeys(action.payload)), { 'Access-Token': token }, action.meta);
        yield effects_1.put(submitLocationSuccess(response.id));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchParentLocations(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/stock.location', action.payload, { 'Access-Token': token }, action.meta);
        yield effects_1.put(getParentLocationsSuccess(humps_1.camelizeKeys(response)));
    }
    catch (error) {
        console.log('error:', error);
    }
}
function* fetchOwners(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/res.partner', action.payload, { 'Access-Token': token }, action.meta);
        yield effects_1.put(getOwnersSuccess(humps_1.camelizeKeys(response)));
    }
    catch (error) {
        console.log('error:', error);
    }
}
// Watchers
function* locationsWatcher() {
    yield [
        effects_1.takeLatest("@@location/FETCH_LOCATION" /* FETCH_LOCATION */, fetchLocations),
        effects_1.takeLatest("@@location/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */, updateParams),
        effects_1.takeLatest("@@location/CREATE_LOCATION" /* CREATE_LOCATION */, createLocation)
    ];
}
function* fetchParentLocationWatcher() {
    yield effects_1.takeLatest("@@location/FETCH_PARENT_LOCATION" /* FETCH_PARENT_LOCATION */, fetchParentLocations);
}
function* fetchOwnerWatcher() {
    yield effects_1.takeLatest("@@location/FETCH_OWNERS" /* FETCH_OWNER */, fetchOwners);
}
function* locationSaga() {
    yield effects_1.all([
        effects_1.fork(locationsWatcher),
        effects_1.fork(fetchParentLocationWatcher),
        effects_1.fork(fetchOwnerWatcher),
    ]);
}
exports.locationSaga = locationSaga;
const renderEditButton = (id) => (react_1.default.createElement(react_router_dom_1.Link, { to: `/warehouses/id/locations/edit/${id}` },
    react_1.default.createElement("span", { className: "lnr lnr-pencil" })));
const renderDeleteButton = (id) => (react_1.default.createElement(react_router_dom_1.Link, { to: `/warehouses/id/locations/delete/${id}` },
    react_1.default.createElement("span", { className: "lnr lnr-trash" })));
const renderActionItems = (id) => (react_1.default.createElement(reactstrap_1.Row, null,
    react_1.default.createElement(reactstrap_1.Col, { xs: 'auto' }, renderEditButton(id)),
    react_1.default.createElement(reactstrap_1.Col, { xs: 'auto' }, renderDeleteButton(id))));
const renderBoolean = (stat) => {
    if (stat === true)
        return "Yes";
    else if (stat === false)
        return "No";
    return "Null";
};
exports.LocationColumns = [
    { name: 'displayName', title: 'Nama' },
    { name: 'usage', title: 'Tipe Lokasi' },
    { name: 'parentLocation', title: 'Parent Location' },
    { name: 'scrapLocation', title: 'Lokasi Pembuangan' },
    { name: 'returnLocation', title: 'Lokasi Pengembalian' },
    { name: 'barcode', title: 'Barcode' },
    { name: 'action', title: 'action' }
];
const prepareLocationTable = (locations) => {
    return locations.map(location => ({
        displayName: location.displayName,
        usage: location.usage,
        parentLocation: location.locationId.displayName,
        scrapLocation: location.scrapLocation ? 'Yes' : 'No',
        returnLocation: location.returnLocation ? 'Yes' : 'No',
        barcode: location.barcode,
        action: renderActionItems(location.id),
    }));
};
const prepareParentLocationSelection = (parentLocations) => {
    return parentLocations.map(parent => ({
        label: parent.displayName,
        value: parent.id,
    }));
};
const prepareOwnerSelection = (owners) => {
    return owners.map(owner => ({
        label: owner.name,
        value: owner.id
    }));
};
