"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typesafe_actions_1 = require("typesafe-actions");
const effects_1 = require("redux-saga/effects");
const humps_1 = require("humps");
const react_1 = __importDefault(require("react"));
const R = __importStar(require("ramda"));
const react_redux_1 = require("react-redux");
const api_1 = __importDefault(require("../../utils/api"));
const formatFilters_1 = __importDefault(require("../../utils/formatFilters"));
const general_1 = require("./general");
const Dropzone_1 = __importDefault(require("../../shared/components/Dropzone"));
const initialState = {
    variantState: {
        kind: 'Fetching',
    },
    stockMovesState: {
        kind: 'Fetching',
    },
    imagesState: {
        kind: 'Fetching',
    },
    stockByLocationsState: {
        kind: 'Fetching',
    }
};
// Reducer
exports.variantReducer = (state = initialState, action) => {
    switch (action.type) {
        case "@@variant/FETCH_VARIANT" /* FETCH_VARIANT */:
            return Object.assign({}, state, { variantState: {
                    kind: 'Fetching',
                } });
        case "@@variant/FETCH_VARIANT_SUCCESS" /* FETCH_VARIANT_SUCCESS */:
            return Object.assign({}, state, { variantState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@variant/FETCH_STOCK_MOVES" /* FETCH_STOCK_MOVES */:
            return Object.assign({}, state, { stockMovesState: {
                    kind: 'Fetching',
                } });
        case "@@variant/FETCH_STOCK_MOVES_SUCCESS" /* FETCH_STOCK_MOVES_SUCCESS */:
            return Object.assign({}, state, { stockMovesState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@variant/FETCH_IMAGES" /* FETCH_IMAGES */:
            return Object.assign({}, state, { imagesState: {
                    kind: 'Fetching',
                } });
        case "@@variant/FETCH_IMAGES_SUCCESS" /* FETCH_IMAGES_SUCCESS */:
            return Object.assign({}, state, { imagesState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@variant/FETCH_STOCK_BY_LOCATION" /* FETCH_STOCK_BY_LOCATION */:
            return Object.assign({}, state, { stockByLocationsState: {
                    kind: 'Fetching',
                } });
        case "@@variant/FETCH_STOCK_BY_LOCATION_SUCCESS" /* FETCH_STOCK_BY_LOCATION_SUCCESS */:
            return Object.assign({}, state, { stockByLocationsState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@variant/UPDATE_ORDERPOINT" /* UPDATE_ORDERPOINT */:
            return Object.assign({}, state, { stockByLocationsState: {
                    kind: 'Fetching',
                } });
        default:
            return state;
    }
};
// Actions
exports.getVariant = (id, notif, dispatch, bypassVariant = false) => {
    const type = bypassVariant
        ? "@@variant/FETCH_STOCK_BY_LOCATION" /* FETCH_STOCK_BY_LOCATION */
        : "@@variant/FETCH_VARIANT" /* FETCH_VARIANT */;
    return typesafe_actions_1.action(type, id, {
        dispatch,
        notif,
        bypassVariant,
    });
};
const getVariantSuccess = (response) => {
    const transformedResp = prepareVariantForm(response);
    return typesafe_actions_1.action("@@variant/FETCH_VARIANT_SUCCESS" /* FETCH_VARIANT_SUCCESS */, transformedResp);
};
exports.getStockMoves = (params, dispatch) => {
    const transformedFilters = formatFilters_1.default(params.filters);
    return typesafe_actions_1.action("@@variant/FETCH_STOCK_MOVES" /* FETCH_STOCK_MOVES */, Object.assign({}, params, { filters: transformedFilters }), dispatch);
};
const getStockMovesSuccess = (response) => {
    const { results, total } = response;
    const tableRows = Array.isArray(results) ? prepareStockMoves(results) : [];
    return typesafe_actions_1.action("@@variant/FETCH_STOCK_MOVES_SUCCESS" /* FETCH_STOCK_MOVES_SUCCESS */, { stockMoves: tableRows, total });
};
exports.getImages = (params, id, notif, dispatch) => {
    const transformedFilters = formatFilters_1.default(params.filters);
    return typesafe_actions_1.action("@@variant/FETCH_IMAGES" /* FETCH_IMAGES */, Object.assign({}, params, { filters: transformedFilters }), {
        dispatch,
        id,
        notif,
    });
};
const getImagesSuccess = (response, id) => {
    const { results } = response;
    const images = Array.isArray(results)
        ? results
        : [];
    images.push(react_1.default.createElement(VariantImgDrop, { id: id }));
    const groupedImages = R.splitEvery(4, images);
    return typesafe_actions_1.action("@@variant/FETCH_IMAGES_SUCCESS" /* FETCH_IMAGES_SUCCESS */, groupedImages);
};
exports.removeImage = (id, variantId, notif, dispatch) => {
    return typesafe_actions_1.action("@@variant/DELETE_IMAGE" /* DELETE_IMAGE */, id, {
        dispatch,
        variantId,
        notif,
    });
};
exports.updateVariant = (formValues, notif, dispatch) => {
    const transformedValues = transformVariantForm(formValues);
    return typesafe_actions_1.action("@@variant/UPDATE_VARIANT" /* UPDATE_VARIANT */, JSON.stringify(transformedValues), {
        dispatch,
        notif,
        id: formValues.id,
    });
};
const getStockByLocationSuccess = (stockByLocations, orderpointIds) => {
    return typesafe_actions_1.action("@@variant/FETCH_STOCK_BY_LOCATION_SUCCESS" /* FETCH_STOCK_BY_LOCATION_SUCCESS */, prepareStockByLocation(stockByLocations, orderpointIds));
};
exports.updateOrderpoint = (orderpointVals, id, notif, dispatch) => {
    return typesafe_actions_1.action("@@variant/UPDATE_ORDERPOINT" /* UPDATE_ORDERPOINT */, orderpointVals, {
        notif,
        id,
        locationId: orderpointVals.locationId,
        dispatch
    });
};
const getParentWarehouse = (locationId, dispatch) => typesafe_actions_1.action("@@variant/FETCH_PARENT_WAREHOUSE" /* FETCH_PARENT_WAREHOUSE */, locationId, {
    dispatch,
});
// Sagas
function* fetchVariant(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        yield effects_1.call(api_1.default.put, `/product.product/${action.payload}/update_the_stock`, undefined, { 'Access-Token': token }, action.meta.dispatch);
        const response = yield effects_1.call(api_1.default.get, `/product.product/${action.payload}`, undefined, { 'Access-Token': token }, action.meta.dispatch);
        const _a = yield effects_1.call(humps_1.camelizeKeys, response), { stockLocation, orderpointIds } = _a, variant = __rest(_a, ["stockLocation", "orderpointIds"]);
        if (!action.meta.bypassVariant) {
            yield effects_1.put(getVariantSuccess(variant));
        }
        yield effects_1.put(getStockByLocationSuccess(stockLocation, orderpointIds));
        if (action.meta.notif) {
            yield effects_1.put(general_1.addNotif(action.meta.notif));
        }
    }
    catch (error) {
        console.log(error);
    }
}
function* updateVariantServer(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const variantId = action.meta.id;
        const response = yield effects_1.call(api_1.default.put, `/product.product/${variantId}`, action.payload, { 'Access-Token': token }, action.meta.dispatch);
        yield effects_1.put(exports.getVariant(variantId, action.meta.notif, action.meta.dispatch));
    }
    catch (error) {
        console.log(error);
    }
}
function* variantWatcher() {
    yield effects_1.all([
        effects_1.takeLatest("@@variant/FETCH_VARIANT" /* FETCH_VARIANT */, fetchVariant),
        effects_1.takeLatest("@@variant/UPDATE_VARIANT" /* UPDATE_VARIANT */, updateVariantServer),
    ]);
}
function* fetchStockMoves(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/stock.move', action.payload, { 'Access-Token': token }, action.meta);
        yield effects_1.put(getStockMovesSuccess(humps_1.camelizeKeys(response)));
    }
    catch (error) {
        console.log(error);
    }
}
function* stockMoveWatcher() {
    yield effects_1.takeLatest("@@variant/FETCH_STOCK_MOVES" /* FETCH_STOCK_MOVES */, fetchStockMoves);
}
function* fetchImages(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/ir.attachment', action.payload, { 'Access-Token': token }, action.meta.dispatch);
        yield effects_1.put(getImagesSuccess(humps_1.camelizeKeys(response), action.meta.id));
        if (action.meta.notif) {
            yield effects_1.put(general_1.addNotif(action.meta.notif));
        }
    }
    catch (error) {
        console.log(error);
    }
}
function* deleteImage(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.del, `/ir.attachment/${action.payload}`, undefined, { 'Access-Token': token }, action.meta.dispatch);
        yield effects_1.put(exports.getImages({
            filters: [
                { field: 'res_model', 'operator': '=', comparator: 'product.product' },
                { field: 'res_id', 'operator': '=', comparator: action.meta.variantId },
            ]
        }, action.meta.variantId, action.meta.notif, action.meta.dispatch));
    }
    catch (error) {
        console.log(error);
    }
}
function* imagesWatcher() {
    yield effects_1.all([
        effects_1.takeLatest("@@variant/FETCH_IMAGES" /* FETCH_IMAGES */, fetchImages),
        effects_1.takeLatest("@@variant/DELETE_IMAGE" /* DELETE_IMAGE */, deleteImage),
    ]);
}
function* updateOrderpointServer(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const { id: variantId, locationId, dispatch, } = action.meta;
        yield effects_1.put(getParentWarehouse(locationId, dispatch));
        const { id, error } = yield effects_1.race({
            success: effects_1.take("@@variant/FETCH_PARENT_WAREHOUSE_SUCCESS" /* FETCH_PARENT_WAREHOUSE_SUCCESS */),
            error: effects_1.take("@@variant/FETCH_PARENT_WAREHOUSE_FAILED" /* FETCH_PARENT_WAREHOUSE_FAILED */)
        });
        if (error) {
            return;
        }
        const payload = prepareUpdateOrderpoint(action.payload, id);
        const response = yield effects_1.call(api_1.default.put, `/product.product/${variantId}`, payload, { 'Access-Token': token }, dispatch);
        yield effects_1.put(exports.getVariant(variantId, action.meta.notif, action.meta.dispatch, true));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchParentWarehouse(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const [model, ids] = yield effects_1.call(api_1.default.put, `/stock.location/${action.payload}/get_warehouse`, undefined, { 'Access-Token': token }, action.meta.dispatch);
        yield effects_1.put(typesafe_actions_1.action("@@variant/FETCH_PARENT_WAREHOUSE_SUCCESS" /* FETCH_PARENT_WAREHOUSE_SUCCESS */, ids[0]));
    }
    catch (error) {
        yield effects_1.put(typesafe_actions_1.action("@@variant/FETCH_PARENT_WAREHOUSE_FAILED" /* FETCH_PARENT_WAREHOUSE_FAILED */));
    }
}
function* stockByLocationWatcher() {
    yield effects_1.all([
        effects_1.takeLatest("@@variant/UPDATE_ORDERPOINT" /* UPDATE_ORDERPOINT */, updateOrderpointServer),
        effects_1.takeEvery("@@variant/FETCH_PARENT_WAREHOUSE" /* FETCH_PARENT_WAREHOUSE */, fetchParentWarehouse),
        effects_1.takeEvery("@@variant/FETCH_STOCK_BY_LOCATION" /* FETCH_STOCK_BY_LOCATION */, fetchVariant),
    ]);
}
function* variantSaga() {
    yield effects_1.all([
        effects_1.fork(variantWatcher),
        effects_1.fork(stockMoveWatcher),
        effects_1.fork(imagesWatcher),
        effects_1.fork(stockByLocationWatcher),
    ]);
}
exports.variantSaga = variantSaga;
// Helpers
const prepareVariantForm = (response) => {
    return R.pipe(
    // prepareStockByLocation,
    R.map(general_1.handleNullValue))(response);
};
const prepareStockMoves = (stockMoves) => {
    return R.map(R.pipe(R.evolve({
        locationId: R.prop('displayName'),
        locationDestId: R.prop('displayName'),
        productUom: R.prop('name'),
        state: R.cond([
            [R.equals('draft'), R.always('Draft')],
            [R.equals('waiting'), R.always('Waiting Another Move')],
            [R.equals('partially_available'), R.always('Partially Available')],
            [R.equals('assigned'), R.always('Available')],
            [R.equals('done'), R.always('Done')],
        ]),
    }), R.dissoc('id')))(stockMoves);
};
const transformVariantForm = (formValues) => {
    return R.pipe(R.dissoc('id'), R.dissoc('attributeValueIds'), R.dissoc('displayName'), R.dissoc('lstPrice'), R.dissoc('standardPrice'), R.dissoc('productTmplId'), R.dissoc('image'), R.dissoc('imageSmall'), humps_1.decamelizeKeys)(formValues);
};
exports.StockMoveColumns = [
    { name: 'date', title: 'Date' },
    { name: 'reference', title: 'Reference' },
    { name: 'locationId', title: 'From' },
    { name: 'locationDestId', title: 'Target' },
    { name: 'quantityDone', title: 'Quantity' },
    { name: 'state', title: 'Status' },
];
const VariantImgDrop = react_redux_1.connect()((props) => {
    const { id, dispatch } = props;
    const dropzoneCallback = () => {
        dispatch(exports.getImages({
            filters: [
                { field: 'res_model', 'operator': '=', comparator: 'product.product' },
                { field: 'res_id', 'operator': '=', comparator: id },
            ]
        }, id, {
            message: 'Image successfully uploaded',
            type: 'success'
        }, dispatch));
    };
    const preparePayload = (encoded, fileName, fileType) => {
        return JSON.stringify({
            name: fileName,
            datas: encoded,
            datas_fname: fileName,
            res_model: 'product.product',
            res_id: id,
            mimetype: fileType,
        });
    };
    const endpoint = `/ir.attachment`;
    const token = general_1.getAccessToken();
    const headers = { 'Access-Token': token };
    return (react_1.default.createElement(Dropzone_1.default, { method: "post", endpoint: endpoint, headers: headers, getPayload: preparePayload, callbackAction: dropzoneCallback }));
});
exports.StockByLocationColumns = [
    { name: 'locationId', title: 'Location' },
    { name: 'onHandQty', title: 'On Hand' },
    { name: 'outQty', title: 'Committed' },
    { name: 'availableQty', title: 'Available' },
    { name: 'incomingQty', title: 'Incoming' },
    { name: 'productMinQty', title: 'Reorder Point' },
    { name: 'leadDays', title: 'Lead Time' },
    { name: 'productMaxQty', title: 'Safety Stock' },
];
const mergeWithOrderpoint = R.curry((orderpoints, stockLocation) => {
    const orderpoint = R.find(R.pathEq(['locationId', 'id'], stockLocation.locationId.id))(orderpoints);
    if (orderpoint) {
        return R.pipe(R.mergeDeepLeft(stockLocation), R.assoc('availableQty', R.subtract(R.prop('onHandQty', stockLocation), R.prop('outQty', stockLocation))))(orderpoint);
    }
    return R.pipe(R.assoc('productMinQty', 0), R.assoc('productMaxQty', 0), R.assoc('availableQty', 0), R.assoc('orderpointId', 0), R.assoc('leadDays', 0))(stockLocation);
});
const prepareStockByLocation = (stockByLocations, orderpointIds) => {
    // const { orderpointIds, ...rest } = response
    const fixedOrderpoints = R.map(general_1.renameKeys({ id: 'orderpointId' }), orderpointIds);
    return R.map(R.pipe(general_1.renameKeys({ stockLocationId: 'locationId' }), mergeWithOrderpoint(fixedOrderpoints)))(stockByLocations);
};
const prepareUpdateOrderpoint = (updateVals, warehouseId) => {
    const payload = {
        orderpointIds: [R.assoc('warehouseId', warehouseId, updateVals)]
    };
    return JSON.stringify(humps_1.decamelizeKeys(payload));
};
