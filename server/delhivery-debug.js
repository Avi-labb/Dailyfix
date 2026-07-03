import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

console.log('🚀 Dailyfix Delhivery Debug Script');
console.log('='.repeat(70));

// Environment check
console.log('\n📋 Environment Variables');
console.log('  DELHIVERY_API_KEY:', process.env.DELHIVERY_API_KEY ? '✅ SET' : '❌ NOT SET');
console.log('  DELHIVERY_BASE_URL:', process.env.DELHIVERY_BASE_URL || 'Default: https://track.delhivery.com');

if (!process.env.DELHIVERY_API_KEY) {
  console.log('\n⚠️  ERROR: Delhivery API Key is missing! Set DELHIVERY_API_KEY in .env file.');
  process.exit(1);
}

const BASE_URL = process.env.DELHIVERY_BASE_URL || 'https://track.delhivery.com';

const delhiveryApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Token ${process.env.DELHIVERY_API_KEY}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Test 1: Ping test to Delhivery
const testPing = async () => {
  console.log('\n🔍 Test 1: Ping Delhivery API');
  try {
    // Try a simple endpoint that should exist
    await delhiveryApi.get('/c/api/pin-codes/json/', {
      params: { filter_codes: '110001' }
    });
    console.log('  ✅ API reachable and authenticated!');
    return true;
  } catch (error) {
    console.log('  ❌ Ping failed:');
    if (error.response) {
      console.log(`    Status: ${error.response.status}`);
      console.log(`    Data:`, JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('    No response from server. Check your internet and Delhivery URL.');
    } else {
      console.log('    Error:', error.message);
    }
    return false;
  }
};

// Test 2: Check pincode serviceability
const testPincodeServiceability = async () => {
  console.log('\n📍 Test 2: Check Pincode Serviceability');
  const pincodes = ['110001', '400001', '560001', '600001', '999999'];
  
  for (const pincode of pincodes) {
    try {
      const response = await delhiveryApi.get('/c/api/pin-codes/json/', {
        params: { filter_codes: pincode }
      });
      
      if (response.data && response.data.delivery_cities && response.data.delivery_cities.length > 0) {
        const city = response.data.delivery_cities[0];
        console.log(`  ✅ ${pincode}: Serviceable (${city.city}, ${city.state})`);
      } else {
        console.log(`  ⚠️  ${pincode}: No serviceability data returned`);
      }
    } catch (error) {
      console.log(`  ❌ ${pincode}: Check failed - ${error.message}`);
    }
  }
};

// Test 3: Shipping rate calculation (simulated like our code)
const testRateCalculation = () => {
  console.log('\n💰 Test 3: Shipping Rate Calculation');
  const calculateRate = (pincode, weight = 0.5) => {
    const metroPincodes = ['110001', '110002', '110003', '110004', '110005', '400001', '400002', '400003', '560001', '560002', '600001', '600002', '700001', '700002'];
    return metroPincodes.includes(pincode) ? (weight <= 0.5 ? 40 : 40 + Math.ceil((weight - 0.5) * 30)) : (weight <= 0.5 ? 60 : 60 + Math.ceil((weight - 0.5) * 40));
  };

  const testCases = [
    { pincode: '110001', weight: 0.5 }, // Metro, lightweight
    { pincode: '110001', weight: 1.0 }, // Metro, heavy
    { pincode: '400001', weight: 0.5 }, // Metro
    { pincode: '999999', weight: 0.5 }, // Non-metro
    { pincode: '999999', weight: 1.2 }  // Non-metro, heavy
  ];

  testCases.forEach(({ pincode, weight }) => {
    console.log(`  Pincode ${pincode} (${weight}kg): ₹${calculateRate(pincode, weight)}`);
  });
};

// Test 4: Show available endpoints we can use
const showEndpoints = () => {
  console.log('\n🔗 Available Delhivery Endpoints:');
  console.log('  - GET /c/api/pin-codes/json/ - Check pincode serviceability');
  console.log('  - POST /api/p/create/ - Create shipment');
  console.log('  - GET /api/v1/packages/json/ - Track shipment');
  console.log('  - GET /api/p/packing-slip/ - Get packing slip');
};

// Run all tests
const runAllTests = async () => {
  await testPing();
  await testPincodeServiceability();
  testRateCalculation();
  showEndpoints();

  console.log('\n' + '='.repeat(70));
  console.log('✅ Delhivery Debug Complete!');
  console.log('='.repeat(70));
};

runAllTests();
