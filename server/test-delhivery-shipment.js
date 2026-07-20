import axios from 'axios';

const API_KEY = process.env.DELHIVERY_API_KEY;

const BASE_URL =
  process.env.DELHIVERY_BASE_URL ||
  'https://track.delhivery.com';

const CLIENT_NAME =
  process.env.DELHIVERY_CLIENT_NAME;

const PICKUP_NAME =
  process.env.DELHIVERY_PICKUP_NAME;


// ========================================
// Validate Delhivery configuration
// ========================================

function validateDelhiveryConfig() {
  const requiredVariables = [
    'DELHIVERY_API_KEY',
    'DELHIVERY_CLIENT_NAME',
    'DELHIVERY_PICKUP_NAME'
  ];

  const missingVariables =
    requiredVariables.filter(
      (variable) => !process.env[variable]
    );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing Delhivery environment variables: ${
        missingVariables.join(', ')
      }`
    );
  }
}


// ========================================
// Create Delhivery Shipment
// ========================================

export async function createDelhiveryShipment({
  orderId,
  customer,
  products,
  paymentMethod,
  totalAmount,
  weight,
  length,
  width,
  height
}) {

  validateDelhiveryConfig();

  // Validate customer data
  if (!customer?.name) {
    throw new Error('Customer name is required');
  }

  if (!customer?.address) {
    throw new Error('Customer address is required');
  }

  if (!customer?.pin) {
    throw new Error('Customer PIN code is required');
  }

  if (!customer?.city) {
    throw new Error('Customer city is required');
  }

  if (!customer?.state) {
    throw new Error('Customer state is required');
  }

  if (!customer?.phone) {
    throw new Error('Customer phone number is required');
  }

  // Validate order ID
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  // Validate payment method
  const payment_mode =
    paymentMethod === 'COD'
      ? 'COD'
      : 'Pre-paid';

  // COD amount only for COD orders
  const cod_amount =
    payment_mode === 'COD'
      ? Number(totalAmount)
      : 0;

  // Convert products into description
  const products_desc = products
    ?.map((product) => {
      return `${product.name} x${product.quantity}`;
    })
    .join(', ');


  const shipment = {

    // =========================
    // CUSTOMER / CONSIGNEE
    // =========================

    name: customer.name,

    add: customer.address,

    pin: String(customer.pin),

    city: customer.city,

    state: customer.state,

    country: customer.country || 'India',

    phone: String(customer.phone),


    // =========================
    // ORDER
    // =========================

    order: String(orderId),

    payment_mode,

    shipping_mode: 'Surface',

    cod_amount,

    products_desc,


    // =========================
    // PICKUP LOCATION
    // =========================

    pickup_location: PICKUP_NAME,


    // =========================
    // PACKAGE DETAILS
    // =========================

    weight: Number(weight || 500),

    shipment_length: Number(length || 20),

    shipment_width: Number(width || 15),

    shipment_height: Number(height || 10),


    // =========================
    // SELLER DETAILS
    // =========================

    seller_name:
      process.env.DELHIVERY_PICKUP_NAME,

    seller_address:
      process.env.DELHIVERY_PICKUP_ADDRESS,

    seller_city:
      process.env.DELHIVERY_PICKUP_CITY,

    seller_state:
      process.env.DELHIVERY_PICKUP_STATE,

    seller_pin:
      process.env.DELHIVERY_PICKUP_PIN,

    seller_country:
      process.env.DELHIVERY_PICKUP_COUNTRY || 'India',

    seller_phone:
      process.env.DELHIVERY_PICKUP_PHONE,

    seller_gstin:
      process.env.DELHIVERY_GST_NUMBER,


    // =========================
    // CONSIGNEE DETAILS
    // =========================

    name_consignee:
      customer.name,

    address_consignee:
      customer.address,

    city_consignee:
      customer.city,

    state_consignee:
      customer.state,

    pin_consignee:
      String(customer.pin),

    phone_consignee:
      String(customer.phone),

    country_consignee:
      customer.country || 'India'
  };


  const payload = {

    shipments: [
      shipment
    ],

    // Exact registered client name
    client: CLIENT_NAME
  };


  const postData =
    `format=json&data=${encodeURIComponent(
      JSON.stringify(payload)
    )}`;


  try {

    const response = await axios.post(

      `${BASE_URL}/api/cmu/create.json`,

      postData,

      {

        headers: {

          Authorization:
            `Token ${API_KEY}`,

          'Content-Type':
            'application/x-www-form-urlencoded',

          Accept:
            'application/json'
        },

        timeout: 30000
      }
    );


    return {

      success: true,

      data: response.data,

      orderId,

      awb:
        response.data?.packages?.[0]?.waybill ||
        response.data?.waybill ||
        null
    };


  } catch (error) {

    console.error(
      'Delhivery API Error:',
      error.response?.data ||
      error.message
    );


    throw new Error(
      error.response?.data?.rmk ||
      error.response?.data?.error ||
      'Delhivery shipment creation failed'
    );
  }
}