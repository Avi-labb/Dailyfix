import axios from 'axios';

class DelhiveryService {
  constructor() {
    this.apiKey = process.env.DELHIVERY_API_KEY;
    this.baseUrl = process.env.DELHIVERY_BASE_URL || 'https://track.delhivery.com';
    this.shipmentUrl = process.env.DELHIVERY_SHIPMENT_URL || 'https://bharatapi.delhivery.com';
  }

  // Create shipment
  async createShipment(orderData) {
    try {
      const response = await axios.post(
        `${this.shipmentUrl}/api/p/edit/`,
        orderData,
        {
          headers: {
            'Authorization': `Token ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Delhivery create shipment error:', error.response?.data || error.message);
      throw new Error('Failed to create Delhivery shipment');
    }
  }

  // Track shipment by waybill number
  async trackShipment(waybill) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v1/packages/json/`,
        {
          params: {
            waybill: waybill
          },
          headers: {
            'Authorization': `Token ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Delhivery track shipment error:', error.response?.data || error.message);
      throw new Error('Failed to track shipment');
    }
  }

  // Generate shipping label
  async generateLabel(waybills) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/p/packing_slip/`,
        {
          params: {
            waybills: waybills.join(',')
          },
          headers: {
            'Authorization': `Token ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Delhivery generate label error:', error.response?.data || error.message);
      throw new Error('Failed to generate shipping label');
    }
  }

  // Cancel shipment
  async cancelShipment(waybill, reason = 'Order cancelled') {
    try {
      const response = await axios.post(
        `${this.shipmentUrl}/api/p/edit/`,
        {
          shipments: [{
            waybill: waybill,
            status: 'Cancelled',
            cancellation_reason: reason
          }]
        },
        {
          headers: {
            'Authorization': `Token ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Delhivery cancel shipment error:', error.response?.data || error.message);
      throw new Error('Failed to cancel shipment');
    }
  }

  // Calculate shipping charges (mock for now, replace with real API if available)
  calculateShipping(pincode, weight = 0.5) {
    // Simple rate card for demo
    const metroPincodes = ['110001', '110002', '110003', '110004', '110005', 
                          '400001', '400002', '400003', '560001', '560002',
                          '600001', '600002', '700001', '700002'];
    
    let rate = 0;
    if (metroPincodes.includes(pincode)) {
      rate = weight <= 0.5 ? 40 : 40 + Math.ceil((weight - 0.5) * 30);
    } else {
      rate = weight <= 0.5 ? 60 : 60 + Math.ceil((weight - 0.5) * 40);
    }
    
    return rate;
  }
}

export default new DelhiveryService();
