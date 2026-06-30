/**
 * Customer Order Confirmation Email Template
 * Modern, responsive, professional design with inline CSS
 * Primary color: #2563eb (as requested)
 */
const customerOrderTemplate = (data) => {
  // Destructure data for easier use
  const {
    orderId,
    customerName,
    orderDate,
    items,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    subtotal,
    shipping,
    discount,
    gst,
    grandTotal,
    estimatedDelivery,
  } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - ${orderId}</title>
    </head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f3f4f6;">
      <!-- Email Container -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f3f4f6;">
        <tr>
          <td align="center" style="padding:24px 16px;">
            <!-- Email Card -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:640px;background-color:#ffffff;border-radius:16px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
              
              <!-- Header / Logo Section -->
              <tr>
                <td align="center" style="background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);padding:32px 24px;border-radius:16px 16px 0 0;">
                  <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">DailyFixCare</h1>
                </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="padding:40px 32px 24px;">
                  <h2 style="margin:0 0 12px;font-size:24px;color:#111827;">Thank You for Your Order!</h2>
                  <p style="margin:0;color:#4b5563;font-size:16px;line-height:1.6;">Hi ${customerName}, your order has been confirmed and is being processed!</p>
                </td>
              </tr>

              <!-- Order Details -->
              <tr>
                <td style="padding:0 32px 24px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:12px;padding:20px;">
                    <tr>
                      <td style="padding:8px 0;">
                        <p style="margin:0;color:#6b7280;font-size:14px;">Order ID</p>
                        <p style="margin:4px 0 0;color:#111827;font-size:16px;font-weight:600;">${orderId}</p>
                      </td>
                      <td style="padding:8px 0;text-align:right;">
                        <p style="margin:0;color:#6b7280;font-size:14px;">Order Date</p>
                        <p style="margin:4px 0 0;color:#111827;font-size:16px;font-weight:600;">${orderDate}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Products List -->
              <tr>
                <td style="padding:0 32px 24px;">
                  <h3 style="margin:0 0 16px;font-size:18px;color:#111827;font-weight:700;">Ordered Products</h3>
                  
                  ${items.map(item => `
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:12px;padding:16px;background-color:#f9fafb;border-radius:12px;">
                      <tr>
                        <td style="vertical-align:top;width:80px;">
                          ${item.image ? `
                            <img src="${item.image}" alt="${item.name}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">
                          ` : `
                            <div style="width:80px;height:80px;background-color:#e5e7eb;border-radius:8px;display:flex;align-items:center;justify-content:center;">
                              <span style="font-size:24px;">📦</span>
                            </div>
                          `}
                        </td>
                        <td style="vertical-align:top;padding:0 0 0 16px;">
                          <p style="margin:0;color:#111827;font-weight:600;font-size:16px;">${item.name}</p>
                          <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">Qty: ${item.quantity}</p>
                        </td>
                        <td style="vertical-align:top;text-align:right;padding:0 0 0 16px;">
                          <p style="margin:0;color:#111827;font-weight:700;font-size:16px;">₹${item.total.toFixed(2)}</p>
                        </td>
                      </tr>
                    </table>
                  `).join('')}
                </td>
              </tr>

              <!-- Order Summary -->
              <tr>
                <td style="padding:0 32px 24px;">
                  <h3 style="margin:0 0 16px;font-size:18px;color:#111827;font-weight:700;">Order Summary</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding:8px 0;color:#4b5563;font-size:16px;">Subtotal</td>
                      <td style="padding:8px 0;text-align:right;color:#111827;font-size:16px;">₹${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#4b5563;font-size:16px;">Shipping</td>
                      <td style="padding:8px 0;text-align:right;color:${shipping === 0 ? '#059669' : '#111827'};font-weight:${shipping === 0 ? '700' : '400'};font-size:16px;">
                        ${shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                      </td>
                    </tr>
                    ${discount > 0 ? `
                      <tr>
                        <td style="padding:8px 0;color:#dc2626;font-size:16px;">Discount</td>
                        <td style="padding:8px 0;text-align:right;color:#dc2626;font-size:16px;">-₹${discount.toFixed(2)}</td>
                      </tr>
                    ` : ''}
                    <tr>
                      <td style="padding:8px 0;color:#4b5563;font-size:16px;">GST (5%)</td>
                      <td style="padding:8px 0;text-align:right;color:#111827;font-size:16px;">₹${gst.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding:16px 0 0;border-top:2px solid #e5e7eb;color:#111827;font-weight:700;font-size:18px;">Grand Total</td>
                      <td style="padding:16px 0 0;border-top:2px solid #e5e7eb;text-align:right;color:#2563eb;font-weight:700;font-size:20px;">₹${grandTotal.toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Shipping Address -->
              <tr>
                <td style="padding:0 32px 24px;">
                  <h3 style="margin:0 0 16px;font-size:18px;color:#111827;font-weight:700;">Shipping Address</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:12px;padding:20px;">
                    <tr>
                      <td>
                        <p style="margin:0;color:#111827;font-weight:600;font-size:16px;">${customerName}</p>
                        <p style="margin:4px 0 0;color:#4b5563;font-size:15px;line-height:1.6;">
                          ${shippingAddress.address}<br>
                          ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Payment & Delivery Info -->
              <tr>
                <td style="padding:0 32px 24px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding:0 12px 0 0;width:50%;">
                        <p style="margin:0;color:#6b7280;font-size:14px;">Payment Method</p>
                        <p style="margin:4px 0 0;color:#111827;font-weight:600;font-size:15px;">${paymentMethod}</p>
                      </td>
                      <td style="padding:0 0 0 12px;width:50%;">
                        <p style="margin:0;color:#6b7280;font-size:14px;">Payment Status</p>
                        <p style="margin:4px 0 0;color:${paymentStatus === 'Paid' ? '#059669' : '#f59e0b'};font-weight:600;font-size:15px;">${paymentStatus}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 12px 0 0;" colspan="2">
                        <p style="margin:0;color:#6b7280;font-size:14px;">Estimated Delivery</p>
                        <p style="margin:4px 0 0;color:#111827;font-weight:600;font-size:15px;">${estimatedDelivery}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Track Order Button -->
              <tr>
                <td style="padding:0 32px 24px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="http://localhost:5173/track-order?id=${orderId}" style="display:inline-block;background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:16px;box-shadow:0 4px 6px -1px rgba(37,99,235,0.3);">
                          📦 Track Your Order
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Contact Support -->
              <tr>
                <td style="padding:24px 32px;border-top:1px solid #e5e7eb;">
                  <h4 style="margin:0 0 8px;font-size:16px;color:#111827;font-weight:700;">Need Help?</h4>
                  <p style="margin:0;color:#4b5563;font-size:14px;line-height:1.6;">
                    If you have any questions, feel free to contact us at 
                    <a href="mailto:support@dailyfixcare.com" style="color:#2563eb;text-decoration:none;font-weight:600;">support@dailyfixcare.com</a>
                    or call us at +91-9876543210
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#111827;padding:32px;border-radius:0 0 16px 16px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <h3 style="margin:0 0 16px;color:#ffffff;font-size:18px;">Connect With Us</h3>
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding:0 8px;">
                              <a href="#" style="color:#9ca3af;font-size:28px;">📘</a>
                            </td>
                            <td style="padding:0 8px;">
                              <a href="#" style="color:#9ca3af;font-size:28px;">📸</a>
                            </td>
                            <td style="padding:0 8px;">
                              <a href="#" style="color:#9ca3af;font-size:28px;">🐦</a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin:20px 0 0;color:#6b7280;font-size:13px;">© ${new Date().getFullYear()} DailyFixCare. All rights reserved.</p>
                        <p style="margin:8px 0 0;color:#4b5563;font-size:12px;">
                          <a href="http://localhost:5173/privacy-policy" style="color:#9ca3af;text-decoration:none;">Privacy Policy</a>
                          &nbsp;|&nbsp;
                          <a href="http://localhost:5173/terms-of-service" style="color:#9ca3af;text-decoration:none;">Terms of Service</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export default customerOrderTemplate;