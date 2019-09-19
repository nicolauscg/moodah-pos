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
const date_fns_1 = require("date-fns");
// @ts-ignore
const api_1 = __importDefault(require("../../utils/api"));
const general_1 = require("./general");
const partner_1 = require("./partner");
const formatFilters_1 = __importDefault(require("../../utils/formatFilters"));
exports.initialState = {
    customersState: {
        kind: 'Fetching',
    },
    paymentTermsState: {
        kind: 'Fetching',
    },
    pricelistsState: {
        kind: 'Fetching',
    },
    warehousesState: {
        kind: 'Fetching',
    },
    variantsState: {
        kind: 'Fetching',
    },
    taxesState: {
        kind: 'Fetching',
    },
    usersState: {
        kind: 'Fetching',
    },
    customerState: {
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
exports.saleReducer = (state = exports.initialState, action) => {
    switch (action.type) {
        case "@@sale/FETCH_DEFAULTS" /* FETCH_DEFAULTS */:
            return Object.assign({}, state, { customersState: {
                    kind: 'Fetching',
                }, paymentTermsState: {
                    kind: 'Fetching',
                }, pricelistsState: {
                    kind: 'Fetching',
                }, warehousesState: {
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
        case "@@sale/FETCH_DEFAULTS_SUCCESS" /* FETCH_DEFAULTS_SUCCESS */:
            return Object.assign({}, state, { defaultsState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@sale/FETCH_CUSTOMERS_SUCCESS" /* FETCH_CUSTOMERS_SUCCESS */:
            return Object.assign({}, state, { customersState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@sale/FETCH_PAYMENT_TERMS_SUCCESS" /* FETCH_PAYMENT_TERMS_SUCCESS */:
            return Object.assign({}, state, { paymentTermsState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@sale/FETCH_PRICELISTS_SUCCESS" /* FETCH_PRICELISTS_SUCCESS */:
            return Object.assign({}, state, { pricelistsState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@sale/FETCH_WAREHOUSES_SUCCESS" /* FETCH_WAREHOUSES_SUCCESS */:
            return Object.assign({}, state, { warehousesState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@sale/FETCH_VARIANTS_SUCCESS" /* FETCH_VARIANTS_SUCCESS */:
            return Object.assign({}, state, { variantsState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@sale/FETCH_TAXES_SUCCESS" /* FETCH_TAXES_SUCCESS */:
            return Object.assign({}, state, { taxesState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@sale/FETCH_USERS_SUCCESS" /* FETCH_USERS_SUCCESS */:
            return Object.assign({}, state, { usersState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@sale/FETCH_CUSTOMER" /* FETCH_CUSTOMER */:
            return Object.assign({}, state, { customerState: {
                    kind: 'Fetching',
                } });
        case "@@sale/FETCH_CUSTOMER_SUCCESS" /* FETCH_CUSTOMER_SUCCESS */:
            return Object.assign({}, state, { customerState: {
                    kind: 'Success',
                    data: action.payload
                } });
        case "@@sale/ONCHANGE_PRODUCT" /* ONCHANGE_PRODUCT */:
            return Object.assign({}, state, { productChangeState: {
                    kind: 'Fetching',
                } });
        case "@@sale/ONCHANGE_PRODUCT_SUCCESS" /* ONCHANGE_PRODUCT_SUCCESS */:
            return Object.assign({}, state, { productChangeState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@sale/RESET_ONCHANGE_PRODUCT" /* RESET_ONCHANGE_PRODUCT */:
            return Object.assign({}, state, { productChangeState: {
                    kind: 'Init',
                } });
        case "@@sale/ONCHANGE_ORDER_LINE" /* ONCHANGE_ORDER_LINE */:
            return Object.assign({}, state, { orderLineChangeState: {
                    kind: 'Fetching',
                } });
        case "@@sale/ONCHANGE_ORDER_LINE_SUCCESS" /* ONCHANGE_ORDER_LINE_SUCCESS */:
            return Object.assign({}, state, { orderLineChangeState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@sale/RESET_ONCHANGE_ORDER_LINE" /* RESET_ONCHANGE_ORDER_LINE */:
            return Object.assign({}, state, { orderLineChangeState: {
                    kind: 'Init',
                } });
        case "@@sale/CREATE_ORDER" /* CREATE_ORDER */:
            return Object.assign({}, state, { createOrderState: {
                    kind: 'Submit',
                } });
        case "@@sale/CREATE_ORDER_SUCCESS" /* CREATE_ORDER_SUCCESS */:
            return Object.assign({}, state, { createOrderState: {
                    kind: 'Success',
                    orderId: action.payload,
                } });
        case "@@sale/RESET_CREATE_ORDER" /* RESET_CREATE_ORDER */:
            return Object.assign({}, state, { createOrderState: {
                    kind: 'Draft',
                } });
        case "@@sale/FETCH_ORDER" /* FETCH_ORDER */:
            return Object.assign({}, state, { orderState: {
                    kind: 'Fetching',
                } });
        case "@@sale/FETCH_ORDER_SUCCESS" /* FETCH_ORDER_SUCCESS */:
            return Object.assign({}, state, { orderState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@sale/FETCH_MESSAGES" /* FETCH_MESSAGES */:
            return Object.assign({}, state, { messagesState: {
                    kind: 'Fetching',
                } });
        case "@@sale/FETCH_MESSAGES_SUCCESS" /* FETCH_MESSAGES_SUCCESS */:
            return Object.assign({}, state, { messagesState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@sale/COPY_ORDER" /* COPY_ORDER */:
            return Object.assign({}, state, { copyOrderState: {
                    kind: 'Fetching',
                } });
        case "@@sale/COPY_ORDER_SUCCESS" /* COPY_ORDER_SUCCESS */:
            return Object.assign({}, state, { copyOrderState: {
                    kind: 'Success',
                    orderId: action.payload,
                } });
        case "@@sale/RESET_COPY_ORDER" /* RESET_COPY_ORDER */:
            return Object.assign({}, state, { copyOrderState: {
                    kind: 'Init'
                } });
        case "@@sale/SUBMIT_APPROVAL" /* SUBMIT_APPROVAL */:
            return Object.assign({}, state, { orderApprovalState: {
                    kind: 'Submit'
                } });
        case "@@sale/RESET_APPROVAL" /* RESET_APPROVAL */:
            return Object.assign({}, state, { orderApprovalState: {
                    kind: 'Init'
                } });
        case "@@sale/FETCH_ORDERS" /* FETCH_ORDERS */:
            return Object.assign({}, state, { ordersState: {
                    kind: 'Fetching',
                } });
        case "@@sale/FETCH_ORDERS_SUCCESS" /* FETCH_ORDERS_SUCCESS */:
            return Object.assign({}, state, { ordersState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@sale/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */:
            return Object.assign({}, state, { ordersParams: action.payload });
        default:
            return state;
    }
};
// Actions
exports.getDefaults = (dispatch) => {
    const payload = [
        'name',
        'note',
        'warehouse_id',
        'picking_policy',
        'user_id',
        'team_id',
        'company_id',
        'date_order',
        'state',
    ];
    return typesafe_actions_1.action("@@sale/FETCH_DEFAULTS" /* FETCH_DEFAULTS */, payload, dispatch);
};
exports.getDefaultsSuccess = (response) => {
    return typesafe_actions_1.action("@@sale/FETCH_DEFAULTS_SUCCESS" /* FETCH_DEFAULTS_SUCCESS */, response);
};
exports.getMasters = (dispatch) => {
    const customerFilters = formatFilters_1.default([
        { field: 'customer', operator: '=', comparator: 'True' },
        { field: 'type', operator: 'in', comparator: ['contact', 'invoice', 'delivery'] },
    ]);
    const taxFilters = formatFilters_1.default([
        { field: 'type_tax_use', operator: '=', comparator: 'sale' },
    ]);
    const variantFilters = formatFilters_1.default([
        { field: 'sale_ok', operator: '=', comparator: 'True' },
    ]);
    return typesafe_actions_1.action("@@sale/FETCH_MASTERS" /* FETCH_MASTERS */, {
        customerParams: {
            filters: customerFilters,
        },
        taxParams: {
            filters: taxFilters,
        },
        variantParams: {
            filters: variantFilters,
        },
    }, dispatch);
};
const getCustomersSuccess = (response) => {
    const { results } = response;
    const customers = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    const groupedCustomers = groupCustomers(customers);
    return typesafe_actions_1.action("@@sale/FETCH_CUSTOMERS_SUCCESS" /* FETCH_CUSTOMERS_SUCCESS */, groupedCustomers);
};
const getPaymentTermsSuccess = (response) => {
    const { results } = response;
    const paymentTerms = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    return typesafe_actions_1.action("@@sale/FETCH_PAYMENT_TERMS_SUCCESS" /* FETCH_PAYMENT_TERMS_SUCCESS */, paymentTerms);
};
const getPricelistsSucess = (response) => {
    const { results } = response;
    const pricelists = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    return typesafe_actions_1.action("@@sale/FETCH_PRICELISTS_SUCCESS" /* FETCH_PRICELISTS_SUCCESS */, pricelists);
};
const getWarehousesSuccess = (response) => {
    const { results } = response;
    const warehouses = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    return typesafe_actions_1.action("@@sale/FETCH_WAREHOUSES_SUCCESS" /* FETCH_WAREHOUSES_SUCCESS */, warehouses);
};
const getVariantsSuccess = (response) => {
    const { results } = response;
    const variants = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    return typesafe_actions_1.action("@@sale/FETCH_VARIANTS_SUCCESS" /* FETCH_VARIANTS_SUCCESS */, variants);
};
const getTaxesSuccess = (response) => {
    const { results } = response;
    const taxes = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    return typesafe_actions_1.action("@@sale/FETCH_TAXES_SUCCESS" /* FETCH_TAXES_SUCCESS */, taxes);
};
const getUsersSuccess = (response) => {
    const { results } = response;
    const users = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    return typesafe_actions_1.action("@@sale/FETCH_USERS_SUCCESS" /* FETCH_USERS_SUCCESS */, users);
};
exports.getCustomer = (id, dispatch) => {
    return typesafe_actions_1.action("@@sale/FETCH_CUSTOMER" /* FETCH_CUSTOMER */, id, dispatch);
};
const getCustomerSuccess = (response) => {
    return typesafe_actions_1.action("@@sale/FETCH_CUSTOMER_SUCCESS" /* FETCH_CUSTOMER_SUCCESS */, partner_1.preparePartnerForm(response));
};
exports.handleProductChange = (values, lineVals, field) => {
    const payload = prepareProductChange(values, lineVals);
    return typesafe_actions_1.action("@@sale/ONCHANGE_PRODUCT" /* ONCHANGE_PRODUCT */, payload, {
        id: lineVals.id,
        field,
    });
};
const handleProductChangeSuccess = (response, id) => {
    const payload = transformProductChange(response);
    return typesafe_actions_1.action("@@sale/ONCHANGE_PRODUCT_SUCCESS" /* ONCHANGE_PRODUCT_SUCCESS */, R.assoc('id', id, payload));
};
exports.resetProductChange = () => typesafe_actions_1.action("@@sale/RESET_ONCHANGE_PRODUCT" /* RESET_ONCHANGE_PRODUCT */);
exports.handleOrderLineChange = (values, lineVals) => {
    return typesafe_actions_1.action("@@sale/ONCHANGE_ORDER_LINE" /* ONCHANGE_ORDER_LINE */, transformOrder(values, lineVals));
};
const handleOrderLineChangeSuccess = (response) => {
    return typesafe_actions_1.action("@@sale/ONCHANGE_ORDER_LINE_SUCCESS" /* ONCHANGE_ORDER_LINE_SUCCESS */, R.pipe(R.dissoc('orderLine'), R.evolve({
        amountUntaxed: (value) => Number(value.toFixed(2))
    }))(response));
};
exports.createOrder = (values, dispatch) => {
    return typesafe_actions_1.action("@@sale/CREATE_ORDER" /* CREATE_ORDER */, transformOrderForm(values), dispatch);
};
const createOrderSuccess = (id) => {
    return typesafe_actions_1.action("@@sale/CREATE_ORDER_SUCCESS" /* CREATE_ORDER_SUCCESS */, id);
};
exports.resetCreateOrder = () => typesafe_actions_1.action("@@sale/RESET_CREATE_ORDER" /* RESET_CREATE_ORDER */);
exports.getOrder = (id, dispatch) => {
    return typesafe_actions_1.action("@@sale/FETCH_ORDER" /* FETCH_ORDER */, id, dispatch);
};
const getOrderSuccess = (response) => {
    return typesafe_actions_1.action("@@sale/FETCH_ORDER_SUCCESS" /* FETCH_ORDER_SUCCESS */, prepareOrderForm(response));
};
const getMessages = (messageIds, dispatch) => {
    const ids = R.map(R.prop('id'))(messageIds);
    const payload = {
        domain: [['id', 'in', ids]],
        limit: 100,
    };
    return typesafe_actions_1.action("@@sale/FETCH_MESSAGES" /* FETCH_MESSAGES */, payload, dispatch);
};
const getMessagesSuccess = (response) => {
    const messages = R.map(R.evolve({
        date: R.partial(general_1.fromOdooDatetime, ['dd MMM YYYY HH:mm:ss'])
    }))(response);
    return typesafe_actions_1.action("@@sale/FETCH_MESSAGES_SUCCESS" /* FETCH_MESSAGES_SUCCESS */, messages);
};
exports.updateOrder = (values, deletedLines, dispatch) => {
    return typesafe_actions_1.action("@@sale/UPDATE_ORDER" /* UPDATE_ORDER */, R.dissoc('id')(transformOrderForm(values, deletedLines)), {
        dispatch,
        id: values.id,
    });
};
exports.doAction = (id, action, name, dispatch) => {
    let method = '';
    switch (action) {
        case 'print':
            return typesafe_actions_1.action("@@sale/PRINT_QUOTATION" /* PRINT_QUOTATION */, {
                'report_name': 'sale.report_saleorder',
                'ids': [30]
            }, { id, name, dispatch });
        case 'copy':
            method = 'copy';
            break;
        default:
            method = 'force_quotation_send';
            break;
    }
    return typesafe_actions_1.action("@@sale/EXECUTE_ACTION" /* EXECUTE_ACTION */, method, { id, name, dispatch });
};
exports.resetCopyOrder = () => typesafe_actions_1.action("@@sale/RESET_COPY_ORDER" /* RESET_COPY_ORDER */);
exports.submitApproval = (id, option, dispatch) => {
    const method = option === 'accept'
        ? 'action_confirm'
        : 'action_cancel';
    return typesafe_actions_1.action("@@sale/SUBMIT_APPROVAL" /* SUBMIT_APPROVAL */, method, { id, dispatch });
};
exports.getOrders = (params, dispatch) => {
    const formattedFilters = formatFilters_1.default(params.filters);
    return typesafe_actions_1.action("@@sale/FETCH_ORDERS" /* FETCH_ORDERS */, Object.assign({}, params, { filters: formattedFilters }), dispatch);
};
const getOrdersSuccess = (response) => {
    const { results, total } = response;
    const orders = Array.isArray(results) ? prepareOrderTable(results) : [];
    return typesafe_actions_1.action("@@sale/FETCH_ORDERS_SUCCESS" /* FETCH_ORDERS_SUCCESS */, { orders, total });
};
exports.setParams = (newParams, dispatch) => {
    const { filters } = newParams;
    // const appendedFilters = [
    //   ...filters,
    //   { field: 'type', operator: '=', comparator: 'contact' },
    // ]
    return typesafe_actions_1.action("@@sale/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */, 
    // { ...newParams, filters: appendedFilters },
    newParams, dispatch);
};
// Sagas
function* fetchDefaults(action) {
    try {
        const response = yield effects_1.call(fetchDefaultGet, 'sale.order', action.payload);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(exports.getMasters(action.meta));
        const { customers, pricelists, paymentTerms, warehouses, users } = yield effects_1.all({
            customers: effects_1.take("@@sale/FETCH_CUSTOMERS_SUCCESS" /* FETCH_CUSTOMERS_SUCCESS */),
            pricelists: effects_1.take("@@sale/FETCH_PRICELISTS_SUCCESS" /* FETCH_PRICELISTS_SUCCESS */),
            paymentTerms: effects_1.take("@@sale/FETCH_PAYMENT_TERMS_SUCCESS" /* FETCH_PAYMENT_TERMS_SUCCESS */),
            warehouses: effects_1.take("@@sale/FETCH_WAREHOUSES_SUCCESS" /* FETCH_WAREHOUSES_SUCCESS */),
            users: effects_1.take("@@sale/FETCH_USERS_SUCCESS" /* FETCH_USERS_SUCCESS */),
        });
        if (customers && pricelists && paymentTerms && warehouses && users) {
            yield effects_1.put(exports.getDefaultsSuccess(camelizedResp));
        }
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchCustomers(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const { customerParams } = action.payload;
        const response = yield effects_1.call(api_1.default.get, '/res.partner', customerParams, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(getCustomersSuccess(camelizedResp));
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
function* fetchPricelists(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/product.pricelist', undefined, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(getPricelistsSucess(camelizedResp));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchWarehouses(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/stock.warehouse', undefined, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(getWarehousesSuccess(camelizedResp));
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
function* fetchUsers(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/res.users', undefined, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(getUsersSuccess(camelizedResp));
    }
    catch (error) {
        console.log(error);
    }
}
function* masterWatcher() {
    yield effects_1.all([
        effects_1.takeLatest("@@sale/FETCH_DEFAULTS" /* FETCH_DEFAULTS */, fetchDefaults),
        effects_1.takeLatest("@@sale/FETCH_MASTERS" /* FETCH_MASTERS */, fetchCustomers),
        effects_1.takeLatest("@@sale/FETCH_MASTERS" /* FETCH_MASTERS */, fetchPaymentTerms),
        effects_1.takeLatest("@@sale/FETCH_MASTERS" /* FETCH_MASTERS */, fetchPricelists),
        effects_1.takeLatest("@@sale/FETCH_MASTERS" /* FETCH_MASTERS */, fetchWarehouses),
        effects_1.takeLatest("@@sale/FETCH_MASTERS" /* FETCH_MASTERS */, fetchVariants),
        effects_1.takeLatest("@@sale/FETCH_MASTERS" /* FETCH_MASTERS */, fetchTaxes),
        effects_1.takeLatest("@@sale/FETCH_MASTERS" /* FETCH_MASTERS */, fetchUsers),
    ]);
}
function* fetchCustomer(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, `/res.partner/${action.payload}`, undefined, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        yield effects_1.put(getCustomerSuccess(camelizedResp));
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
        const response = yield effects_1.call(api_1.default.post, '/sale.order', JSON.stringify(action.payload), { 'Access-Token': token }, action.meta);
        yield effects_1.put(general_1.addNotif({
            message: 'Penawaran berhasil dibuat',
            type: 'success'
        }));
        yield effects_1.put(createOrderSuccess(response.id));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchOrder(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        yield effects_1.put(exports.getDefaults(action.meta));
        const response = yield effects_1.call(api_1.default.get, `/sale.order/${action.payload}`, undefined, { 'Access-Token': token }, action.meta);
        const camelizedResp = yield effects_1.call(humps_1.camelizeKeys, response);
        const defaultsDone = yield effects_1.take("@@sale/FETCH_DEFAULTS_SUCCESS" /* FETCH_DEFAULTS_SUCCESS */);
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
        const response = yield effects_1.call(api_1.default.put, `/sale.order/${action.meta.id}`, JSON.stringify(action.payload), { 'Access-Token': token }, action.meta.dispatch);
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
            yield effects_1.put(typesafe_actions_1.action("@@sale/COPY_ORDER" /* COPY_ORDER */));
        }
        const response = yield effects_1.call(api_1.default.put, `/sale.order/${action.meta.id}/${action.payload}`, undefined, { 'Access-Token': token }, action.meta.dispatch);
        if (action.payload === 'force_quotation_send') {
            yield effects_1.put(general_1.addNotif({
                message: `${action.meta.name} berhasil dikirim`,
                type: 'success'
            }));
        }
        if (action.payload === 'copy') {
            yield effects_1.put(typesafe_actions_1.action("@@sale/COPY_ORDER_SUCCESS" /* COPY_ORDER_SUCCESS */, response[1][0]));
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
        const response = yield effects_1.call(api_1.default.put, `/sale.order/${id}/${action.payload}`, undefined, { 'Access-Token': token }, dispatch);
        yield effects_1.put(typesafe_actions_1.action("@@sale/RESET_APPROVAL" /* RESET_APPROVAL */));
        yield effects_1.put(exports.getOrder(id, dispatch));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchOrders(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/sale.order/', action.payload, { 'Access-Token': token }, action.meta);
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
        effects_1.takeLatest("@@sale/FETCH_CUSTOMER" /* FETCH_CUSTOMER */, fetchCustomer),
        effects_1.takeLatest("@@sale/ONCHANGE_PRODUCT" /* ONCHANGE_PRODUCT */, fetchChangeProduct),
        effects_1.takeLatest("@@sale/ONCHANGE_ORDER_LINE" /* ONCHANGE_ORDER_LINE */, fetchChangeOrderLine),
        effects_1.takeLatest("@@sale/CREATE_ORDER" /* CREATE_ORDER */, postOrder),
        effects_1.takeLatest("@@sale/FETCH_ORDER" /* FETCH_ORDER */, fetchOrder),
        effects_1.takeLatest("@@sale/FETCH_MESSAGES" /* FETCH_MESSAGES */, fetchMessages),
        effects_1.takeLatest("@@sale/UPDATE_ORDER" /* UPDATE_ORDER */, updateOrderServer),
        effects_1.takeEvery("@@sale/EXECUTE_ACTION" /* EXECUTE_ACTION */, executeAction),
        effects_1.takeLatest("@@sale/PRINT_QUOTATION" /* PRINT_QUOTATION */, fetchReport),
        effects_1.takeLatest("@@sale/SUBMIT_APPROVAL" /* SUBMIT_APPROVAL */, postApproval),
        effects_1.takeLatest("@@sale/FETCH_ORDERS" /* FETCH_ORDERS */, fetchOrders),
        effects_1.takeLatest("@@sale/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */, updateParams),
    ]);
}
function* saleSaga() {
    yield effects_1.all([
        effects_1.fork(masterWatcher),
        effects_1.fork(orderWatcher),
    ]);
}
exports.saleSaga = saleSaga;
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
            nodoo_1.executeAuthenticatedClient(authenticatedClient, nodoo_1.createOnChange('sale.order.line', vals, [
                field,
            ], {
                analytic_tag_ids: '',
                currency_id: '',
                customer_lead: '1',
                discount: '1',
                invoice_status: '1',
                layout_category_id: '',
                name: '',
                price_subtotal: '',
                price_total: '1',
                price_unit: '1',
                product_id: '1',
                product_uom: '1',
                product_uom_qty: '1',
                product_updatable: '',
                purchase_price: '',
                qty_delivered: '1',
                qty_delivered_updateable: '',
                qty_invoiced: '1',
                qty_to_invoice: '1',
                route_id: '1',
                sequence: '',
                state: '1',
                tax_id: '1',
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
            nodoo_1.executeAuthenticatedClient(authenticatedClient, nodoo_1.createOnChange('sale.order', vals, [
                'order_line',
            ], {
                activity_ids: '',
                amount_tax: '',
                amount_total: '',
                amount_untaxed: '',
                analytic_account_id: '',
                carrier_id: '1',
                client_order_ref: '',
                commitment_date: '',
                company_id: '',
                confirmation_date: '',
                currency_id: '1',
                date_order: '1',
                delivery_count: '',
                delivery_message: '',
                delivery_price: '',
                delivery_rating_success: '',
                effective_date: '',
                fiscal_position_id: '1',
                id: '',
                incoterm: '',
                invoice_count: '',
                invoice_status: '',
                margin: '',
                message_follower_ids: '',
                message_ids: '',
                name: '',
                note: '',
                order_line: '1',
                'order_line.analytic_tag_ids': '',
                'order_line.currency_id': '',
                'order_line.customer_lead': '1',
                'order_line.discount': '1',
                'order_line.invoice_lines': '1',
                'order_line.invoice_status': '1',
                'order_line.layout_category_id': '',
                'order_line.name': '',
                'order_line.price_subtotal': '',
                'order_line.price_total': '1',
                'order_line.price_unit': '1',
                'order_line.product_id': '1',
                'order_line.product_packaging': '1',
                'order_line.product_qty': '',
                'order_line.product_uom': '1',
                'order_line.product_uom_qty': '1',
                'order_line.product_updatable': '',
                'order_line.purchase_price': '',
                'order_line.qty_delivered': '1',
                'order_line.qty_delivered_updateable': '',
                'order_line.qty_invoiced': '1',
                'order_line.qty_to_invoice': '1',
                'order_line.route_id': '1',
                'order_line.sequence': '',
                'order_line.state': '1',
                'order_line.tax_id': '1',
                origin: '',
                partner_id: '1',
                partner_invoice_id: '',
                partner_shipping_id: '1',
                payment_term_id: '',
                picking_ids: '1',
                picking_policy: '',
                pricelist_id: '1',
                requested_date: '1',
                state: '1',
                team_id: '1',
                user_id: '',
                validity_date: '',
                warehouse_id: '1',
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
    { name: 'productUomQty', title: 'Qty' },
    { name: 'priceUnit', title: 'Price' },
    { name: 'taxId', title: 'Taxes' },
    { name: 'discount', title: 'Discount (%)' },
    { name: 'priceSubtotal', title: 'Subtotal' },
];
exports.OrderColumns = [
    { name: 'name', title: 'Nomor' },
    { name: 'dateOrder', title: 'Tanggal Buat' },
    { name: 'requestedDate', title: 'Tanggal Pengiriman' },
    { name: 'commitmentDate', title: 'Estimasi Sampai' },
    { name: 'partnerId', title: 'Customer' },
    { name: 'userId', title: 'Salesperson' },
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
    const formatDatetime = datetime => {
        if (datetime) {
            return date_fns_1.format(datetime, 'YYYY-MM-dd HH:mm:ss', { awareOfUnicodeTokens: true });
        }
        return datetime;
    };
    const formatDate = date => {
        if (date) {
            date_fns_1.format(date, 'YYYY-MM-dd', { awareOfUnicodeTokens: true });
        }
        return date;
    };
    const orderId = R.pipe(R.dissoc('partnerInvoiceId'), R.dissoc('partnerShippingId'), R.dissoc('orderLine'), R.evolve({
        partnerId: getValue,
        warehouseId: getValue,
        pricelistId: getValue,
        paymentTermId: getValue,
        userId: getValue,
        requestedDate: formatDatetime,
        validityDate: formatDate,
    }))(vals);
    const taxId = lineVals.taxId
        ? [[6, false, [lineVals.taxId.value]]]
        : lineVals.taxId;
    const orderLine = R.pipe(R.evolve({
        productId: getValue,
    }), R.assoc('orderId', orderId), R.assoc('taxId', taxId), 
    // @ts-ignore
    humps_1.decamelizeKeys)(lineVals);
    return orderLine;
};
const transformProductChange = (response) => {
    return R.pipe(R.dissoc('currencyId'), R.evolve({
        taxId: R.pipe(R.pipe(R.slice(1, 2), R.head), 
        // @ts-ignore
        R.nth(1)),
        productUom: R.head,
        priceSubtotal: (value) => Number(value.toFixed(2))
    }))(response);
};
const transformOrder = (order, orderLine) => {
    const handleTaxId = (taxId) => {
        return taxId
            ? ([[6, false, [taxId.value]]])
            : taxId;
    };
    const toRelationTuple = (line) => {
        return [0, false, line];
    };
    // @ts-ignore
    const transOrderLine = R.pipe(R.map(R.pipe(R.dissoc('id'), R.evolve({
        productId: getValue,
        productUom: R.ifElse(R.equals(null), R.always(false), R.identity),
        taxId: handleTaxId,
    }), 
    // @ts-ignore
    humps_1.decamelizeKeys)), R.map(toRelationTuple))(orderLine);
    const formatDatetime = datetime => {
        if (datetime) {
            return date_fns_1.format(datetime, 'YYYY-MM-dd HH:mm:ss', { awareOfUnicodeTokens: true });
        }
        return datetime;
    };
    const formatDate = date => {
        if (date) {
            date_fns_1.format(date, 'YYYY-MM-dd', { awareOfUnicodeTokens: true });
        }
        return date;
    };
    return R.pipe(R.evolve({
        partnerId: getValue,
        partnerInvoiceId: getValue,
        partnerShippingId: getValue,
        warehouseId: getValue,
        pricelistId: getValue,
        paymentTermId: getValue,
        userId: getValue,
        requestedDate: formatDatetime,
        validityDate: formatDate,
    }), R.assoc('orderLine', transOrderLine), 
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
        taxId: R.ifElse(R.isNil, R.always([[6, 0, []]]), R.pipe(R.prop('value'), R.of, R.of, 
        // @ts-ignore
        R.concat([6, 0]), R.of)),
    }), humps_1.decamelizeKeys)), addDeletedLines);
    return R.pipe(R.evolve({
        partnerId: getValue,
        partnerInvoiceId: getValue,
        partnerShippingId: getValue,
        warehouseId: getValue,
        pricelistId: getValue,
        paymentTermId: getValue,
        userId: getValue,
        orderLine: handleOrderLine,
    }), R.ifElse(R.has('id'), R.dissoc('id'), R.identity), humps_1.decamelizeKeys)(orderVals);
};
const prepareOrderForm = (response) => {
    const handleOrderLine = R.map(R.evolve({
        productId: general_1.toSuggestion,
        taxId: R.ifElse(R.pipe(R.length, R.equals(0)), R.always(null), R.pipe(R.head, 
        // @ts-ignore
        general_1.toSuggestion)),
        productUom: R.prop('id'),
    }));
    return R.pipe(R.evolve({
        partnerId: general_1.toSuggestion,
        partnerShippingId: general_1.toSuggestion,
        partnerInvoiceId: general_1.toSuggestion,
        paymentTermId: R.ifElse(R.pipe(R.prop('id'), R.isNil), R.always(null), general_1.toSuggestion),
        warehouseId: general_1.toSuggestion,
        pricelistId: general_1.toSuggestion,
        userId: general_1.toSuggestion,
        note: R.ifElse(R.isNil, R.always(''), R.identity),
        orderLine: handleOrderLine,
        requestedDate: R.ifElse(R.isNil, R.identity, R.partial(general_1.fromOdooDatetime, ['YYYY-MM-dd HH:mm:ss'])),
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
