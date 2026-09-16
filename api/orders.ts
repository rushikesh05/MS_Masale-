export default async function handler(req: any, res: any) {
  // CORS configuration for Vercel Serverless Function
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { customer, items, paymentMethod, couponCode, discount, subtotal, shippingFee, totalAmount } = body;

      if (!customer || !items || !items.length) {
        return res.status(400).json({ success: false, error: 'Customer address and cart items are required.' });
      }

      const orderId = `AG-${Math.floor(10000 + Math.random() * 90000)}`;
      const randomOtp = String(Math.floor(1000 + Math.random() * 9000));
      const deliveryBoys = [
        { name: 'ज्ञानेश्वर सावंत (Dnyaneshwar)', phone: '+91 97654 32100', vehicleNumber: 'MH 12 BK 4091' },
        { name: 'विक्रम मोहिते (Vikram Mohite)', phone: '+91 98901 12345', vehicleNumber: 'MH 09 DX 7712' },
        { name: 'महेश जाधव (Mahesh Jadhav)', phone: '+91 99223 99881', vehicleNumber: 'MH 11 AT 1822' }
      ];
      const assigned = deliveryBoys[Math.floor(Math.random() * deliveryBoys.length)];

      const newOrder = {
        id: orderId,
        customer,
        items,
        subtotal: subtotal || totalAmount,
        shippingFee: shippingFee || 0,
        discount: discount || 0,
        couponCode: couponCode || undefined,
        totalAmount: totalAmount || subtotal,
        paymentMethod: paymentMethod || 'cod',
        paymentStatus: paymentMethod === 'cod' ? 'pending_cod' : 'paid',
        transactionId: paymentMethod === 'cod' ? undefined : `TXN-${Date.now()}`,
        orderStatus: 'order_placed',
        createdAt: new Date().toISOString(),
        estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        assignedDeliveryPerson: assigned,
        deliveryOtp: randomOtp
      };

      const itemsSummary = items.map((i: any) => `• ${i.titleMr || i.titleEn} (${i.size} x ${i.quantity}) - ₹${i.totalPrice}`).join('\n');
      const waMsgText = `🚩 *अस्सल गावरान चटणी & मसाले - ऑर्डर निश्चित झाली!* 🌶️\n\nनमस्कार ${customer.fullName}, तुमची ऑर्डर *#${orderId}* वर्कशॉपमध्ये नोंदवण्यात आली आहे.\n\n📦 *ऑर्डर तपशील:*\n${itemsSummary}\n\n💰 *एकूण रक्कम:* ₹${newOrder.totalAmount} (${newOrder.paymentStatus === 'paid' ? 'Paid Online' : 'Pay on Delivery - COD'})\n📍 *पत्ता:* ${customer.addressLine1}, ${customer.talukaDistrict} - ${customer.pincode}\n🚚 *डिलिव्हरी पार्टनर:* ${assigned.name} (${assigned.phone})\n🔑 *डिलिव्हरी OTP:* ${randomOtp}\n\nगावरान चवीचा खरा आनंद घ्या! 🙏`;

      const notification = {
        id: `wa-${Date.now()}`,
        orderId,
        recipientPhone: customer.phone,
        recipientName: customer.fullName,
        type: 'order_confirmed',
        messageText: waMsgText,
        timestamp: new Date().toISOString(),
        status: 'delivered'
      };

      return res.status(201).json({
        success: true,
        data: newOrder,
        notification
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to process order' });
    }
  }

  // GET /api/orders
  return res.status(200).json({
    success: true,
    data: []
  });
}
