import axios from "axios";

class DelhiveryService {
  constructor() {
    this.apiKey = process.env.DELHIVERY_API_KEY;

    // Tracking API
    this.baseUrl =
      process.env.DELHIVERY_BASE_URL ||
      "https://track.delhivery.com";

    // Shipment API
    this.shipmentUrl =
      process.env.DELHIVERY_SHIPMENT_URL ||
      "https://bharatapi.delhivery.com";

    if (!this.apiKey) {
      console.warn(
        "⚠️ DELHIVERY_API_KEY is not set in environment variables!"
      );
    }
  }

  /*
  ==========================================
  COMMON HEADERS
  ==========================================
  */

  getHeaders() {
    return {
      Authorization: `Token ${this.apiKey}`,
      Accept: "application/json",
    };
  }


  /*
  ==========================================
  CREATE SHIPMENT
  ==========================================
  */

  async createShipment(orderData) {
    try {
      if (!this.apiKey) {
        throw new Error(
          "DELHIVERY_API_KEY is missing"
        );
      }

      const postData =
        `format=json&data=${encodeURIComponent(
          JSON.stringify(orderData)
        )}`;


      console.log(
        "📦 Creating Delhivery shipment..."
      );

      console.log(
        "📦 Shipment URL:",
        `${this.shipmentUrl}/api/cmu/create.json`
      );


      const response = await axios.post(
        `${this.shipmentUrl}/api/cmu/create.json`,

        postData,

        {
          headers: {
            ...this.getHeaders(),

            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          timeout: 30000,
        }
      );


      console.log(
        "✅ FULL DELHIVERY RESPONSE:",
        JSON.stringify(
          response.data,
          null,
          2
        )
      );


      return response.data;


    } catch (error) {

      console.error(
        "❌ DELHIVERY CREATE SHIPMENT ERROR:",
        error.response?.data ||
        error.message
      );


      throw new Error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create Delhivery shipment"
      );
    }
  }


  /*
  ==========================================
  EXTRACT AWB / WAYBILL
  ==========================================
  */

  extractAWB(response) {

    console.log(
      "🔍 Searching AWB in response:",
      JSON.stringify(
        response,
        null,
        2
      )
    );


    const awb =
      response?.packages?.[0]?.waybill ||

      response?.packages?.[0]?.awb ||

      response?.waybill ||

      response?.awb ||

      response?.data?.packages?.[0]?.waybill ||

      response?.data?.waybill ||

      response?.data?.awb;


    if (!awb) {

      throw new Error(
        "Delhivery did not return AWB / Waybill"
      );
    }


    return String(awb);
  }


  /*
  ==========================================
  TRACK SHIPMENT
  ==========================================
  */

  async trackShipment(waybill) {

    try {

      if (!waybill) {
        throw new Error(
          "Waybill / AWB is required"
        );
      }


      const response = await axios.get(

        `${this.baseUrl}/api/v1/packages/json/`,

        {
          params: {
            waybill: String(waybill),
          },

          headers: {
            ...this.getHeaders(),

            "Content-Type":
              "application/json",
          },

          timeout: 15000,
        }
      );


      return response.data;


    } catch (error) {

      console.error(
        "❌ DELHIVERY TRACKING ERROR:",

        error.response?.data ||
        error.message
      );


      throw new Error(
        error.response?.data?.message ||
        "Failed to track shipment"
      );
    }
  }


  /*
  ==========================================
  GENERATE SHIPPING LABEL
  ==========================================
  */

  async generateLabel(waybills) {

    try {

      if (
        !Array.isArray(waybills) ||
        waybills.length === 0
      ) {

        throw new Error(
          "At least one waybill is required"
        );
      }


      const response = await axios.get(

        `${this.baseUrl}/api/p/packing_slip/`,

        {
          params: {
            waybills:
              waybills.join(","),
          },

          headers: {
            ...this.getHeaders(),

            "Content-Type":
              "application/json",
          },

          responseType:
            "arraybuffer",

          timeout: 30000,
        }
      );


      return response.data;


    } catch (error) {

      console.error(
        "❌ DELHIVERY LABEL ERROR:",

        error.response?.data ||
        error.message
      );


      throw new Error(
        "Failed to generate shipping label"
      );
    }
  }


  /*
  ==========================================
  CANCEL SHIPMENT
  ==========================================
  */

  async cancelShipment(
    waybill,
    reason = "Order cancelled"
  ) {

    try {

      if (!waybill) {

        throw new Error(
          "Waybill / AWB is required"
        );
      }


      const response = await axios.post(

        `${this.shipmentUrl}/api/p/edit/`,

        {
          shipments: [
            {
              waybill: String(waybill),

              status: "Cancelled",

              cancellation_reason:
                reason,
            },
          ],
        },

        {
          headers: {
            ...this.getHeaders(),

            "Content-Type":
              "application/json",
          },

          timeout: 15000,
        }
      );


      return response.data;


    } catch (error) {

      console.error(
        "❌ DELHIVERY CANCEL ERROR:",

        error.response?.data ||
        error.message
      );


      throw new Error(
        "Failed to cancel shipment"
      );
    }
  }

  calculateShipping() {

    return 0;
  }
}


export default new DelhiveryService();