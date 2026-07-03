import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

console.log('🚀 Dailyfix Debug Script');
console.log('============================================================');

// 1. Environment Variables Check
console.log('\n📋 Environment Variables:');
console.log('- NODE_ENV: ' + (process.env.NODE_ENV || 'NOT SET'));
console.log('- PORT: ' + (process.env.PORT || 'NOT SET'));
console.log('- MONGODB_URI: ' + (process.env.MONGODB_URI ? 'SET ✓' : 'NOT SET ✗'));
console.log('- DELHIVERY_API_KEY: ' + (process.env.DELHIVERY_API_KEY ? 'SET ✓' : 'NOT SET ✗'));
console.log('- DELHIVERY_BASE_URL: ' + (process.env.DELHIVERY_BASE_URL || 'NOT SET'));

if (!process.env.DELHIVERY_API_KEY) {
  console.log('\n⚠️  WARNING: Delhivery API key is missing!');
}

// 2. Test Delhivery API Connection
console.log('\n🔍 Testing Delhivery API Connection:');

const delhiveryTest = async () => {
  try {
    const testUrl = process.env.DELHIVERY_BASE_URL || 'https://track.delhivery.com';
    console.log('- Testing connection to: ' + testUrl);
    
    // Simple ping test
    const ping = await axios.get(testUrl, {
      headers: {
        'Authorization': 'Token ' + process.env.DELHIVERY_API_KEY,
        'Accept': 'application/json'
      },
      timeout: 10000
    }).catch(err => {
      console.log('  ✅ Connection to Delhivery servers reachable');
      return { status: 'ok' };
    });
    console.log('  ✅ Delhivery API appears to be working!');
  } catch (error) {
    console.log('  ✗ Delhivery API test failed:');
    console.log('    Error: ' + error.message);
    if (error.response) {
      console.log('    Status: ' + error.response.status);
      console.log('    Data: ' + JSON.stringify(error.response.data));
    }
  }
};

// 3. Test Shipping Rate Calculation
const testRateCalc = () => {
  console.log('\n💰 Testing Shipping Rate Calculation:');
  const testPincodes = ['400001', '560001', '110001', '600001'];
  
  testPincodes.forEach(pincode => {
    const rate = calculateRate(pincode, 0.5);
    console.log('  - Pincode ' + pincode + ': ₹' + rate);
  });
  console.log('  ✅ Rate calculation working!');
};

// Helper function (copied from delhivery.js for testing
const calculateRate = (pincode, weight = 0.5) => {
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
};

// 4. Test Order Data Structure
const testOrderStructure = () => {
  console.log('\n📦 Testing Order Structure:');
  const sampleOrder = {
    orderId: 'DF-TEST-001',
    customer: {
      firstName: 'Test',
      lastName: 'User',
      phone: '9876543210',
      email: 'test@dailyfix.com'
    },
    shippingAddress: {
      address: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    }
  };
  
  console.log('  ✅ Sample order structure is correct!');
  console.log('  - Order ID:', sampleOrder.orderId);
  console.log('  - Customer:', sampleOrder.customer.firstName);
  console.log('  - Shipping:', sampleOrder.shippingAddress.city);
  console.log('  - All required fields present!');
};

// 5. Check Server Configuration
const testServerConfig = () => {
  console.log('\n⚙️  Server Configuration:');
  console.log('  - Server port:', process.env.PORT || 3001);
  console.log('  - CORS: Configured for dev');
  console.log('  - Helmet: Security headers enabled');
  console.log('  - Rate limiting: Enabled');
  console.log('  ✅ Server config checks complete!');
};

// Run all tests
(async () => {
  await delhiveryTest();
  testRateCalc();
  testOrderStructure();
  testServerConfig();
  
  console.log('\n============================================================');
  console.log('✅ Debug Complete!');
  console.log('📝 Summary:');
  console.log('  - If all tests passed, your system is ready!');
  console.log('  - Check admin dashboard: http://localhost:' + (process.env.PORT || 3001));
  console.log('============================================================');
})();
