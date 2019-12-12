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
const humps_1 = require("humps");
const R = __importStar(require("ramda"));
const nodoo_1 = require("nodoo");
// @ts-ignore
const api_1 = __importDefault(require("../../utils/api"));
const general_1 = require("./general");
const partner_1 = require("./partner");
const formatFilters_1 = __importDefault(require("../../utils/formatFilters"));
exports.initialState = {
    vendorsState: {
        kind: 'Fetching',
    },
    paymentTermsState: {
        kind: 'Fetching',
    },
    pickingTypesState: {
        kind: 'Fetching',
    },
    variantsState: {
        kind: 'Fetching',
    },
    taxesState: {
        kind: 'Fetching',
    },
    vendorState: {
        kind: 'Fetching',
    },
    defaultsState: {
        kind: 'Fetching',
    },
    productChangeState: {
        kind: 'Init',
    },
    orderLineChangeState: {
        kind: 'Init',
    },
    createOrderState: {
        kind: 'Draft',
    },
    orderState: {
        kind: 'Fetching',
    },
    messagesState: {
        kind: 'Fetching',
    },
    copyOrderState: {
        kind: 'Init',
    },
    orderApprovalState: {
        kind: 'Init',
    },
    ordersState: {
        kind: 'Fetching',
    },
    ordersParams: {
        filters: [],
        limit: 10,
        offset: 0,
    }
};
// Reducer
exports.purchaseReducer = (state = exports.initialState, action) => {
    switch (action.type) {
        case "@@purchase/FETCH_DEFAULTS" /* FETCH_DEFAULTS */:
            return Object.assign({}, state, { vendorsState: {
                    kind: 'Fetching',
                }, paymentTermsState: {
                    kind: 'Fetching',
                }, pricelistsState: {
                    kind: 'Fetching',
                }, pickingTypesState: {
                    kind: 'Fetching',
                }, variantsState: {
                    kind: 'Fetching',
                }, taxesState: {
                    kind: 'Fetching',
                }, usersState: {
                    kind: 'Fetching',
                }, defaultsState: {
                    kind: 'Fetching',
                } });
        case "@@purchase/FETCH_DEFAULTS_SUCCESS" /* FETCH_DEFAULTS_SUCCESS */:
            return Object.assign({}, state, { defaultsState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@purchase/FETCH_VENDORS_SUCCESS" /* FETCH_VENDORS_SUCCESS */:
            return Object.assign({}, state, { vendorsState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@purchase/FETCH_PAYMENT_TERMS_SUCCESS" /* FETCH_PAYMENT_TERMS_SUCCESS */:
            return Object.assign({}, state, { paymentTermsState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@purchase/FETCH_PICKING_TYPES_SUCCESS" /* FETCH_PICKING_TYPES_SUCCESS */:
            return Object.assign({}, state, { pickingTypesState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@purchase/FETCH_VARIANTS_SUCCESS" /* FETCH_VARIANTS_SUCCESS */:
            return Object.assign({}, state, { variantsState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@purchase/FETCH_TAXES_SUCCESS" /* FETCH_TAXES_SUCCESS */:
            return Object.assign({}, state, { taxesState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@purchase/FETCH_VENDOR" /* FETCH_VENDOR */:
            return Object.assign({}, state, { vendorState: {
                    kind: 'Fetching',
                } });
        case "@@purchase/FETCH_VENDOR_SUCCESS" /* FETCH_VENDOR_SUCCESS */:
            return Object.assign({}, state, { vendorState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@purchase/ONCHANGE_PRODUCT" /* ONCHANGE_PRODUCT */:
            return Object.assign({}, state, { productChangeState: {
                    kind: 'Fetching',
                } });
        case "@@purchase/ONCHANGE_PRODUCT_SUCCESS" /* ONCHANGE_PRODUCT_SUCCESS */:
            return Object.assign({}, state, { productChangeState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@purchase/RESET_ONCHANGE_PRODUCT" /* RESET_ONCHANGE_PRODUCT */:
            return Object.assign({}, state, { productChangeState: {
                    kind: 'Init',
                } });
        case "@@purchase/ONCHANGE_ORDER_LINE" /* ONCHANGE_ORDER_LINE */:
            return Object.assign({}, state, { orderLineChangeState: {
                    kind: 'Fetching',
                } });
        case "@@purchase/ONCHANGE_ORDER_LINE_SUCCESS" /* ONCHANGE_ORDER_LINE_SUCCESS */:
            return Object.assign({}, state, { orderLineChangeState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@purchase/RESET_ONCHANGE_ORDER_LINE" /* RESET_ONCHANGE_ORDER_LINE */:
            return Object.assign({}, state, { orderLineChangeState: {
                    kind: 'Init',
                } });
        case "@@purchase/CREATE_ORDER" /* CREATE_ORDER */:
            return Object.assign({}, state, { createOrderState: {
                    kind: 'Submit',
                } });
        case "@@purchase/CREATE_ORDER_SUCCESS" /* CREATE_ORDER_SUCCESS */:
            return Object.assign({}, state, { createOrderState: {
                    kind: 'Success',
                    orderId: action.payload,
                } });
        case "@@purchase/RESET_CREATE_ORDER" /* RESET_CREATE_ORDER */:
            return Object.assign({}, state, { createOrderState: {
                    kind: 'Draft',
                } });
        case "@@purchase/FETCH_ORDER" /* FETCH_ORDER */:
            return Object.assign({}, state, { orderState: {
                    kind: 'Fetching',
                } });
        case "@@purchase/FETCH_ORDER_SUCCESS" /* FETCH_ORDER_SUCCESS */:
            return Object.assign({}, state, { orderState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@purchase/FETCH_MESSAGES" /* FETCH_MESSAGES */:
            return Object.assign({}, state, { messagesState: {
                    kind: 'Fetching',
                } });
        case "@@purchase/FETCH_MESSAGES_SUCCESS" /* FETCH_MESSAGES_SUCCESS */:
            return Object.assign({}, state, { messagesState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@purchase/COPY_ORDER" /* COPY_ORDER */:
            return Object.assign({}, state, { copyOrderState: {
                    kind: 'Fetching',
                } });
        case "@@purchase/COPY_ORDER_SUCCESS" /* COPY_ORDER_SUCCESS */:
            return Object.assign({}, state, { copyOrderState: {
                    kind: 'Success',
                    orderId: action.payload,
                } });
        case "@@purchase/RESET_COPY_ORDER" /* RESET_COPY_ORDER */:
            return Object.assign({}, state, { copyOrderState: {
                    kind: 'Init'
                } });
        case "@@purchase/SUBMIT_APPROVAL" /* SUBMIT_APPROVAL */:
            return Object.assign({}, state, { orderApprovalState: {
                    kind: 'Submit'
                } });
        case "@@purchase/RESET_APPROVAL" /* RESET_APPROVAL */:
            return Object.assign({}, state, { orderApprovalState: {
                    kind: 'Init'
                } });
        case "@@purchase/FETCH_ORDERS" /* FETCH_ORDERS */:
            return Object.assign({}, state, { ordersState: {
                    kind: 'Fetching',
                } });
        case "@@purchase/FETCH_ORDERS_SUCCESS" /* FETCH_ORDERS_SUCCESS */:
            return Object.assign({}, state, { ordersState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@purchase/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */:
            return Object.assign({}, state, { ordersParams: action.payload });
        default:
            return state;
    }
};
// Actions
exports.getDefaults = (dispatch) => {
    const payload = [
        "state",
        "picking_count",
        "picking_ids",
        "invoice_count",
        "invoice_ids",
        "name",
        "partner_id",
        "partner_ref",
        "currency_id",
        "is_shipped",
        "date_order",
        "origin",
        "company_id",
        "order_line",
        "amount_untaxed",
        "amount_tax",
        "amount_total",
        "notes",
        "date_planned",
        "picking_type_id",
        "dest_address_id",
        "default_location_dest_id_usage",
        "incoterm_id",
        "invoice_status",
        "payment_term_id",
        "fiscal_position_id",
        "date_approve",
        "message_follower_ids",
        "activity_ids",
        "message_ids"
    ];
    return typesafe_actions_1.action("@@purchase/FETCH_DEFAULTS" /* FETCH_DEFAULTS */, payload, dispatch);
};
exports.getDefaultsSuccess = (response) => {
    return typesafe_actions_1.action("@@purchase/FETCH_DEFAULTS_SUCCESS" /* FETCH_DEFAULTS_SUCCESS */, response);
};
exports.getMasters = (dispatch) => {
    const vendorFilters = formatFilters_1.default([
        { field: 'supplier', operator: '=', comparator: 'True' },
        { field: 'type', operator: '=', comparator: 'contact' },
    ]);
    const taxFilters = formatFilters_1.default([
        { field: 'type_tax_use', operator: '=', comparator: 'purchase' },
    ]);
    const variantFilters = formatFilters_1.default([
        { field: 'purchase_ok', operator: '=', comparator: 'True' },
    ]);
    const pickingTypeFilters = formatFilters_1.default([
        { field: 'code', operator: '=', comparator: 'incoming' },
        { field: 'warehouse_id', operator: '!=', comparator: false },
    ]);
    return typesafe_actions_1.action("@@purchase/FETCH_MASTERS" /* FETCH_MASTERS */, {
        vendorParams: {
            filters: vendorFilters,
        },
        taxParams: {
            filters: taxFilters,
        },
        variantParams: {
            filters: variantFilters,
        },
        pickingTypeParams: {
            filters: pickingTypeFilters,
        }
    }, dispatch);
};
const getVendorsSuccess = (response) => {
    const { results } = response;
    const vendors = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    return typesafe_actions_1.action("@@purchase/FETCH_VENDORS_SUCCESS" /* FETCH_VENDORS_SUCCESS */, vendors);
};
const getPaymentTermsSuccess = (response) => {
    const { results } = response;
    const paymentTerms = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    return typesafe_actions_1.action("@@purchase/FETCH_PAYMENT_TERMS_SUCCESS" /* FETCH_PAYMENT_TERMS_SUCCESS */, paymentTerms);
};
const getPickingTypesSuccess = (response) => {
    const { results } = response;
    const pickingTypes = Array.isArray(results) ? preparePickingTypes(results) : [];
    return typesafe_actions_1.action("@@purchase/FETCH_PICKING_TYPES_SUCCESS" /* FETCH_PICKING_TYPES_SUCCESS */, pickingTypes);
};
const getVariantsSuccess = (response) => {
    const { results } = response;
    const variants = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    return typesafe_actions_1.action("@@purchase/FETCH_VARIANTS_SUCCESS" /* FETCH_VARIANTS_SUCCESS */, variants);
};
const getTaxesSuccess = (response) => {
    const { results } = response;
    const taxes = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    return typesafe_actions_1.action("@@purchase/FETCH_TAXES_SUCCESS" /* FETCH_TAXES_SUCCESS */, taxes);
};
exports.getVendor = (id, dispatch) => {
    return typesafe_actions_1.action("@@purchase/FETCH_VENDOR" /* FETCH_VENDOR */, id, dispatch);
};
const getVendorSuccess = (response) => {
    return typesafe_actions_1.action("@@purchase/FETCH_VENDOR_SUCCESS" /* FETCH_VENDOR_SUCCESS */, partner_1.preparePartnerForm(response));
};
exports.handleProductChange = (values, lineVals, field) => {
    const payload = prepareProductChange(values, lineVals);
    return typesafe_actions_1.action("@@purchase/ONCHANGE_PRODUCT" /* ONCHANGE_PRODUCT */, payload, {
        id: lineVals.id,
        field,
    });
};
const handleProductChangeSuccess = (response, id) => {
    const payload = transformProductChange(response);
    return typesafe_actions_1.action("@@purchase/ONCHANGE_PRODUCT_SUCCESS" /* ONCHANGE_PRODUCT_SUCCESS */, R.assoc('id', id, payload));
};
exports.resetProductChange = () => typesafe_actions_1.action("@@purchase/RESET_ONCHANGE_PRODUCT" /* RESET_ONCHANGE_PRODUCT */);
exports.handleOrderLineChange = (values, lineVals) => {
    return typesafe_actions_1.action("@@purchase/ONCHANGE_ORDER_LINE" /* ONCHANGE_ORDER_LINE */, transformOrder(values, lineVals));
};
const handleOrderLineChangeSuccess = (response) => {
    return typesafe_actions_1.action("@@purchase/ONCHANGE_ORDER_LINE_SUCCESS" /* ONCHANGE_ORDER_LINE_SUCCESS */, R.pipe(R.dissoc('orderLine'), R.evolve({
        amountUntaxed: (value) => Number(value.toFixed(2))
    }))(response));
};
exports.createOrder = (values, dispatch) => {
    return typesafe_actions_1.action("@@purchase/CREATE_ORDER" /* CREATE_ORDER */, transformOrderForm(values), dispatch);
};
const createOrderSuccess = (id) => {
    return typesafe_actions_1.action("@@purchase/CREATE_ORDER_SUCCESS" /* CREATE_ORDER_SUCCESS */, id);
};
exports.resetCreateOrder = () => typesafe_actions_1.action("@@purchase/RESET_CREATE_ORDER" /* RESET_CREATE_ORDER */);
exports.getOrder = (id, dispatch) => {
    return typesafe_actions_1.action("@@purchase/FETCH_ORDER" /* FETCH_ORDER */, id, dispatch);
};
const getOrderSuccess = (response) => {
    return typesafe_actions_1.action("@@purchase/FETCH_ORDER_SUCCESS" /* FETCH_ORDER_SUCCESS */, prepareOrderForm(response));
};
const getMessages = (messageIds, dispatch) => {
    const ids = R.map(R.prop('id'))(messageIds);
    const payload = {
        domain: [['id', 'in', ids]],
        limit: 100,
    };
    return typesafe_actions_1.action("@@purchase/FETCH_MESSAGES" /* FETCH_MESSAGES */, payload, dispatch);
};
const getMessagesSuccess = (response) => {
    const messages = R.map(R.evolve({
        date: R.partial(general_1.fromOdooDatetime, ['dd MMM YYYY HH:mm:ss'])
    }))(response);
    return typesafe_actions_1.action("@@purchase/FETCH_MESSAGES_SUCCESS" /* FETCH_MESSAGES_SUCCESS */, messages);
};
exports.updateOrder = (values, deletedLines, dispatch) => {
    return typesafe_actions_1.action("@@purchase/UPDATE_ORDER" /* UPDATE_ORDER */, transformOrderForm(values, deletedLines), {
        dispatch,
        id: values.id,
    });
};
exports.doAction = (id, action, name, dispatch) => {
    let method = '';
    switch (action) {
        case 'print':
            return typesafe_actions_1.action("@@purchase/PRINT_QUOTATION" /* PRINT_QUOTATION */, {
                'report_name': 'sale.report_PurchaseOrder',
                'ids': [30]
            }, { id, name, dispatch });
        case 'copy':
            method = 'copy';
            break;
        default:
            method = 'force_quotation_send';
            break;
    }
    return typesafe_actions_1.action("@@purchase/EXECUTE_ACTION" /* EXECUTE_ACTION */, method, { id, name, dispatch });
};
exports.resetCopyOrder = () => typesafe_actions_1.action("@@purchase/RESET_COPY_ORDER" /* RESET_COPY_ORDER */);
exports.submitApproval = (id, option, dispatch) => {
    const method = option === 'accept'
        ? 'action_confirm'
        : 'action_cancel';
    return typesafe_actions_1.action("@@purchase/SUBMIT_APPROVAL" /* SUBMIT_APPROVAL */, method, { id, dispatch });
};
exports.getOrders = (params, dispatch) => {
    const formattedFilters = formatFilters_1.default(params.filters);
    return typesafe_actions_1.action("@@purchase/FETCH_ORDERS" /* FETCH_ORDERS */, Object.assign({}, params, { filters: formattedFilters }), dispatch);
};
const getOrdersSuccess = (response) => {
    const { results, total } = response;
    const orders = Array.isArray(results) ? prepareOrderTable(results) : [];
    return typesafe_actions_1.action("@@purchase/FETCH_ORDERS_SUCCESS" /* FETCH_ORDERS_SUCCESS */, { orders, total });
};
exports.setParams = (newParams, dispatch) => {
    const { filters } = newParams;
    // const appendedFilters = [
    //   ...filters,
    //   { field: 'type', operator: '=', comparator: 'contact' },
    // ]
    return typesafe_actions_1.action("@@purchase/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */, 
    // { ...newParams, filters: appendedFilters },
    newParams, dispatch);
};
// Sagas
function* fetchDefaults(action) {
    try {
        const response = yield effects_1.call(fetchDefaultGet, 'purchase.order', action.payload);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(exports.getMasters(action.meta));
        const { vendors, paymentTerms, pickingTypes } = yield effects_1.all({
            vendors: effects_1.take("@@purchase/FETCH_VENDORS_SUCCESS" /* FETCH_VENDORS_SUCCESS */),
            paymentTerms: effects_1.take("@@purchase/FETCH_PAYMENT_TERMS_SUCCESS" /* FETCH_PAYMENT_TERMS_SUCCESS */),
            pickingTypes: effects_1.take("@@purchase/FETCH_PICKING_TYPES_SUCCESS" /* FETCH_PICKING_TYPES_SUCCESS */),
        });
        if (vendors && paymentTerms && pickingTypes) {
            yield effects_1.put(exports.getDefaultsSuccess(camelizedResp));
        }
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchVendors(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const { vendorParams } = action.payload;
        const response = yield effects_1.call(api_1.default.get, '/res.partner', vendorParams, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(getVendorsSuccess(camelizedResp));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchPaymentTerms(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/account.payment.term', undefined, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(getPaymentTermsSuccess(camelizedResp));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchPickingTypes(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const { pickingTypeParams } = action.payload;
        const response = yield effects_1.call(api_1.default.get, '/stock.picking.type', pickingTypeParams, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(getPickingTypesSuccess(camelizedResp));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchVariants(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const { variantParams } = action.payload;
        const response = yield effects_1.call(api_1.default.get, '/product.product', variantParams, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(getVariantsSuccess(camelizedResp));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchTaxes(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const { taxParams } = action.payload;
        const response = yield effects_1.call(api_1.default.get, '/account.tax', taxParams, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(getTaxesSuccess(camelizedResp));
    }
    catch (error) {
        console.log(error);
    }
}
function* masterWatcher() {
    yield effects_1.all([
        effects_1.takeLatest("@@purchase/FETCH_DEFAULTS" /* FETCH_DEFAULTS */, fetchDefaults),
        effects_1.takeLatest("@@purchase/FETCH_MASTERS" /* FETCH_MASTERS */, fetchVendors),
        effects_1.takeLatest("@@purchase/FETCH_MASTERS" /* FETCH_MASTERS */, fetchPaymentTerms),
        effects_1.takeLatest("@@purchase/FETCH_MASTERS" /* FETCH_MASTERS */, fetchPickingTypes),
        effects_1.takeLatest("@@purchase/FETCH_MASTERS" /* FETCH_MASTERS */, fetchVariants),
        effects_1.takeLatest("@@purchase/FETCH_MASTERS" /* FETCH_MASTERS */, fetchTaxes),
    ]);
}
function* fetchVendor(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, `/res.partner/${action.payload}`, undefined, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(getVendorSuccess(camelizedResp));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchChangeProduct(action) {
    try {
        const { value } = yield effects_1.call(fetchOnChangeProduct, action.payload, action.meta.field);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, value);
        yield effects_1.put(handleProductChangeSuccess(camelizedResp, action.meta.id));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchChangeOrderLine(action) {
    try {
        const { value } = yield effects_1.call(fetchOnChangeOrderLine, action.payload);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, value);
        yield effects_1.put(handleOrderLineChangeSuccess(camelizedResp));
    }
    catch (error) {
        console.log(error);
    }
}
function* postOrder(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.post, '/purchase.order', JSON.stringify(action.payload), { 'Access-Token': token }, action.meta);
        yield effects_1.put(general_1.addNotif({
            message: 'Penawaran berhasil dibuat',
            type: 'success'
        }));
        yield effects_1.call(api_1.default.put, `/purchase.order/${response.id}/action_set_date_planned`, undefined, { 'Access-Token': token }, action.meta);
        yield effects_1.put(createOrderSuccess(response.id));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchOrder(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        console.log('masuk fetchOrder');
        yield effects_1.put(exports.getDefaults(action.meta));
        const response = yield effects_1.call(api_1.default.get, `/purchase.order/${action.payload}`, undefined, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        const defaultsDone = yield effects_1.take("@@purchase/FETCH_DEFAULTS_SUCCESS" /* FETCH_DEFAULTS_SUCCESS */);
        if (defaultsDone) {
            yield effects_1.put(getOrderSuccess(camelizedResp));
            yield effects_1.put(getMessages(camelizedResp.messageIds, action.meta));
        }
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchMessages(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.put, `/mail.message/1/message_fetch`, JSON.stringify(action.payload), { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(getMessagesSuccess(camelizedResp));
    }
    catch (error) {
        console.log(error);
    }
}
function* updateOrderServer(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const {} = action.payload;
        const response = yield effects_1.call(api_1.default.put, `/purchase.order/${action.meta.id}`, JSON.stringify(action.payload), { 'Access-Token': token }, action.meta.dispatch);
        // yield call(
        //   api.put,
        //   `/purchase.order/${action.meta.id}/action_set_date_planned`,
        //   undefined,
        //   { 'Access-Token': token },
        //   action.meta.dispatch,
        // )
        yield effects_1.put(general_1.addNotif({
            message: 'Penawaran berhasil diperbarui',
            type: 'success'
        }));
        yield effects_1.put(exports.getOrder(action.meta.id, action.meta.dispatch));
    }
    catch (error) {
        console.log(error);
    }
}
function* executeAction(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        if (action.payload === 'copy') {
            yield effects_1.put(typesafe_actions_1.action("@@purchase/COPY_ORDER" /* COPY_ORDER */));
        }
        const response = yield effects_1.call(api_1.default.put, `/purchase.order/${action.meta.id}/${action.payload}`, undefined, { 'Access-Token': token }, action.meta.dispatch);
        if (action.payload === 'force_quotation_send') {
            yield effects_1.put(general_1.addNotif({
                message: `${action.meta.name} berhasil dikirim`,
                type: 'success'
            }));
        }
        if (action.payload === 'copy') {
            yield effects_1.put(typesafe_actions_1.action("@@purchase/COPY_ORDER_SUCCESS" /* COPY_ORDER_SUCCESS */, response[1][0]));
        }
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchReport(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.put, '/report/get_pdf', JSON.stringify(action.payload), { 'Access-Token': token }, action.meta.dispatch);
        yield effects_1.call(downloadReport, response, action.meta.name);
    }
    catch (error) {
        console.log(error);
    }
}
function* postApproval(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const { id, dispatch } = action.meta;
        const response = yield effects_1.call(api_1.default.put, `/purchase.order/${id}/${action.payload}`, undefined, { 'Access-Token': token }, dispatch);
        yield effects_1.put(typesafe_actions_1.action("@@purchase/RESET_APPROVAL" /* RESET_APPROVAL */));
        yield effects_1.put(exports.getOrder(id, dispatch));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchOrders(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/purchase.order/', action.payload, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(getOrdersSuccess(camelizedResp));
    }
    catch (error) {
        console.log(error);
    }
}
function* updateParams(action) {
    yield effects_1.put(exports.getOrders(action.payload, action.meta));
}
function* orderWatcher() {
    yield effects_1.all([
        effects_1.takeLatest("@@purchase/FETCH_VENDOR" /* FETCH_VENDOR */, fetchVendor),
        effects_1.takeLatest("@@purchase/ONCHANGE_PRODUCT" /* ONCHANGE_PRODUCT */, fetchChangeProduct),
        effects_1.takeLatest("@@purchase/ONCHANGE_ORDER_LINE" /* ONCHANGE_ORDER_LINE */, fetchChangeOrderLine),
        effects_1.takeLatest("@@purchase/CREATE_ORDER" /* CREATE_ORDER */, postOrder),
        effects_1.takeLatest("@@purchase/FETCH_ORDER" /* FETCH_ORDER */, fetchOrder),
        effects_1.takeLatest("@@purchase/FETCH_MESSAGES" /* FETCH_MESSAGES */, fetchMessages),
        effects_1.takeLatest("@@purchase/UPDATE_ORDER" /* UPDATE_ORDER */, updateOrderServer),
        effects_1.takeEvery("@@purchase/EXECUTE_ACTION" /* EXECUTE_ACTION */, executeAction),
        effects_1.takeLatest("@@purchase/PRINT_QUOTATION" /* PRINT_QUOTATION */, fetchReport),
        effects_1.takeLatest("@@purchase/SUBMIT_APPROVAL" /* SUBMIT_APPROVAL */, postApproval),
        effects_1.takeLatest("@@purchase/FETCH_ORDERS" /* FETCH_ORDERS */, fetchOrders),
        effects_1.takeLatest("@@purchase/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */, updateParams),
    ]);
}
function* purchaseSaga() {
    yield effects_1.all([
        effects_1.fork(masterWatcher),
        effects_1.fork(orderWatcher),
    ]);
}
exports.purchaseSaga = purchaseSaga;
// Nodoo
const authenticatedClient = nodoo_1.createAuthenticatedClient(nodoo_1.createSecureClientOptions('odoo.topbrand.rubyh.co'), nodoo_1.createAuthenticationData('topbrand', 'admin', 'password'), 1);
const fetchDefaultGet = (model, fieldsList) => {
    return new Promise((resolve, reject) => {
        authenticatedClient.fold(error => {
            reject(error);
        }, authenticatedClient => {
            nodoo_1.executeAuthenticatedClient(authenticatedClient, nodoo_1.createDefaultGet(model, fieldsList), (result) => {
                result.fold((error) => {
                    reject(error);
                }, (result) => {
                    switch (result.kind) {
                        case 'defaultGet': {
                            resolve(result.result);
                            break;
                        }
                        default:
                            break;
                    }
                });
            });
        });
    });
};
const fetchOnChangeProduct = (vals, field) => {
    return new Promise((resolve, reject) => {
        authenticatedClient.fold(error => {
            reject(error);
        }, authenticatedClient => {
            nodoo_1.executeAuthenticatedClient(authenticatedClient, nodoo_1.createOnChange('purchase.order.line', vals, [
                field,
            ], {
                'currency_id': '',
                'state': '',
                'sequence': '',
                'product_id': '1',
                'name': '',
                'move_dest_ids': '',
                'date_planned': '1',
                'company_id': '',
                'account_analytic_id': '',
                'analytic_tag_ids': '',
                'product_qty': '1',
                'qty_received': '1',
                'qty_invoiced': '1',
                'product_uom': '1',
                'price_unit': '1',
                'taxes_id': '1',
                'price_subtotal': '',
            }), (result) => {
                result.fold((error) => {
                    reject(error);
                }, (result) => {
                    switch (result.kind) {
                        case 'onChange': {
                            resolve(result.result);
                            break;
                        }
                        default:
                            break;
                    }
                });
            });
        });
    });
};
const fetchOnChangeOrderLine = (vals) => {
    return new Promise((resolve, reject) => {
        authenticatedClient.fold(error => {
            reject(error);
        }, authenticatedClient => {
            nodoo_1.executeAuthenticatedClient(authenticatedClient, nodoo_1.createOnChange('purchase.order', vals, [
                'order_line',
            ], {
                'state': '1',
                'picking_count': '',
                'picking_ids': '1',
                'invoice_count': '',
                'invoice_ids': '',
                'name': '',
                'partner_id': '1',
                'partner_ref': '',
                'currency_id': '1',
                'is_shipped': '',
                'date_order': '',
                'origin': '',
                'company_id': '1',
                'order_line': '1',
                'order_line.currency_id': '',
                'order_line.state': '',
                'order_line.sequence': '',
                'order_line.product_id': '1',
                'order_line.name': '',
                'order_line.move_dest_ids': '',
                'order_line.date_planned': '1',
                'order_line.company_id': '',
                'order_line.account_analytic_id': '',
                'order_line.analytic_tag_ids': '',
                'order_line.product_qty': '1',
                'order_line.qty_received': '1',
                'order_line.qty_invoiced': '1',
                'order_line.product_uom': '1',
                'order_line.price_unit': '1',
                'order_line.taxes_id': '1',
                'order_line.price_subtotal': '',
                'order_line.invoice_lines': '1',
                'order_line.move_ids': '1',
                'amount_untaxed': '',
                'amount_tax': '',
                'amount_total': '',
                'notes': '',
                'date_planned': '',
                'picking_type_id': '1',
                'dest_address_id': '',
                'default_location_dest_id_usage': '',
                'incoterm_id': '',
                'invoice_status': '',
                'payment_term_id': '',
                'fiscal_position_id': '1',
                'date_approve': '',
                'message_follower_ids': '',
                'activity_ids': '',
                'message_ids': ''
            }), (result) => {
                result.fold((error) => {
                    reject(error);
                }, (result) => {
                    switch (result.kind) {
                        case 'onChange': {
                            resolve(result.result);
                            break;
                        }
                        default:
                            break;
                    }
                });
            });
        });
    });
};
// Misc.
exports.OrderLineColumns = [
    { name: 'productId', title: 'Product' },
    { name: 'name', title: 'Description' },
    { name: 'datePlanned', title: 'Tanggal Pengiriman' },
    { name: 'productQty', title: 'Qty' },
    { name: 'priceUnit', title: 'Price' },
    { name: 'taxesId', title: 'Taxes' },
    { name: 'priceSubtotal', title: 'Subtotal' },
];
exports.OrderColumns = [
    { name: 'name', title: 'Nomor' },
    { name: 'dateOrder', title: 'Tanggal Buat' },
    { name: 'requestedDate', title: 'Tanggal Pengiriman' },
    { name: 'commitmentDate', title: 'Estimasi Sampai' },
    { name: 'partnerId', title: 'Customer' },
    { name: 'amountTotal', title: 'Total' },
    { name: 'state', title: 'Status' },
];
exports.QuoteStates = ['draft', 'sent'];
const OrderState = {
    draft: 'Draft',
    sent: 'Quotation Sent',
    sale: 'Sales Order',
    done: 'Done',
    cancel: 'Cancelled',
};
const InvoiceState = {
    draft: 'Draft',
    open: 'Open',
    cancel: 'Cancelled',
    paid: 'Paid',
};
const PickingState = {
    draft: 'Draft',
    waiting: 'Waiting Another Operation',
    confirmed: 'Waiting',
    assigned: 'Ready',
    done: 'Done',
    cancel: 'Cancelled',
};
const groupCustomers = (customers) => {
    const contacts = R.filter(R.propEq('type', 'contact'), customers);
    const invoices = R.filter(R.propEq('type', 'invoice'), customers);
    const deliveries = R.filter(R.propEq('type', 'delivery'), customers);
    return { contacts, invoices, deliveries };
};
const getValue = R.ifElse(R.equals(null), R.always(false), R.prop('value'));
const prepareProductChange = (vals, lineVals) => {
    // const formatDatetime = datetime => {
    //   if (datetime) {
    //     return format(datetime, 'YYYY-MM-dd HH:mm:ss', { awareOfUnicodeTokens: true })
    //   }
    //   return datetime
    // }
    // const formatDate = date => {
    //   if (date) {
    //     format(date, 'YYYY-MM-dd', { awareOfUnicodeTokens: true })
    //   }
    //   return date
    // }
    const orderId = R.pipe(R.dissoc('partnerInvoiceId'), R.dissoc('partnerShippingId'), R.dissoc('orderLine'), R.evolve({
        partnerId: getValue,
        warehouseId: getValue,
        pricelistId: getValue,
        paymentTermId: getValue,
        userId: getValue,
        datePlanned: R.ifElse(R.isNil, R.identity, R.partial(general_1.formatDatetime, ['YYYY-MM-dd HH:mm:ss'])),
        dateOrder: R.ifElse(R.isNil, R.identity, R.partial(general_1.formatDatetime, ['YYYY-MM-dd HH:mm:ss'])),
    }))(vals);
    const taxesId = lineVals.taxesId
        ? [[6, false, [lineVals.taxesId.value]]]
        : lineVals.taxesId;
    const orderLine = R.pipe(R.evolve({
        productId: getValue,
        datePlanned: R.ifElse(R.isNil, R.identity, R.partial(general_1.formatDatetime, ['YYYY-MM-dd HH:mm:ss'])),
    }), R.assoc('orderId', orderId), R.assoc('taxesId', taxesId), 
    // @ts-ignore
    humps_1.decamelizeKeys)(lineVals);
    return orderLine;
};
const transformProductChange = (response) => {
    return R.pipe(R.dissoc('currencyId'), R.evolve({
        taxesId: R.pipe(R.pipe(R.slice(1, 2), R.head), 
        // @ts-ignore
        R.nth(1)),
        productUom: R.head,
        datePlanned: R.ifElse(R.isNil, R.identity, general_1.fromOdooDatetime),
        priceSubtotal: (value) => Number(value.toFixed(2)),
    }))(response);
};
const transformOrder = (order, orderLine) => {
    const handleTaxesId = (taxesId) => {
        return taxesId
            ? ([[6, false, [taxesId.value]]])
            : taxesId;
    };
    const toRelationTuple = (line) => {
        return [0, false, line];
    };
    // @ts-ignore
    const transOrderLine = R.pipe(R.map(R.pipe(R.dissoc('id'), R.evolve({
        productId: getValue,
        productUom: R.ifElse(R.equals(null), R.always(false), R.identity),
        taxesId: handleTaxesId,
        datePlanned: R.ifElse(R.isNil, R.identity, R.partial(general_1.formatDatetime, ['YYYY-MM-dd HH:mm:ss'])),
    }), 
    // @ts-ignore
    humps_1.decamelizeKeys)), R.map(toRelationTuple))(orderLine);
    return R.pipe(R.evolve({
        partnerId: getValue,
        pickingTypeId: getValue,
        paymentTermId: getValue,
        datePlanned: R.partial(general_1.formatDatetime, ['YYYY-MM-dd HH:mm:ss']),
        dateOrder: R.partial(general_1.formatDatetime, ['YYYY-MM-dd HH:mm:ss']),
    }), R.assoc('orderLine', transOrderLine), R.dissoc('deletedLines'), 
    // @ts-ignore
    humps_1.decamelizeKeys)(order);
};
const transformOrderForm = (orderVals, deletedLines = []) => {
    const addDeletedLines = orderLine => {
        if (deletedLines.length) {
            return R.concat(orderLine, R.map(R.objOf('id'), deletedLines));
        }
        return orderLine;
    };
    const handleOrderLine = R.pipe(R.map(R.pipe(R.ifElse(R.pipe(R.prop('id'), R.contains('virtual')), R.dissoc('id'), R.identity), R.evolve({
        productId: getValue,
        taxesId: R.ifElse(R.isNil, R.always([[6, 0, []]]), R.pipe(R.prop('value'), R.of, R.of, 
        // @ts-ignore
        R.concat([6, 0]), R.of)),
    }), humps_1.decamelizeKeys)), addDeletedLines);
    return R.pipe(R.evolve({
        partnerId: getValue,
        partnerInvoiceId: getValue,
        partnerShippingId: getValue,
        pickingTypeId: getValue,
        paymentTermId: getValue,
        orderLine: handleOrderLine,
    }), R.ifElse(R.has('id'), R.dissoc('id'), R.identity), humps_1.decamelizeKeys)(orderVals);
};
const prepareOrderForm = (response) => {
    const handleOrderLine = R.map(R.evolve({
        productId: general_1.toSuggestion,
        taxesId: R.ifElse(R.pipe(R.length, R.equals(0)), R.always(null), R.pipe(R.head, 
        // @ts-ignore
        general_1.toSuggestion)),
        productUom: R.prop('id'),
        datePlanned: R.ifElse(R.isNil, R.identity, general_1.fromOdooDatetime),
    }));
    return R.pipe(R.evolve({
        partnerId: general_1.toSuggestion,
        partnerShippingId: general_1.toSuggestion,
        partnerInvoiceId: general_1.toSuggestion,
        paymentTermId: R.ifElse(R.pipe(R.prop('id'), R.isNil), R.always(null), general_1.toSuggestion),
        pickingTypeId: R.pipe(R.evolve({
            warehouseId: R.prop('displayName')
        }), general_1.renameKeys({
            warehouseId: 'displayName',
        }), general_1.toSuggestion),
        notes: R.ifElse(R.isNil, R.always(''), R.identity),
        partnerRef: R.ifElse(R.isNil, R.always(''), R.identity),
        orderLine: handleOrderLine,
        dateOrder: R.ifElse(R.isNil, R.identity, 
        // R.partial(fromOdooDatetime, ['YYYY-MM-dd HH:mm:ss']),
        general_1.fromOdooDatetime),
        datePlanned: R.ifElse(R.isNil, R.identity, 
        // R.partial(fromOdooDatetime, ['YYYY-MM-dd HH:mm:ss']),
        general_1.fromOdooDatetime),
        invoiceIds: R.map(R.evolve({
            dateDue: R.partial(general_1.fromOdooDatetime, ['dd MMMM YYYY']),
            state: state => InvoiceState[state]
        })),
        pickingIds: R.map(R.evolve({
            locationId: R.prop('displayName'),
            scheduledDate: R.partial(general_1.fromOdooDatetime, ['dd MMMM YYYY']),
            state: state => PickingState[state]
        })),
    }))(response);
};
const downloadReport = (response, name) => {
    let link = document.createElement('a');
    link.href = `data:application/pdf;base64,${response}`;
    link.download = `${name}.pdf`;
    link.click();
};
const prepareOrderTable = (response) => {
    return R.map(R.evolve({
        partnerId: R.prop('displayName'),
        userId: R.prop('displayName'),
        dateOrder: R.partial(general_1.fromOdooDatetime, ['YYYY-MM-dd HH:mm:ss']),
        requestedDate: R.ifElse(R.isNil, R.identity, R.partial(general_1.fromOdooDatetime, ['YYYY-MM-dd HH:mm:ss'])),
        commitmentDate: R.ifElse(R.isNil, R.identity, R.partial(general_1.fromOdooDatetime, ['YYYY-MM-dd HH:mm:ss'])),
        state: state => R.prop(state, OrderState)
    }))(response);
};
const preparePickingTypes = (pickingTypes) => {
    // const isValid = (pickingType) => {
    //   return R.propEq('code', 'incoming', pickingType) && !R.propEq('warehouseId', null, pickingType)
    // }
    return R.pipe(
    // R.filter(
    //   isValid
    // ),
    R.map(R.pipe(R.evolve({
        warehouseId: R.prop('displayName')
    }), general_1.renameKeys({
        warehouseId: 'displayName',
    }), general_1.toSuggestion)))(pickingTypes);
};
