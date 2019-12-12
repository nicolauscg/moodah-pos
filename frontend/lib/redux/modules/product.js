"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typesafe_actions_1 = require("typesafe-actions");
const effects_1 = require("redux-saga/effects");
const humps_1 = require("humps");
const react_1 = __importDefault(require("react"));
const api_1 = __importDefault(require("../../utils/api"));
const formatFilters_1 = __importDefault(require("../../utils/formatFilters"));
const moment_1 = __importDefault(require("moment"));
const general_1 = require("./general");
const initialState = {
    productState: {
        kind: 'Fetching'
    },
    productParams: {
        filters: [
            { field: 'type', operator: '=', comparator: 'product' },
        ],
        limit: 0,
        offset: 0
    },
    productAttributesState: {
        kind: 'Fetching'
    },
    productCategories: {
        kind: 'Fetching'
    },
    attributeLineIds: []
};
// reducer
exports.productReducer = (state = initialState, action) => {
    switch (action.type) {
        case "@@product/FETCH_PRODUCT" /* FETCH_PRODUCT */:
            return Object.assign({}, state, { productState: {
                    kind: 'Fetching'
                } });
        case "@@product/FETCH_PRODUCT_SUCCESS" /* FETCH_PRODUCT_SUCCESS */:
            return Object.assign({}, state, { productState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@product/FETCH_PRODUCT_FAILED" /* FETCH_PRODUCT_FAILED */:
            return Object.assign({}, state, { productState: {
                    kind: 'Failed',
                    message: 'Failed'
                } });
        case "@@product/FETCH_PRODUCT_ATTRIBUTES" /* FETCH_PRODUCT_ATTRIBUTES */:
            return Object.assign({}, state, { productAttributesState: {
                    kind: 'Fetching',
                } });
        case "@@product/FETCH_PRODUCT_ATTRIBUTES_SUCCESS" /* FETCH_PRODUCT_ATTRIBUTES_SUCCESS */:
            return Object.assign({}, state, { productAttributesState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@product/ADD_ATTRIBUTE_LINE_IDS" /* ADD_ATTRIBUTE_LINE_IDS */:
            return Object.assign({}, state, { attributeLineIds: [
                    ...state.attributeLineIds,
                    action.payload
                ] });
        case "@@product/EDIT_ATTRIBUTE_LINE_IDS" /* EDIT_ATTRIBUTE_LINE_IDS */:
            return Object.assign({}, state, { attributeLineIds: state.attributeLineIds.map((p, index) => {
                    return (index == action.payload.index) ? action.payload.data : p;
                }) });
        case "@@product/REMOVE_ATTRIBUTE_LINE_IDS" /* REMOVE_ATTRIBUTE_LINE_IDS */:
            return Object.assign({}, state, { attributeLineIds: state.attributeLineIds.filter((p, index) => index != action.payload.index) });
        case "@@product/FETCH_PRODUCT_CATEGORY" /* FETCH_PRODUCT_CATEGORY */:
            return Object.assign({}, state, { productCategories: {
                    kind: 'Fetching'
                } });
        case "@@product/FETCH_PRODUCT_CATEGORY_SUCCESS" /* FETCH_PRODUCT_CATEGORY_SUCCESS */:
            return Object.assign({}, state, { productCategories: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@product/FETCH_PRODUCT_CATEGORY_FAILED" /* FETCH_PRODUCT_CATEGORY_FAILED */:
            return Object.assign({}, state, { productCategories: {
                    kind: 'Failed',
                    message: action.payload
                } });
        default:
            return state;
    }
};
// Actions
exports.getProducts = (params, dispatch) => {
    const formattedFilters = formatFilters_1.default(params.filters);
    return typesafe_actions_1.action("@@product/FETCH_PRODUCT" /* FETCH_PRODUCT */, Object.assign({}, params, { filters: formattedFilters }), dispatch);
};
const getProductsSuccess = (response) => {
    const { results, total } = response;
    const tableRows = Array.isArray(results) ? prepareProductTable(results) : [];
    return typesafe_actions_1.action("@@product/FETCH_PRODUCT_SUCCESS" /* FETCH_PRODUCT_SUCCESS */, { products: tableRows, total });
};
exports.getProductAttributes = (dispatch) => {
    return typesafe_actions_1.action("@@product/FETCH_PRODUCT_ATTRIBUTES" /* FETCH_PRODUCT_ATTRIBUTES */, undefined, dispatch);
};
const getProductAttributesSuccess = (response) => {
    const { results } = response;
    const productAttributes = general_1.toSuggestions(results);
    return typesafe_actions_1.action("@@product/FETCH_PRODUCT_ATTRIBUTES_SUCCESS" /* FETCH_PRODUCT_ATTRIBUTES_SUCCESS */, productAttributes);
};
exports.getAttributeValuesByAttributeId = (dispatch, id, index) => {
    return typesafe_actions_1.action("@@product/FETCH_ATTRIBUTE_VALUES_BY_ATTRIBUTE_ID" /* FETCH_ATTRIBUTE_VALUES_BY_ATTRIBUTE_ID */, { id, index, dispatch }, dispatch);
};
exports.addAttributeLineIds = (dispatch, data) => {
    return typesafe_actions_1.action("@@product/ADD_ATTRIBUTE_LINE_IDS" /* ADD_ATTRIBUTE_LINE_IDS */, data, dispatch);
};
exports.editAttributeLineIds = (dispatch, index, data) => {
    return typesafe_actions_1.action("@@product/EDIT_ATTRIBUTE_LINE_IDS" /* EDIT_ATTRIBUTE_LINE_IDS */, { index, data }, dispatch);
};
exports.removeAttributeLineIds = (dispatch, index) => {
    return typesafe_actions_1.action("@@product/REMOVE_ATTRIBUTE_LINE_IDS" /* REMOVE_ATTRIBUTE_LINE_IDS */, { index }, dispatch);
};
exports.getProductCategories = (dispatch) => {
    return typesafe_actions_1.action("@@product/FETCH_PRODUCT_CATEGORY" /* FETCH_PRODUCT_CATEGORY */, undefined, dispatch);
};
const getProductCategoriesSuccess = (response) => {
    const { results, total } = response;
    const productCategories = general_1.toSuggestions(results);
    return typesafe_actions_1.action("@@product/FETCH_PRODUCT_CATEGORY_SUCCESS" /* FETCH_PRODUCT_CATEGORY_SUCCESS */, { productCategories, total });
};
// Watchers
function* fetchProductAttributesWatcher() {
    yield effects_1.takeLatest("@@product/FETCH_PRODUCT_ATTRIBUTES" /* FETCH_PRODUCT_ATTRIBUTES */, fetchProductAttributes);
}
function* fetchAttributeValuesByAttributeIdWatcher() {
    yield effects_1.takeEvery("@@product/FETCH_ATTRIBUTE_VALUES_BY_ATTRIBUTE_ID" /* FETCH_ATTRIBUTE_VALUES_BY_ATTRIBUTE_ID */, fetchAttributeValuesByAttributeId);
}
function* getProductCategoriesWatcher() {
    yield effects_1.takeLatest("@@product/FETCH_PRODUCT_CATEGORY" /* FETCH_PRODUCT_CATEGORY */, getProductCategoriesSaga);
}
// Sagas
function* fetchProducts(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/product.template', action.payload, { 'Access-Token': token }, action.meta);
        yield effects_1.put(getProductsSuccess(humps_1.camelizeKeys(response)));
    }
    catch (error) {
        // logOut();
        console.log(error);
    }
}
function* fetchProductsWatcher() {
    yield effects_1.takeLatest("@@product/FETCH_PRODUCT" /* FETCH_PRODUCT */, fetchProducts);
}
function* fetchProductAttributes(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/product.attribute', undefined, { 'Access-Token': token }, action.meta);
        yield effects_1.put(getProductAttributesSuccess(humps_1.camelizeKeys(response)));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchAttributeValuesByAttributeId(action) {
    const { id, index, dispatch } = action.payload;
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const filters = formatFilters_1.default([{ field: 'attribute_id', operator: '=', comparator: id }]);
        yield effects_1.put(exports.editAttributeLineIds(dispatch, index, { loading: true, attributeValues: [] }));
        const response = yield effects_1.call(api_1.default.get, '/product.attribute.value', { filters }, { 'Access-Token': token }, action.meta);
        const { results, total } = response;
        const attributeValues = Array.isArray(results) ? results : [];
        const data = { loading: false, attributeValues: general_1.toSuggestions(attributeValues) };
        yield effects_1.put(exports.editAttributeLineIds(dispatch, index, data));
    }
    catch (error) {
        yield effects_1.put(exports.editAttributeLineIds(dispatch, index, { loading: false }));
        console.log(error);
    }
}
function* getProductCategoriesSaga(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/product.category', undefined, { 'Access-Token': token }, action.meta);
        console.log({ response });
        yield effects_1.put(getProductCategoriesSuccess(response));
    }
    catch (error) {
        console.log(error);
    }
}
function* productSaga() {
    yield effects_1.all([
        effects_1.fork(fetchProductsWatcher),
        effects_1.fork(fetchProductAttributesWatcher),
        effects_1.fork(fetchAttributeValuesByAttributeIdWatcher),
        effects_1.fork(getProductCategoriesWatcher)
    ]);
}
exports.productSaga = productSaga;
const prepareProductTable = (products) => {
    return products.map((product) => ({
        logo: (react_1.default.createElement("img", { className: "topbar__avatar-img", src: "https://via.placeholder.com/150" })),
        name: product.name,
        category: product.categId.name,
        brand: '',
        available: `${product.qtyAvailable} in ${product.productVariantIds.length}`,
        update: moment_1.default(product.writeDate).format('dd MM YYYY').toString(),
        status: product.active ? 'Active' : 'Inactive',
    }));
};
exports.ProductColumns = [
    { name: 'logo', title: 'Logo' },
    { name: 'name', title: 'Name' },
    { name: 'category', title: 'Category' },
    { name: 'brand', title: 'Brand' },
    { name: 'available', title: 'Available' },
    { name: 'status', title: 'Status' },
    { name: 'update', title: 'Last Update' }
];
