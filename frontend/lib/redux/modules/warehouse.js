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
    warehouseState: {
        kind: 'Fetching'
    },
    warehouseParams: {
        filters: [],
        limit: 10,
        offset: 0
    },
};
// reducer
exports.warehouseReducer = (state = initialState, action) => {
    switch (action.type) {
        case "@@warehouse/FETCH_WAREHOUSE" /* FETCH_WAREHOUSE */:
            return Object.assign({}, state, { warehouseState: {
                    kind: 'Fetching'
                } });
        case "@@warehouse/FETCH_WAREHOUSE_SUCCESS" /* FETCH_WAREHOUSE_SUCCESS */:
            return Object.assign({}, state, { warehouseState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@warehouse/FETCH_WAREHOUSE_FAILED" /* FETCH_WAREHOUSE_FAILED */:
            return Object.assign({}, state, { warehouseState: {
                    kind: 'Failed',
                    message: 'Failed'
                } });
        case "@@warehouse/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */:
            return Object.assign({}, state, { offset: action.payload });
        default:
            return state;
    }
};
// Actions
exports.getWarehouses = (params, dispatch) => {
    const formattedFilters = formatFilters_1.default(params.filters);
    return typesafe_actions_1.action("@@warehouse/FETCH_WAREHOUSE" /* FETCH_WAREHOUSE */, Object.assign({}, params, { filters: formattedFilters }), dispatch);
};
const getWarehousesSuccess = (response) => {
    const { results, total } = response;
    const tableRows = Array.isArray(results) ? prepareWarehouseTable(results) : [];
    return typesafe_actions_1.action("@@warehouse/FETCH_WAREHOUSE_SUCCESS" /* FETCH_WAREHOUSE_SUCCESS */, { warehouses: tableRows, total });
};
exports.setParams = (newParams, dispatch) => {
    const { filters } = newParams;
    const appendedFilters = [
        ...filters
    ];
    return typesafe_actions_1.action("@@warehouse/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */, Object.assign({}, newParams, { filters: appendedFilters }), dispatch);
};
// Watchers
function* fetchWarehousesWatcher() {
    yield [
        effects_1.takeLatest("@@warehouse/FETCH_WAREHOUSE" /* FETCH_WAREHOUSE */, fetchWarehouses),
        effects_1.takeLatest("@@warehouse/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */, updateParams)
    ];
}
;
// Sagas
function* updateParams(action) {
    yield effects_1.put(exports.getWarehouses(action.payload, action.meta));
}
function* fetchWarehouses(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/stock.warehouse', action.payload, { 'Access-Token': token }, action.meta);
        yield effects_1.put(getWarehousesSuccess(humps_1.camelizeKeys(response)));
    }
    catch (error) {
        console.log(error);
    }
}
;
function* warehouseSaga() {
    yield effects_1.all([
        effects_1.fork(fetchWarehousesWatcher),
    ]);
}
exports.warehouseSaga = warehouseSaga;
;
const renderEditButton = (id) => (react_1.default.createElement(react_router_dom_1.Link, { to: `/warehouses/id/locations/list/${id}` },
    react_1.default.createElement("span", { className: "lnr lnr-pencil" })));
const renderDeleteButton = (id) => (react_1.default.createElement(react_router_dom_1.Link, { to: `/warehouses/id/locations/deletes/${id}` },
    react_1.default.createElement("span", { className: "lnr lnr-trash" })));
const renderActionItems = (id) => (react_1.default.createElement(reactstrap_1.Row, null,
    react_1.default.createElement(reactstrap_1.Col, { xs: 'auto' }, renderEditButton(id)),
    react_1.default.createElement(reactstrap_1.Col, { xs: 'auto' }, renderDeleteButton(id))));
exports.WarehouseColumns = [
    { name: 'code', title: 'Kode' },
    { name: 'displayName', title: 'Label' },
    { name: 'address', title: 'Alamat' },
    { name: 'province', title: 'Provinsi' },
    { name: 'city', title: 'Kota' },
    { name: 'country', title: 'Negara' },
    { name: 'active', title: 'Status' },
    { name: 'location', title: 'Lokasi' },
    { name: 'action', title: 'action' }
];
const prepareWarehouseTable = (warehouses) => {
    return warehouses.map(warehouse => ({
        code: warehouse.code,
        displayName: warehouse.displayName,
        address: warehouse.address,
        province: warehouse.province,
        city: warehouse.city,
        country: warehouse.country,
        active: warehouse.active,
        location: warehouse.location,
        action: renderActionItems(warehouse.id),
    }));
};
