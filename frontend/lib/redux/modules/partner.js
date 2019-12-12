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
const react_router_dom_1 = require("react-router-dom");
// @ts-ignore
const api_1 = __importDefault(require("../../utils/api"));
const formatFilters_1 = __importDefault(require("../../utils/formatFilters"));
const general_1 = require("./general");
exports.initialState = {
    partnersState: {
        kind: 'Fetching',
    },
    partnerParams: {
        filters: [
            { logicOperator: '|' },
            { field: 'customer', operator: '=', comparator: 'True' },
            { field: 'supplier', operator: '=', comparator: 'True' },
            { field: 'type', operator: '=', comparator: 'contact' },
        ],
        limit: 10,
        offset: 0,
    },
    partnerState: {
        kind: 'Fetching',
    },
    countriesState: {
        kind: 'Fetching',
    },
    shippingStatesState: {
        kind: 'Fetching'
    },
    billingStatesState: {
        kind: 'Fetching'
    },
    createPartnerState: {
        kind: 'Draft'
    },
    paymentTermsState: {
        kind: 'Fetching'
    },
};
// Reducer
exports.partnerReducer = (state = exports.initialState, action) => {
    switch (action.type) {
        case "@@partner/FETCH_PARTNER" /* FETCH_PARTNER */:
            return Object.assign({}, state, { partnersState: {
                    kind: 'Fetching',
                } });
        case "@@partner/FETCH_PARTNER_SUCCESS" /* FETCH_PARTNER_SUCCESS */:
            return Object.assign({}, state, { partnersState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@partner/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */:
            return Object.assign({}, state, { partnerParams: action.payload });
        case "@@partner/FETCH_SINGLE_PARTNER" /* FETCH_SINGLE_PARTNER */:
            return Object.assign({}, state, { partnerState: {
                    kind: 'Fetching',
                } });
        case "@@partner/FETCH_SINGLE_PARTNER_SUCCESS" /* FETCH_SINGLE_PARTNER_SUCCESS */:
            return Object.assign({}, state, { partnerState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@partner/FETCH_COUNTRIES" /* FETCH_COUNTRIES */:
            return Object.assign({}, state, { countriesState: {
                    kind: 'Fetching',
                } });
        case "@@partner/FETCH_COUNTRIES_SUCCESS" /* FETCH_COUNTRIES_SUCCESS */:
            return Object.assign({}, state, { countriesState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@partner/FETCH_SHIPPING_STATES" /* FETCH_SHIPPING_STATES */:
            return Object.assign({}, state, { shippingStatesState: {
                    kind: 'Fetching',
                } });
        case "@@partner/FETCH_SHIPPING_STATES_SUCCESS" /* FETCH_SHIPPING_STATES_SUCCESS */:
            return Object.assign({}, state, { shippingStatesState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@partner/RESET_SHIPPING_STATES" /* RESET_SHIPPING_STATES */:
            return Object.assign({}, state, { shippingStatesState: {
                    kind: 'Fetching',
                } });
        case "@@partner/FETCH_BILLING_STATES" /* FETCH_BILLING_STATES */:
            return Object.assign({}, state, { billingStatesState: {
                    kind: 'Fetching',
                } });
        case "@@partner/FETCH_BILLING_STATES_SUCCESS" /* FETCH_BILLING_STATES_SUCCESS */:
            return Object.assign({}, state, { billingStatesState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        case "@@partner/RESET_BILLING_STATES" /* RESET_BILLING_STATES */:
            return Object.assign({}, state, { billingStatesState: {
                    kind: 'Fetching',
                } });
        case "@@partner/CREATE_PARTNER" /* CREATE_PARTNER */:
            return Object.assign({}, state, { createPartnerState: {
                    kind: 'Submit',
                } });
        case "@@partner/CREATE_PARTNER_SUCCESS" /* CREATE_PARTNER_SUCCESS */:
            return Object.assign({}, state, { createPartnerState: {
                    kind: 'Success',
                    partnerId: action.payload,
                } });
        case "@@partner/RESET_CREATE_PARTNER" /* RESET_CREATE_PARTNER */:
            return Object.assign({}, state, { createPartnerState: {
                    kind: 'Draft',
                } });
        case "@@partner/FETCH_PAYMENT_TERMS" /* FETCH_PAYMENT_TERMS */:
            return Object.assign({}, state, { paymentTermsState: {
                    kind: 'Fetching',
                } });
        case "@@partner/FETCH_PAYMENT_TERMS_SUCCESS" /* FETCH_PAYMENT_TERMS_SUCCESS */:
            return Object.assign({}, state, { paymentTermsState: {
                    kind: 'Success',
                    data: action.payload,
                } });
        default:
            return state;
    }
};
// Actions
exports.getPartners = (params, dispatch) => {
    const formattedFilters = formatFilters_1.default(params.filters);
    return typesafe_actions_1.action("@@partner/FETCH_PARTNER" /* FETCH_PARTNER */, Object.assign({}, params, { filters: formattedFilters }), dispatch);
};
const getPartnersSuccess = (response) => {
    const { results, total } = response;
    const tableRows = Array.isArray(results) ? preparePartnerTable(results) : [];
    return typesafe_actions_1.action("@@partner/FETCH_PARTNER_SUCCESS" /* FETCH_PARTNER_SUCCESS */, { partners: tableRows, total });
};
exports.getPartner = (id, dispatch) => typesafe_actions_1.action("@@partner/FETCH_SINGLE_PARTNER" /* FETCH_SINGLE_PARTNER */, id, dispatch);
const getPartnerSuccess = (response, dispatch) => {
    const transformedResp = exports.preparePartnerForm(response);
    return typesafe_actions_1.action("@@partner/FETCH_SINGLE_PARTNER_SUCCESS" /* FETCH_SINGLE_PARTNER_SUCCESS */, transformedResp, dispatch);
};
exports.setParams = (newParams, dispatch) => {
    const { filters } = newParams;
    // const appendedFilters = [
    //   ...filters,
    //   { field: 'type', operator: '=', comparator: 'contact' },
    // ]
    return typesafe_actions_1.action("@@partner/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */, newParams, dispatch);
};
exports.getCountries = (dispatch) => typesafe_actions_1.action("@@partner/FETCH_COUNTRIES" /* FETCH_COUNTRIES */, undefined, dispatch);
const getCountriesSuccess = (response) => {
    const { results } = response;
    // @ts-ignore
    const countries = general_1.toSuggestions(results);
    return typesafe_actions_1.action("@@partner/FETCH_COUNTRIES_SUCCESS" /* FETCH_COUNTRIES_SUCCESS */, countries);
};
const getShippingStatesSuccess = (response) => {
    const { results } = response;
    const suggestions = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    return typesafe_actions_1.action("@@partner/FETCH_SHIPPING_STATES_SUCCESS" /* FETCH_SHIPPING_STATES_SUCCESS */, suggestions);
};
exports.setShippingCountry = (newParams, dispatch) => {
    const { filters } = newParams, restParams = __rest(newParams, ["filters"]);
    const formattedFilters = formatFilters_1.default(filters);
    return typesafe_actions_1.action("@@partner/FETCH_SHIPPING_STATES" /* FETCH_SHIPPING_STATES */, Object.assign({}, restParams, { filters: formatFilters_1.default(newParams.filters) }), dispatch);
};
exports.resetShippingStates = () => typesafe_actions_1.action("@@partner/RESET_SHIPPING_STATES" /* RESET_SHIPPING_STATES */);
const getBillingStatesSuccess = (response) => {
    const { results } = response;
    const suggestions = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    return typesafe_actions_1.action("@@partner/FETCH_BILLING_STATES_SUCCESS" /* FETCH_BILLING_STATES_SUCCESS */, suggestions);
};
exports.setBillingCountry = (newParams, dispatch) => {
    const { filters } = newParams, restParams = __rest(newParams, ["filters"]);
    const formattedFilters = formatFilters_1.default(filters);
    return typesafe_actions_1.action("@@partner/FETCH_BILLING_STATES" /* FETCH_BILLING_STATES */, Object.assign({}, restParams, { filters: formatFilters_1.default(newParams.filters) }), dispatch);
};
exports.resetBillingStates = () => typesafe_actions_1.action("@@partner/RESET_BILLING_STATES" /* RESET_BILLING_STATES */);
exports.updatePartner = (formValues, dispatch) => {
    const transformedValues = transformPartnerForm(formValues);
    return typesafe_actions_1.action("@@partner/UPDATE_PARTNER" /* UPDATE_PARTNER */, transformedValues, dispatch);
};
exports.submitPartner = (formValues, dispatch) => {
    const transformedValues = transformPartnerForm(formValues);
    return typesafe_actions_1.action("@@partner/CREATE_PARTNER" /* CREATE_PARTNER */, transformedValues, dispatch);
};
const submitPartnerSuccess = (id) => typesafe_actions_1.action("@@partner/CREATE_PARTNER_SUCCESS" /* CREATE_PARTNER_SUCCESS */, id);
exports.resetSubmitPartner = () => typesafe_actions_1.action("@@partner/RESET_CREATE_PARTNER" /* RESET_CREATE_PARTNER */);
exports.getPaymentTerms = (dispatch) => typesafe_actions_1.action("@@partner/FETCH_PAYMENT_TERMS" /* FETCH_PAYMENT_TERMS */, undefined, dispatch);
const getPaymentTermsSuccess = (response) => {
    const { results } = response;
    const terms = Array.isArray(results) ? general_1.toSuggestions(results) : [];
    return typesafe_actions_1.action("@@partner/FETCH_PAYMENT_TERMS_SUCCESS" /* FETCH_PAYMENT_TERMS_SUCCESS */, terms);
};
// Sagas
function* fetchPartners(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/res.partner', action.payload, { 'Access-Token': token }, 
        // @ts-ignore
        action.meta);
        yield effects_1.put(getPartnersSuccess(humps_1.camelizeKeys(response)));
    }
    catch (error) {
        console.log(error);
    }
}
function* updateParams(action) {
    yield effects_1.put(exports.getPartners(action.payload, action.meta));
}
function* fetchPartner(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, `/res.partner/${action.payload}`, undefined, { 'Access-Token': token }, action.meta);
        yield effects_1.put(getPartnerSuccess(humps_1.camelizeKeys(response), action.meta));
    }
    catch (error) {
        console.log(error);
    }
}
function* updatePartnerServer(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        // @ts-ignore
        const partnerId = action.payload.id;
        const response = yield effects_1.call(api_1.default.put, `/res.partner/${partnerId}`, JSON.stringify(R.dissoc('id', humps_1.decamelizeKeys(action.payload))), { 'Access-Token': token }, action.meta);
        yield effects_1.put(exports.getPartner(partnerId, action.meta));
        yield effects_1.put(general_1.addNotif({
            message: 'Partner details updated',
            type: 'success',
        }));
    }
    catch (error) {
        console.log(error);
    }
}
function* createPartner(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.post, '/res.partner', JSON.stringify(humps_1.decamelizeKeys(action.payload)), { 'Access-Token': token }, action.meta);
        yield effects_1.put(submitPartnerSuccess(response.id));
        yield effects_1.put(general_1.addNotif({
            message: 'Partner successfully created',
            type: 'success',
        }));
    }
    catch (error) {
        console.log(error);
    }
}
function* partnerWatcher() {
    yield [
        effects_1.takeLatest("@@partner/FETCH_PARTNER" /* FETCH_PARTNER */, fetchPartners),
        effects_1.takeLatest("@@partner/UPDATE_FETCH_PARAMS" /* UPDATE_FETCH_PARAMS */, updateParams),
        effects_1.takeLatest("@@partner/FETCH_SINGLE_PARTNER" /* FETCH_SINGLE_PARTNER */, fetchPartner),
        effects_1.takeLatest("@@partner/UPDATE_PARTNER" /* UPDATE_PARTNER */, updatePartnerServer),
        effects_1.takeLatest("@@partner/CREATE_PARTNER" /* CREATE_PARTNER */, createPartner),
    ];
}
function* fetchCountries(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const response = yield effects_1.call(api_1.default.get, '/res.country', undefined, { 'Access-Token': token }, action.meta);
        yield effects_1.put(getCountriesSuccess(humps_1.camelizeKeys(response)));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchCountriesWatcher() {
    yield effects_1.takeLatest("@@partner/FETCH_COUNTRIES" /* FETCH_COUNTRIES */, fetchCountries);
}
function* fetchShippingStates(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        let data;
        if (action.type === "@@partner/FETCH_SINGLE_PARTNER_SUCCESS" /* FETCH_SINGLE_PARTNER_SUCCESS */) {
            // @ts-ignore
            const { deliveryAddress: { shippingCountryId } } = action.payload;
            const filters = shippingCountryId.value
                ? [
                    { field: 'country_id', operator: '=', comparator: shippingCountryId.value }
                ]
                : [];
            data = {
                filters: formatFilters_1.default(filters)
            };
        }
        else {
            data = action.payload;
        }
        const response = yield effects_1.call(api_1.default.get, '/res.country.state', data, { 'Access-Token': token }, action.meta);
        yield effects_1.put(getShippingStatesSuccess(humps_1.camelizeKeys(response)));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchBillingStates(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        let data;
        if (action.type === "@@partner/FETCH_SINGLE_PARTNER_SUCCESS" /* FETCH_SINGLE_PARTNER_SUCCESS */) {
            // @ts-ignore
            const { invoiceAddress: { billingCountryId } } = action.payload;
            const filters = billingCountryId.value
                ? [
                    { field: 'country_id', operator: '=', comparator: billingCountryId.value }
                ]
                : [];
            data = {
                filters: formatFilters_1.default(filters)
            };
        }
        else {
            data = action.payload;
        }
        const response = yield effects_1.call(api_1.default.get, '/res.country.state', data, { 'Access-Token': token }, action.meta);
        yield effects_1.put(getBillingStatesSuccess(humps_1.camelizeKeys(response)));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchStatesWatcher() {
    yield [
        effects_1.takeLatest("@@partner/FETCH_SINGLE_PARTNER_SUCCESS" /* FETCH_SINGLE_PARTNER_SUCCESS */, fetchShippingStates),
        effects_1.takeLatest("@@partner/FETCH_SHIPPING_STATES" /* FETCH_SHIPPING_STATES */, fetchShippingStates),
        effects_1.takeLatest("@@partner/FETCH_SINGLE_PARTNER_SUCCESS" /* FETCH_SINGLE_PARTNER_SUCCESS */, fetchBillingStates),
        effects_1.takeLatest("@@partner/FETCH_BILLING_STATES" /* FETCH_BILLING_STATES */, fetchBillingStates),
    ];
}
function* fetchPaymentTerms(action) {
    try {
        const token = yield effects_1.call(general_1.getAccessToken);
        const filters = yield effects_1.call(formatFilters_1.default, [
            { field: 'active', operator: '=', comparator: 'True' }
        ]);
        const response = yield effects_1.call(api_1.default.get, '/account.payment.term', { filters }, { 'Access-Token': token }, action.meta);
        yield effects_1.put(getPaymentTermsSuccess(humps_1.camelizeKeys(response)));
    }
    catch (error) {
        console.log(error);
    }
}
function* fetchPaymentTermsWatcher() {
    yield effects_1.takeLatest("@@partner/FETCH_PAYMENT_TERMS" /* FETCH_PAYMENT_TERMS */, fetchPaymentTerms);
}
function* partnerSaga() {
    yield effects_1.all([
        effects_1.fork(partnerWatcher),
        effects_1.fork(fetchCountriesWatcher),
        effects_1.fork(fetchStatesWatcher),
        effects_1.fork(fetchPaymentTermsWatcher),
    ]);
}
exports.partnerSaga = partnerSaga;
// Helpers
const renderEditButton = (id) => (react_1.default.createElement(react_router_dom_1.Link, { to: `/partners/details/${id}`, className: "btn btn-secondary btn-sm" },
    react_1.default.createElement("span", { className: "lnr lnr-pencil" })));
exports.PartnerColumns = [
    { name: 'name', title: 'Name' },
    { name: 'type', title: 'Type' },
    { name: 'email', title: 'Email Address' },
    { name: 'phone', title: 'Phone Number' },
    { name: 'status', title: 'Status' },
    { name: 'action', title: 'Action' },
];
const preparePartnerTable = (partners) => {
    return partners.map(partner => ({
        name: partner.name,
        type: `${partner.supplier ? 'Supplier' : ''}
      ${(partner.supplier && partner.customer) ? ' & ' : ''}
      ${partner.customer ? 'Customer' : ''}`,
        email: partner.email,
        phone: partner.phone,
        status: partner.active ? 'Active' : 'Inactive',
        action: renderEditButton(partner.id),
    }));
};
const transformChild = (obj) => {
    return R.map(R.cond([
        [
            R.propEq('type', 'invoice'),
            general_1.renameKeys({
                countryId: 'billingCountryId',
                stateId: 'billingStateId',
                street: 'billingStreet',
                city: 'billingCity',
                zip: 'billingZip',
                phone: 'billingPhone'
            }),
        ],
        [
            R.propEq('type', 'delivery'),
            general_1.renameKeys({
                countryId: 'shippingCountryId',
                stateId: 'shippingStateId',
                street: 'shippingStreet',
                city: 'shippingCity',
                zip: 'shippingZip',
                phone: 'shippingPhone'
            }),
        ],
        [R.T, R.always]
    ]))(obj);
};
const spreadChildToParent = (obj) => {
    const { childIds } = obj, restKeys = __rest(obj, ["childIds"]);
    const defaultSuggestion = {
        label: '',
        value: ''
    };
    console.log('childIds', childIds);
    const deliveryAddress = R.ifElse(R.isEmpty, R.always({
        shippingCountryId: defaultSuggestion,
        shippingStateId: defaultSuggestion,
        shippingStreet: '',
        shippingCity: '',
        shippingZip: '',
        shippingPhone: '',
    }), R.pipe(R.find(R.propEq('type', 'delivery')), R.map(general_1.handleNullValue), 
    // @ts-ignore
    R.evolve({
        shippingCountryId: R.pipe(R.map(general_1.handleNullValue), general_1.renameKeys({
            id: 'value',
            name: 'label'
        })),
        shippingStateId: R.pipe(R.map(general_1.handleNullValue), general_1.renameKeys({
            id: 'value',
            name: 'label'
        })),
    })))(childIds);
    // const deliveryAddress = R.pipe(
    //   R.find(R.propEq('type', 'delivery')),
    //   R.map(handleNullValue),
    //   // @ts-ignore
    //   R.evolve({
    //     shippingCountryId: R.pipe(
    //       R.map(handleNullValue),
    //       renameKeys({
    //         id: 'value',
    //         name: 'label'
    //       }),
    //     ),
    //     shippingStateId: R.pipe(
    //       R.map(handleNullValue),
    //       renameKeys({
    //         id: 'value',
    //         name: 'label'
    //       }),
    //     ),
    //   }),
    // )(childIds)
    const invoiceAddress = R.ifElse(R.isEmpty, R.always({
        billingCountryId: defaultSuggestion,
        billingStateId: defaultSuggestion,
        billingStreet: '',
        billingCity: '',
        billingZip: '',
        billingPhone: '',
    }), R.pipe(R.find(R.propEq('type', 'invoice')), R.map(general_1.handleNullValue), 
    // @ts-ignore
    R.evolve({
        billingCountryId: R.pipe(R.map(general_1.handleNullValue), general_1.renameKeys({
            id: 'value',
            name: 'label'
        })),
        billingStateId: R.pipe(R.map(general_1.handleNullValue), general_1.renameKeys({
            id: 'value',
            name: 'label'
        })),
    })))(childIds);
    // const invoiceAddress = R.pipe(
    //   R.find(R.propEq('type', 'invoice')),
    //   R.map(handleNullValue),
    //   // @ts-ignore
    //   R.evolve({
    //     billingCountryId: R.pipe(
    //       R.map(handleNullValue),
    //       renameKeys({
    //         id: 'value',
    //         name: 'label'
    //       }),
    //     ),
    //     billingStateId: R.pipe(
    //       R.map(handleNullValue),
    //       renameKeys({
    //         id: 'value',
    //         name: 'label'
    //       }),
    //     ),
    //   })
    // )(childIds)
    return Object.assign({}, restKeys, { invoiceAddress,
        deliveryAddress });
};
exports.preparePartnerForm = (response) => {
    return R.pipe(R.map(general_1.handleNullValue), 
    // @ts-ignore
    R.evolve({
        childIds: transformChild,
        propertyPaymentTermId: R.pipe(R.ifElse(R.propEq('id', null), R.always(null), general_1.renameKeys({
            id: 'value',
            displayName: 'label',
        }))),
        propertySupplierPaymentTermId: R.pipe(R.ifElse(R.propEq('id', null), R.always(null), general_1.renameKeys({
            id: 'value',
            displayName: 'label',
        }))),
        propertyProductPricelist: R.pipe(R.ifElse(R.propEq('id', null), R.always(null), general_1.renameKeys({
            id: 'value',
            displayName: 'label',
        }))),
    }), spreadChildToParent)(response);
};
const transformPartnerForm = (formValues) => {
    const { invoiceAddress, deliveryAddress } = formValues;
    const invoiceChild = R.pipe(general_1.renameKeys({
        billingCountryId: 'countryId',
        billingStateId: 'stateId',
        billingCity: 'city',
        billingStreet: 'street',
        billingZip: 'zip',
        billingPhone: 'phone'
    }), R.evolve({
        countryId: R.prop('value'),
        stateId: R.prop('value')
    }), R.assoc('type', 'invoice'), R.assoc('customer', R.prop('customer', formValues)), R.assoc('supplier', R.prop('supplier', formValues)))(invoiceAddress);
    const deliveryChild = R.pipe(general_1.renameKeys({
        shippingCountryId: 'countryId',
        shippingStateId: 'stateId',
        shippingCity: 'city',
        shippingStreet: 'street',
        shippingZip: 'zip',
        shippingPhone: 'phone'
    }), R.evolve({
        countryId: R.prop('value'),
        stateId: R.prop('value')
    }), R.assoc('type', 'delivery'), R.assoc('customer', R.prop('customer', formValues)), R.assoc('supplier', R.prop('supplier', formValues)))(deliveryAddress);
    return R.pipe(R.dissoc('invoiceAddress'), R.dissoc('deliveryAddress'), R.assoc('childIds', [
        invoiceChild,
        deliveryChild
    ]), R.set(R.lensProp('propertyPaymentTermId'), R.path(['propertyPaymentTermId', 'value'], formValues)), R.set(R.lensProp('propertySupplierPaymentTermId'), R.path(['propertySupplierPaymentTermId', 'value'], formValues)), R.set(R.lensProp('userId'), R.path(['userId', 'value'], formValues)))(formValues);
};
