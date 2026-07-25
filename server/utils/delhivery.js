import axios from "axios";

class DelhiveryService {
  constructor() {
    this.apiKey = process.env.DELHIVERY_API_KEY;

    if (!this.apiKey) {
      throw new Error("DELHIVERY_API_KEY is missing.");
    }

    this.baseURL =
      process.env.DELHIVERY_BASE_URL ||
      "https://track.delhivery.com";

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        Authorization: `Token ${this.apiKey}`,
        Accept: "application/json",
      },
    });
  }

  /*
  ==========================================
  COMMON REQUEST
  ==========================================
  */

  async request(options) {
    try {
      const response = await this.client(options);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Delhivery Error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message
      );
    }
  }

  /*
  ==========================================
  CHECK SERVICEABILITY
  ==========================================
  */
  async checkServiceability({
    pickupPin,
    deliveryPin,
    weight,
    cod = false,
  }) {
    
  console.log("checkServiceability", pickupPin, deliveryPin, weight, cod);
  console.log("checkServiceability", this.baseURL);
  console.log("checkServiceability", this.apiKey);
    return this.request({
      url: "/c/api/pin-codes/json/",
      method: "GET",
      params: {
        md: "S",
        ss: cod ? "COD" : "Prepaid",
        o_pin: pickupPin,
        d_pin: deliveryPin,
        cgm: weight,
      },
    });
  }

  /*
  ==========================================
  CALCULATE SHIPPING COST
  ==========================================
  */

  async calculateShipping({
    pickupPin,
    deliveryPin,
    weight,
    mode = "S",
  }) {
    return this.request({
      url: "/api/kcs/v1/summary/get",
      method: "GET",
      params: {
        md: mode,
        o_pin: pickupPin,
        d_pin: deliveryPin,
        cgm: weight,
      },
    });
  }

  /*
  ==========================================
  FETCH WAYBILL
  ==========================================
  */

  async fetchWaybill(count = 1) {
    return this.request({
      url: "/waybill/api/bulk/json/",
      method: "GET",
      params: {
        count,
      },
    });
  }

  /*
  ==========================================
  EXTRACT WAYBILL
  ==========================================
  */

  extractWaybill(response) {
    const awb =
      response?.packages?.[0]?.waybill ||
      response?.packages?.[0]?.awb ||
      response?.waybill ||
      response?.awb ||
      response?.data?.waybill ||
      response?.data?.awb;

    if (!awb) {
      throw new Error("Waybill not returned by Delhivery.");
    }

    return String(awb);
  }

  /*
  ==========================================
  CREATE SHIPMENT
  ==========================================
  */

  async createShipment(payload) {
    const body =
      "format=json&data=" +
      encodeURIComponent(JSON.stringify(payload));

    return this.request({
      url: "/api/cmu/create.json",
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      data: body,
    });
  }

  /*
  ==========================================
  UPDATE SHIPMENT
  ==========================================
  */

  async updateShipment(payload) {
    return this.request({
      url: "/api/p/edit",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }

  /*
  ==========================================
  CANCEL SHIPMENT
  ==========================================
  */

  async cancelShipment(waybill, reason = "Cancelled by seller") {
    return this.request({
      url: "/api/p/edit",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        waybill,
        status: "Cancelled",
        cancellation_reason: reason,
      },
    });
  }

    /*
  ==========================================
  TRACK SHIPMENT
  ==========================================
  */

  async trackShipment(waybill) {
    if (!waybill) {
      throw new Error("Waybill is required.");
    }

    return this.request({
      url: "/api/v1/packages/json/",
      method: "GET",
      params: {
        waybill,
      },
    });
  }

  /*
  ==========================================
  EXTRACT TRACKING HISTORY
  ==========================================
  */

  extractTrackingHistory(response) {
    const scans =
      response?.ShipmentData?.[0]?.Shipment?.Scans ||
      response?.ShipmentData?.[0]?.Scans ||
      [];

    return scans.map((scan) => ({
      status: scan?.ScanDetail?.Scan || "",
      location: scan?.ScanDetail?.ScannedLocation || "",
      remarks: scan?.ScanDetail?.Instructions || "",
      scanDate: scan?.ScanDetail?.ScanDateTime || "",
    }));
  }

  /*
  ==========================================
  GET CURRENT STATUS
  ==========================================
  */

  getCurrentStatus(response) {
    return (
      response?.ShipmentData?.[0]?.Shipment?.Status?.Status ||
      response?.ShipmentData?.[0]?.Shipment?.Status?.StatusType ||
      "Pending"
    );
  }

  /*
  ==========================================
  GET CURRENT LOCATION
  ==========================================
  */

  getCurrentLocation(response) {
    return (
      response?.ShipmentData?.[0]?.Shipment?.Status
        ?.StatusLocation ||
      ""
    );
  }

  /*
  ==========================================
  GENERATE SHIPPING LABEL
  ==========================================
  */

  async generateShippingLabel(waybill) {
    if (!waybill) {
      throw new Error("Waybill is required.");
    }

    return this.request({
      url: "/api/p/packing_slip",
      method: "GET",
      params: {
        wbns: waybill,
        pdf: true,
      },
      responseType: "arraybuffer",
    });
  }

  /*
  ==========================================
  DOWNLOAD MANIFEST
  ==========================================
  */

  async downloadManifest(waybill) {
    return this.request({
      url: "/api/p/manifest",
      method: "GET",
      params: {
        wbns: waybill,
      },
      responseType: "arraybuffer",
    });
  }

  /*
  ==========================================
  DOWNLOAD INVOICE
  ==========================================
  */

  async downloadInvoice(waybill) {
    return this.request({
      url: "/api/p/invoice",
      method: "GET",
      params: {
        wbns: waybill,
      },
      responseType: "arraybuffer",
    });
  }


  /*
==========================================
SYNC TRACKING
==========================================
*/

async syncTracking(order) {

  try {

    const tracking =
      await this.trackShipment(
        order.delhivery.waybill
      );

    const shipment =
      tracking?.ShipmentData?.[0]?.Shipment;

    if (!shipment)
      return order;

    order.delhivery.currentStatus =
      shipment.Status.Status;

    order.delhivery.lastSynced =
      new Date();

    order.delhivery.trackingHistory =
      shipment.Scans.map(scan => ({
        status: scan.ScanDetail.Scan,
        location: scan.ScanDetail.ScannedLocation,
        remarks: scan.ScanDetail.Instructions,
        date: scan.ScanDetail.ScanDateTime,
      }));

    await order.save();

    return order;

  } catch (error) {

    console.log(error.message);

    return order;

  }

}

  /*
  ==========================================
  CREATE PICKUP REQUEST
  ==========================================
  */

  async raisePickupRequest(payload) {
    return this.request({
      url: "/fm/request/new/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }

  /*
  ==========================================
  CREATE WAREHOUSE
  ==========================================
  */

  async createWarehouse(payload) {
    return this.request({
      url: "/api/backend/clientwarehouse/create/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }

  /*
  ==========================================
  UPDATE WAREHOUSE
  ==========================================
  */

  async updateWarehouse(id, payload) {
    return this.request({
      url: `/api/backend/clientwarehouse/${id}/update/`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }

  /*
  ==========================================
  CHECK API CONNECTION
  ==========================================
  */

  async ping() {
    try {
      await this.fetchWaybill(1);
      return true;
    } catch (error) {
      return false;
    }
  }

  /*
  ==========================================
  FORMAT ORDER ITEMS
  ==========================================
  */

  formatProducts(items) {
    return items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      sku: item.sku || "",
    }));
  }

  /*
  ==========================================
  FORMAT CUSTOMER NAME
  ==========================================
  */

  getCustomerName(order) {
    return `${order.customer.firstName} ${order.customer.lastName}`;
  }


  getFullAddress(order) {
    return `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.pincode}`;
  }

    /*
  ==========================================
  BUILD DELHIVERY SHIPMENT PAYLOAD
  ==========================================
  */

  buildShipmentPayload(order) {
    const warehouse = {
      name: process.env.DELHIVERY_PICKUP_NAME,
      add: process.env.DELHIVERY_PICKUP_ADDRESS,
      city: process.env.DELHIVERY_PICKUP_CITY,
      state: process.env.DELHIVERY_PICKUP_STATE,
      pin: process.env.DELHIVERY_PICKUP_PIN,
      country: process.env.DELHIVERY_PICKUP_COUNTRY,
      phone: process.env.DELHIVERY_PICKUP_PHONE,
    };
      console.log("pickuploaction",warehouse.name)

    return {
      shipments: [
        {
          name: `${order.customer.firstName} ${order.customer.lastName}`,

          order: order.orderId,

          phone: order.customer.phone,

          email: order.customer.email,

          add: order.shippingAddress.address,

          city: order.shippingAddress.city,

          state: order.shippingAddress.state,

          pin: order.shippingAddress.pincode,

          country: order.shippingAddress.country || "India",

          payment_mode:
            order.paymentMethod === "COD"
              ? "COD"
              : "Prepaid",

          total_amount: order.total,

          cod_amount:
            order.paymentMethod === "COD"
              ? order.total
              : 0,

          shipment_width:
            order.packageDetails.width,

          shipment_height:
            order.packageDetails.height,

          shipment_length:
            order.packageDetails.length,

          weight:
            order.packageDetails.weight,

          products_desc: order.items
            .map((item) => item.name)
            .join(", "),

          quantity: order.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),

          seller_name:
            process.env.DELHIVERY_CLIENT_NAME,

          seller_gst_tin:
            process.env.DELHIVERY_GST_NUMBER,

          seller_gstin:
            process.env.DELHIVERY_GST_NUMBER,

          client_gst_tin:
            process.env.DELHIVERY_GST_NUMBER,

          seller_add: warehouse.add,
          
          seller_address: warehouse.add,
          
          seller_city: warehouse.city,
          
          seller_state: warehouse.state,
          
          seller_pin: warehouse.pin,
          
          seller_country: warehouse.country,
          
          seller_phone: warehouse.phone,

          return_name: warehouse.name,

          return_phone: warehouse.phone,

          return_add: warehouse.add,

          return_city: warehouse.city,

          return_state: warehouse.state,

          return_country: warehouse.country,

          return_pin: warehouse.pin,

          pickup_location: warehouse.name,
        },
      ],
      
    };
    
  }

  /*
  ==========================================
  VALIDATE ORDER
  ==========================================
  */

  validateOrder(order) {
    if (!order) {
      throw new Error("Order not found.");
    }

    if (!order.customer.phone) {
      throw new Error("Customer phone missing.");
    }

    if (!order.shippingAddress.pincode) {
      throw new Error("Delivery pincode missing.");
    }

    if (!order.items.length) {
      throw new Error("Order has no products.");
    }

    return true;
  }

  /*
  ==========================================
  GET SHIPMENT RESPONSE
  ==========================================
  */

  getShipmentResponse(response) {
    return (
      response?.packages?.[0] ||
      response?.Shipment ||
      response
    );
  }

  /*
  ==========================================
  GET ESTIMATED DELIVERY
  ==========================================
  */

  getEstimatedDelivery(response) {
    return (
      response?.packages?.[0]?.expected_delivery_date ||
      response?.expected_delivery ||
      null
    );
  }

  /*
  ==========================================
  GET LABEL URL
  ==========================================
  */

  getLabelURL(response) {
    return (
      response?.packages?.[0]?.label ||
      response?.label ||
      ""
    );
  }

  /*
  ==========================================
  GET INVOICE URL
  ==========================================
  */

  getInvoiceURL(response) {
    return (
      response?.packages?.[0]?.invoice ||
      response?.invoice ||
      ""
    );
  }

  /*
  ==========================================
  GET PICKUP REQUEST ID
  ==========================================
  */

  getPickupRequestId(response) {
    return (
      response?.pickup_id ||
      response?.pickupRequestId ||
      ""
    );
  }

  /*
  ==========================================
  GET SHIPMENT ID
  ==========================================
  */

  getShipmentId(response) {
    return (
      response?.shipment_id ||
      response?.shipmentId ||
      response?.packages?.[0]?.shipment_id ||
      ""
    );
  }

  /*
  ==========================================
  SUCCESS RESPONSE
  ==========================================
  */

  success(message, data = {}) {
    return {
      success: true,
      message,
      data,
    };
  }

  /*
  ==========================================
  ERROR RESPONSE
  ==========================================
  */

  failure(message) {
    return {
      success: false,
      message,
    };
  }

    /*
  ==========================================
  GET TRACKING SUMMARY
  ==========================================
  */

  getTrackingSummary(response) {
    return {
      waybill:
        response?.ShipmentData?.[0]?.Shipment?.AWB ||
        "",

      status: this.getCurrentStatus(response),

      location: this.getCurrentLocation(response),

      history: this.extractTrackingHistory(response),
    };
  }

  /*
  ==========================================
  GET WAYBILL FROM RESPONSE
  ==========================================
  */

  getWaybill(response) {
    return (
      response?.packages?.[0]?.waybill ||
      response?.packages?.[0]?.awb ||
      response?.waybill ||
      response?.awb ||
      ""
    );
  }

  /*
  ==========================================
  FORMAT DIMENSIONS
  ==========================================
  */

  formatDimensions(order) {
    return {
      weight: order.packageDetails.weight,
      length: order.packageDetails.length,
      width: order.packageDetails.width,
      height: order.packageDetails.height,
    };
  }

  /*
  ==========================================
  LOG SUCCESS
  ==========================================
  */

  logSuccess(title, data = null) {
    console.log("\n==============================");
    console.log(`✅ ${title}`);

    if (data) {
      console.log(
        JSON.stringify(data, null, 2)
      );
    }

    console.log("==============================\n");
  }

  /*
  ==========================================
  LOG ERROR
  ==========================================
  */

  logError(title, error) {
    console.log("\n==============================");
    console.log(`❌ ${title}`);

    console.log(
      error.response?.data ||
      error.message ||
      error
    );

    console.log("==============================\n");
  }

  /*
  ==========================================
  VERIFY DELHIVERY CONNECTION
  ==========================================
  */

  async verifyConnection() {
    try {
      await this.fetchWaybill(1);

      this.logSuccess(
        "Delhivery API Connected"
      );

      return true;
    } catch (error) {
      this.logError(
        "Delhivery Connection Failed",
        error
      );

      return false;
    }
  }
}

export default new DelhiveryService();