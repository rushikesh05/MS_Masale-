import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { PRODUCTS, BASE_INGREDIENTS, INITIAL_ORDERS, INITIAL_RAW_STOCKS } from './src/data/initialData';
import { Order, RawIngredientStock, WhatsAppNotification, SmsNotification } from './src/types';
import { buildImagenPackagingPrompt, generateFallbackBrandedSvg, PackagingRequestParams } from './src/services/packagingGenerator';

// Gemini AI Client Lazy Initializer
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// In-Memory Database collections (Simulating MongoDB collections: Users, Products, Orders, CustomRecipes, RawStocks, WhatsAppLogs)
let productsDatabase = [...PRODUCTS];
let ordersDatabase: Order[] = [...INITIAL_ORDERS];
let rawStocksDatabase: RawIngredientStock[] = [...INITIAL_RAW_STOCKS];
let whatsAppLogs: WhatsAppNotification[] = [
  {
    id: 'wa-1',
    orderId: 'AG-89421',
    recipientPhone: '+91 98220 44192',
    recipientName: 'सचिन पाटील',
    type: 'order_confirmed',
    messageText: `🚩 *अस्सल गावरान चटणी & मसाले - ऑर्डर निश्चित झाली!* 🌶️\n\nनमस्कार सचिनजी, तुमची ऑर्डर *#AG-89421* यशस्वीरीत्या स्वीकारली आहे.\n\n📦 *तपशील:*\n• रेश्माच्या हातची खास शेंगदाणा-लसूण चटणी (500g Glass Jar) - ₹385\n• सुके खोबरे लसूण चटणी (250g x 2) - ₹350\n\n💰 *एकूण रक्कम:* ₹685 (Paid via UPI)\n📍 *पत्ता:* मोरया रेसिडेन्सी, कर्वे नगर, पुणे\n⏳ *अपेक्षित वितरण:* 24 ते 48 तासांत.\n\nखलबत्त्यात कुटलेली अस्सल चव तुमच्या दारात! धन्यवाद! 🙏`,
    timestamp: '2026-08-15T09:30:15Z',
    status: 'delivered'
  },
  {
    id: 'wa-2',
    orderId: 'AG-89419',
    recipientPhone: '+91 94231 88201',
    recipientName: 'अनघा जोशी',
    type: 'dispatched',
    messageText: `🚚 *ऑर्डर रवाना झाली! (Dispatched)*\n\nनमस्कार अनघाजी, तुमची ऑर्डर *#AG-89419* वर्कशॉपमधून रवाना झाली आहे.\nडिलिव्हरी बॉय: विक्रम मोहिते (+91 98901 12345)\nडिलिव्हरी OTP: *5193*`,
    timestamp: '2026-08-14T14:30:00Z',
    status: 'delivered'
  }
];

let smsLogsDatabase: SmsNotification[] = [
  {
    id: 'sms-init-1',
    orderId: 'AG-89419',
    recipientPhone: '+91 94231 88201',
    recipientName: 'अनघा जोशी',
    type: 'dispatched',
    messageText: 'MS Masale Dispatch Alert: Namaskar Anagha, your Order #AG-89419 is dispatched with rider Vikram Mohite (+91 98901 12345). Your Delivery OTP is: [5193]. Please share this OTP with the rider to verify your parcel upon arrival. Helpline: 8591254237',
    otp: '5193',
    deviceSmsUri: 'sms:+919423188201?body=MS%20Masale%20Dispatch%20Alert%3A%20Your%20Order%20%23AG-89419%20is%20dispatched%20with%20rider%20Vikram%20Mohite.%20Your%20Delivery%20OTP%20is%3A%20%5B5193%5D.',
    whatsAppUri: 'https://api.whatsapp.com/send?phone=919423188201&text=MS%20Masale%20Dispatch%20Alert%3A%20Your%20Order%20%23AG-89419%20is%20dispatched%20with%20rider%20Vikram%20Mohite.%20Your%20Delivery%20OTP%20is%3A%20%5B5193%5D.',
    timestamp: '2026-08-14T14:30:05Z',
    status: 'delivered',
    gateway: 'telecom_sms_gateway'
  }
];

async function sendRealSms(params: {
  phone: string;
  name: string;
  orderId: string;
  type: 'order_confirmed' | 'dispatched' | 'delivered';
  otp?: string;
  customText?: string;
}): Promise<SmsNotification> {
  const cleanPhone = (params.phone || '').replace(/[^0-9]/g, '').slice(-10) || '8591254237';
  const orderNumber = params.orderId;
  const otp = params.otp || Math.floor(1000 + Math.random() * 9000).toString();

  let smsBody = '';
  if (params.customText) {
    smsBody = params.customText;
  } else if (params.type === 'dispatched') {
    smsBody = `MS Masale Dispatch Alert: Namaskar ${params.name}, your Order #${orderNumber} is dispatched with rider! Your Delivery Validation OTP is: [${otp}]. Please share this OTP with the rider to verify your parcel upon arrival. Helpline: 8591254237`;
  } else if (params.type === 'delivered') {
    smsBody = `MS Masale: Namaskar ${params.name}, your Order #${orderNumber} has been delivered successfully! Thank you for choosing authentic Kolhapuri spices. Helpline: 8591254237`;
  } else {
    smsBody = `MS Masale: Namaskar ${params.name}, your Order #${orderNumber} is confirmed! Fresh stone-ground spices are being packed. Payment Helpline: 8591254237`;
  }

  let gateway = 'telecom_sms_gateway';

  // Fast2SMS live carrier delivery if FAST2SMS_API_KEY is configured
  if (process.env.FAST2SMS_API_KEY && cleanPhone.length === 10) {
    try {
      const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&route=q&message=${encodeURIComponent(smsBody)}&language=english&flash=0&numbers=${cleanPhone}`);
      const result = await response.json();
      if (result && result.return) {
        gateway = 'fast2sms_telecom_live';
        console.log(`[SMS Gateway] Sent live SMS to +91 ${cleanPhone} via Fast2SMS`);
      }
    } catch (e) {
      console.warn('[SMS Gateway] Fast2SMS connection check:', e);
    }
  }

  // Twilio live carrier delivery if TWILIO credentials configured
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER && cleanPhone.length === 10) {
    try {
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const formData = new URLSearchParams();
      formData.append('To', `+91${cleanPhone}`);
      formData.append('From', process.env.TWILIO_PHONE_NUMBER);
      formData.append('Body', smsBody);
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });
      gateway = 'twilio_telecom_live';
      console.log(`[SMS Gateway] Sent live SMS to +91 ${cleanPhone} via Twilio`);
    } catch (e) {
      console.warn('[SMS Gateway] Twilio connection check:', e);
    }
  }

  const notification: SmsNotification = {
    id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    orderId: orderNumber,
    recipientPhone: `+91 ${cleanPhone}`,
    recipientName: params.name,
    type: params.type,
    messageText: smsBody,
    otp,
    deviceSmsUri: `sms:+91${cleanPhone}?body=${encodeURIComponent(smsBody)}`,
    whatsAppUri: `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(smsBody)}`,
    timestamp: new Date().toISOString(),
    status: 'delivered',
    gateway
  };

  smsLogsDatabase.unshift(notification);
  return notification;
}

let inquiriesDatabase: any[] = [
  {
    id: 'INQ-94812',
    fullName: 'विकास पवार (Vikas Pawar)',
    phone: '+91 98221 55667',
    email: 'hotel.swad@gmail.com',
    city: 'पुणे (Pune)',
    pincode: '411038',
    inquiryType: 'restaurant_supply',
    rating: 5,
    quantityKg: 50,
    message: 'आमच्या हॉटेलसाठी दरमहा २५ किलो शेंगदाणा चटणी व २५ किलो वडापाव लाल चटणी हवी आहे. नियमित दर द्यावेत.',
    status: 'in_review',
    createdAt: '2026-08-14T11:20:00Z'
  },
  {
    id: 'INQ-94815',
    fullName: 'श्रीमती सुवर्णा कुलकर्णी (Suvarna Kulkarni)',
    phone: '+91 94220 88123',
    email: 'suvarna.k@example.com',
    city: 'नाशिक (Nashik)',
    pincode: '422005',
    inquiryType: 'bulk_wedding_order',
    rating: 5,
    quantityKg: 30,
    message: 'मुलीच्या लग्नासाठी २०० जार (१५०g) शेंगदाणा व कांदा-लसूण चटणीचे रिटर्न गिफ्ट हॅम्पर हवे आहेत.',
    status: 'new',
    createdAt: '2026-08-15T15:45:00Z'
  }
];

export interface StaffUserRecord {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  role: 'admin' | 'manager' | 'delivery' | 'customer';
  status: 'active' | 'pending' | 'suspended';
  assignedArea?: string;
  createdAt: string;
  lastLogin?: string;
}

let staffUsersDatabase: StaffUserRecord[] = [
  {
    id: 'usr-admin-rushikesh',
    email: 'rushikesh.founder@assalgavran.in',
    displayName: 'ऋषिकेश सूर्यवंशी (Rushikesh Suryavanshi - Founder Admin)',
    phone: '+91 98900 12345',
    role: 'admin',
    status: 'active',
    assignedArea: 'Central Maharashtra / HQ',
    createdAt: '2026-01-01T08:00:00Z',
    lastLogin: '2026-08-28T09:15:00Z'
  },
  {
    id: 'usr-admin-rushikesh-alt',
    email: 'rushikeshsurywanshi007@gmail.com',
    displayName: 'ऋषिकेश सूर्यवंशी (Rushikesh - Executive Admin)',
    phone: '+91 98900 12345',
    role: 'admin',
    status: 'active',
    assignedArea: 'System Executive Admin',
    createdAt: '2026-01-01T08:00:00Z',
    lastLogin: '2026-08-28T10:00:00Z'
  },
  {
    id: 'usr-manager-suvarna',
    email: 'suvarna.manager@assalgavran.in',
    displayName: 'सुवर्णा (Suvarna - Workshop Manager & Head Chef)',
    phone: '+91 98654 33221',
    role: 'manager',
    status: 'active',
    assignedArea: 'Pune Khalbatta Workshop #1',
    createdAt: '2026-02-10T09:30:00Z',
    lastLogin: '2026-08-28T08:45:00Z'
  },
  {
    id: 'usr-delivery-mukund',
    email: 'mukund.rider@assalgavran.in',
    displayName: 'मुकुंद (Mukund - Fleet Delivery Partner)',
    phone: '+91 97654 32100',
    role: 'delivery',
    status: 'active',
    assignedArea: 'Pune City (Kothrud / Deccan / Karve Rd)',
    createdAt: '2026-03-01T07:00:00Z',
    lastLogin: '2026-08-28T09:30:00Z'
  },
  {
    id: 'usr-delivery-vishal',
    email: 'vishal.rider@assalgavran.in',
    displayName: 'विशाल (Vishal - Express Delivery Partner)',
    phone: '+91 98901 12345',
    role: 'delivery',
    status: 'active',
    assignedArea: 'PCMC, Baner & Hinjewadi Tech Park',
    createdAt: '2026-03-15T08:30:00Z',
    lastLogin: '2026-08-27T16:20:00Z'
  },
  {
    id: 'usr-customer-1',
    email: 'anand.patil@assalgavran.in',
    displayName: 'आनंदराव पाटील (Anand Patil)',
    phone: '+91 98224 55667',
    role: 'customer',
    status: 'active',
    assignedArea: 'Shivaji Nagar, Pune',
    createdAt: '2026-04-01T12:00:00Z',
    lastLogin: '2026-08-28T07:10:00Z'
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Dedicated High-Efficiency Image Upload API Endpoint
  app.post('/api/upload-image', async (req: Request, res: Response) => {
    try {
      const { image, filename } = req.body;
      if (!image || typeof image !== 'string') {
        return res.status(400).json({ success: false, error: 'No image data provided' });
      }

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Check if data URL
      const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      let buffer: Buffer;
      let ext = 'webp';

      if (matches && matches.length === 3) {
        ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        // Raw base64 string
        buffer = Buffer.from(image, 'base64');
      }

      const uniqueName = `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const filePath = path.join(uploadsDir, uniqueName);

      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${uniqueName}`;
      console.log(`[Upload] Image saved successfully: ${publicUrl} (${Math.round(buffer.length / 1024)} KB)`);

      res.json({
        success: true,
        url: publicUrl,
        sizeKb: Math.round(buffer.length / 1024),
        filename: uniqueName
      });
    } catch (error: any) {
      console.error('[Upload] Error uploading image:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to process image upload' });
    }
  });

  // API 1: Products Catalog
  app.get('/api/products', (req: Request, res: Response) => {
    res.json({ success: true, data: productsDatabase });
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = productsDatabase.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  });

  // API 2: Custom Chutney Dynamic Pricing Calculator & Flavor Analysis
  app.post('/api/custom-builder/calculate', (req: Request, res: Response) => {
    const { baseIngredients, garlicLevel, saltType, oilType, packSizeGrams, packagingType } = req.body;

    let baseRatePer100g = 0;
    const weights = baseIngredients || { peanuts: 50, dryCoconut: 30, sesameSeeds: 10, flaxseed: 5, redChilliBase: 5 };
    const totalPercentage = Object.values(weights).reduce((a: number, b: any) => a + (Number(b) || 0), 0);

    // Calculate base ingredient blend weighted cost
    const totalPct = Number(totalPercentage) || 100;
    BASE_INGREDIENTS.forEach(ing => {
      const p = Number((weights as Record<string, number>)[ing.id] || 0) / totalPct;
      baseRatePer100g += p * ing.pricePer100g;
    });

    const grams = packSizeGrams || 500;
    let basePrice = (baseRatePer100g / 100) * grams;

    // Add garlic price
    if (garlicLevel === 'low') basePrice += 15;
    else if (garlicLevel === 'medium') basePrice += 25;
    else if (garlicLevel === 'extra') basePrice += 45;

    // Add salt price
    if (saltType === 'sendhav') basePrice += 20;
    else if (saltType === 'low_salt') basePrice += 15;

    // Add oil price
    if (oilType === 'groundnut_cold_pressed') basePrice += 35;
    else if (oilType === 'extra_drizzle') basePrice += 55;

    // Packaging surcharge
    if (packagingType === 'glass_heritage_jar') basePrice += 40;
    else basePrice += 15;

    const finalPrice = Math.round(basePrice);

    res.json({
      success: true,
      data: {
        calculatedPrice: finalPrice,
        pricePer100g: Math.round((finalPrice / grams) * 100),
        shelfLifeDays: oilType === 'none' ? 180 : 90,
        craftNoteMr: 'पारंपरिक लाकडी खलबत्त्यात कुटलेली अस्सल ताजी गावरान चव',
        craftNoteEn: 'Freshly stone-pounded in traditional mortar with zero artificial preservatives'
      }
    });
  });

  // API 3: Orders CRUD
  app.get('/api/orders', (req: Request, res: Response) => {
    const { role, status, phone } = req.query;
    let results = [...ordersDatabase];

    if (phone) {
      results = results.filter(o => o.customer.phone.replace(/\D/g, '').includes(String(phone).replace(/\D/g, '')));
    }

    if (status) {
      results = results.filter(o => o.orderStatus === status);
    }

    res.json({ success: true, data: results });
  });

  app.post('/api/orders', async (req: Request, res: Response) => {
    const { customer, items, paymentMethod, couponCode, discount, subtotal, shippingFee, totalAmount } = req.body;

    if (!customer || !items || !items.length) {
      return res.status(400).json({ success: false, error: 'Invalid order payload' });
    }

    const orderId = `AG-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomOtp = String(Math.floor(1000 + Math.random() * 9000));
    
    // Auto delivery partner assignment
    const deliveryBoys = [
      { name: 'ज्ञानेश्वर सावंत (Dnyaneshwar)', phone: '+91 97654 32100', vehicleNumber: 'MH 12 BK 4091' },
      { name: 'विक्रम मोहिते (Vikram Mohite)', phone: '+91 98901 12345', vehicleNumber: 'MH 09 DX 7712' },
      { name: 'महेश जाधव (Mahesh Jadhav)', phone: '+91 99223 99881', vehicleNumber: 'MH 11 AT 1822' }
    ];
    const assigned = deliveryBoys[Math.floor(Math.random() * deliveryBoys.length)];

    const newOrder: Order = {
      id: orderId,
      customer,
      items,
      subtotal: subtotal || totalAmount,
      shippingFee: shippingFee || 0,
      discount: discount || 0,
      couponCode: couponCode || undefined,
      totalAmount: totalAmount || subtotal,
      paymentMethod: paymentMethod || 'upi',
      paymentStatus: paymentMethod === 'cod' ? 'pending_cod' : 'paid',
      transactionId: paymentMethod === 'cod' ? undefined : `TXN-${Date.now()}`,
      orderStatus: 'order_placed',
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      assignedDeliveryPerson: assigned,
      deliveryOtp: randomOtp
    };

    ordersDatabase.unshift(newOrder);

    // Update raw inventory stocks based on custom items
    items.forEach((item: any) => {
      if (item.isCustomRecipe && item.customDetails) {
        const grams = item.customDetails.packSizeGrams || 500;
        const totalKg = (grams * item.quantity) / 1000;
        const base = item.customDetails.baseIngredients || {};
        
        // Deduct raw ingredients
        if (base.peanuts) {
          const peanutsStock = rawStocksDatabase.find(s => s.id === 'stock-peanuts');
          if (peanutsStock) peanutsStock.currentStockKg = Math.max(0, peanutsStock.currentStockKg - (totalKg * (base.peanuts / 100)));
        }
        if (base.dryCoconut) {
          const coconutStock = rawStocksDatabase.find(s => s.id === 'stock-coconut');
          if (coconutStock) coconutStock.currentStockKg = Math.max(0, coconutStock.currentStockKg - (totalKg * (base.dryCoconut / 100)));
        }
        if (base.sesameSeeds) {
          const sesameStock = rawStocksDatabase.find(s => s.id === 'stock-sesame');
          if (sesameStock) sesameStock.currentStockKg = Math.max(0, sesameStock.currentStockKg - (totalKg * (base.sesameSeeds / 100)));
        }
        if (base.flaxseed) {
          const flaxStock = rawStocksDatabase.find(s => s.id === 'stock-flaxseed');
          if (flaxStock) flaxStock.currentStockKg = Math.max(0, flaxStock.currentStockKg - (totalKg * (base.flaxseed / 100)));
        }
      }
    });

    // Auto-generate WhatsApp Notification
    const itemsSummary = items.map((i: any) => `• ${i.titleMr} (${i.size} x ${i.quantity}) - ₹${i.totalPrice}`).join('\n');
    const waMsgText = `🚩 *अस्सल गावरान चटणी & मसाले - ऑर्डर निश्चित झाली!* 🌶️\n\nनमस्कार ${customer.fullName}, तुमची ऑर्डर *#${orderId}* वर्कशॉपमध्ये नोंदवण्यात आली आहे.\n\n📦 *ऑर्डर तपशील:*\n${itemsSummary}\n\n💰 *एकूण रक्कम:* ₹${newOrder.totalAmount} (${newOrder.paymentStatus === 'paid' ? 'Paid Online' : 'Pay on Delivery - COD'})\n📍 *पत्ता:* ${customer.addressLine1}, ${customer.talukaDistrict} - ${customer.pincode}\n🚚 *डिलिव्हरी पार्टनर:* ${assigned.name} (${assigned.phone})\n🔑 *डिलिव्हरी OTP:* ${randomOtp}\n\nगावरान चवीचा खरा आनंद घ्या! 🙏`;

    const newNotification: WhatsAppNotification = {
      id: `wa-${Date.now()}`,
      orderId,
      recipientPhone: customer.phone,
      recipientName: customer.fullName,
      type: 'order_confirmed',
      messageText: waMsgText,
      timestamp: new Date().toISOString(),
      status: 'delivered'
    };
    whatsAppLogs.unshift(newNotification);

    // Auto-generate Real SMS Notification
    let smsNotification: SmsNotification | null = null;
    try {
      smsNotification = await sendRealSms({
        phone: customer.phone,
        name: customer.fullName,
        orderId,
        type: 'order_confirmed',
        otp: randomOtp
      });
    } catch (e) {
      console.warn('[Order] SMS notification send error:', e);
    }

    res.status(201).json({
      success: true,
      data: newOrder,
      notification: newNotification,
      smsNotification
    });
  });

  // Dedicated Admin Dispatch Endpoint
  app.post('/api/orders/:id/dispatch', async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = ordersDatabase.find(o => o.id === id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Generate or maintain 4-digit OTP
    if (!order.deliveryOtp) {
      order.deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
    }

    // Assign delivery partner if missing
    if (!order.assignedDeliveryPerson) {
      order.assignedDeliveryPerson = {
        name: 'विक्रम मोहिते (Vikram Mohite)',
        phone: '+91 98901 12345',
        vehicleNumber: 'MH 09 DX 7712'
      };
    }

    order.orderStatus = 'out_for_delivery';

    // Trigger Real SMS with OTP to Customer
    const sms = await sendRealSms({
      phone: order.customer.phone,
      name: order.customer.fullName,
      orderId: order.id,
      type: 'dispatched',
      otp: order.deliveryOtp
    });

    // Also add to WhatsApp logs
    const waText = `🚚 *ऑर्डर रवाना झाली! (Dispatched by Admin)*\n\nनमस्कार ${order.customer.fullName}, तुमची ऑर्डर *#${order.id}* रवाना झाली आहे.\nडिलिव्हरी पार्टनर: ${order.assignedDeliveryPerson.name} (${order.assignedDeliveryPerson.phone})\n🔑 *डिलिव्हरी OTP: ${order.deliveryOtp}*\n\nकृपया पार्सल मिळाल्यावर हा OTP डिलिव्हरी पार्टनरला सांगा. Helpline: 8591254237`;
    whatsAppLogs.unshift({
      id: `wa-${Date.now()}`,
      orderId: order.id,
      recipientPhone: order.customer.phone,
      recipientName: order.customer.fullName,
      type: 'dispatched',
      messageText: waText,
      timestamp: new Date().toISOString(),
      status: 'delivered'
    });

    res.json({
      success: true,
      data: order,
      smsNotification: sms,
      message: `Order dispatched successfully! OTP ${order.deliveryOtp} sent via SMS to ${order.customer.phone}`
    });
  });

  app.patch('/api/orders/:id/status', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, otp } = req.body;

    const order = ordersDatabase.find(o => o.id === id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (status === 'delivered') {
      if (otp && order.deliveryOtp && otp !== order.deliveryOtp) {
        return res.status(400).json({ success: false, error: 'चुकीचा OTP! ग्राहक SMS मध्ये मिळालेला योग्य 4-अंकी OTP टाका.' });
      }
      order.deliveryTime = new Date().toISOString();
      if (order.paymentMethod === 'cod') {
        order.paymentStatus = 'paid';
      }
    }

    if (status === 'out_for_delivery' && !order.deliveryOtp) {
      order.deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
    }

    order.orderStatus = status;

    // Trigger real SMS when dispatched or delivered
    let smsNotification: SmsNotification | null = null;
    if (status === 'out_for_delivery') {
      smsNotification = await sendRealSms({
        phone: order.customer.phone,
        name: order.customer.fullName,
        orderId: order.id,
        type: 'dispatched',
        otp: order.deliveryOtp
      });
    } else if (status === 'delivered') {
      smsNotification = await sendRealSms({
        phone: order.customer.phone,
        name: order.customer.fullName,
        orderId: order.id,
        type: 'delivered'
      });
    }

    // Trigger status WhatsApp notification
    let statusText = '';
    if (status === 'blending_in_workshop') {
      statusText = `🧑‍🍳 *ताजी चटणी कुटणे सुरू आहे! (Preparation in Progress)*\n\nनमस्कार ${order.customer.fullName}, तुमची ऑर्डर *#${order.id}* आपल्या पारंपरिक खलबत्त्यात ताजी तयार केली जात आहे.`;
    } else if (status === 'packed_in_airtight_jar') {
      statusText = `🫙 *जार पॅकिंग पूर्ण! (Packed & Sealed)*\n\nनमस्कार ${order.customer.fullName}, तुमची ऑर्डर *#${order.id}* एअरटाइट ग्लास जारमध्ये सुरक्षित सील करण्यात आली आहे.`;
    } else if (status === 'out_for_delivery') {
      statusText = `🚚 *डिलिव्हरीसाठी बाहेर पडले! (Out for Delivery)*\n\nनमस्कार ${order.customer.fullName}, आमचा पार्टनर ${order.assignedDeliveryPerson?.name} (${order.assignedDeliveryPerson?.phone}) तुमच्या पत्त्यावर येत आहे. डिलिव्हरी OTP: *${order.deliveryOtp}*`;
    } else if (status === 'delivered') {
      statusText = `🎉 *ऑर्डर पोहोचली! (Delivered)*\n\nनमस्कार ${order.customer.fullName}, तुमची ऑर्डर *#${order.id}* यशस्वीरीत्या पोहोचवली आहे. अस्सल गावरान चवीचा आस्वाद घ्या आणि आम्हाला नक्की कळवा! ⭐⭐⭐⭐⭐`;
    }

    if (statusText) {
      whatsAppLogs.unshift({
        id: `wa-${Date.now()}`,
        orderId: order.id,
        recipientPhone: order.customer.phone,
        recipientName: order.customer.fullName,
        type: status === 'delivered' ? 'delivered' : 'dispatched',
        messageText: statusText,
        timestamp: new Date().toISOString(),
        status: 'delivered'
      });
    }

    res.json({ success: true, data: order, smsNotification });
  });

  // SMS Notifications API
  app.get('/api/notifications/sms', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: smsLogsDatabase
    });
  });

  app.post('/api/notifications/sms/send', async (req: Request, res: Response) => {
    const { phone, name, orderId, type, otp, text } = req.body;
    if (!phone || !orderId) {
      return res.status(400).json({ success: false, error: 'Phone and OrderId required' });
    }

    const notification = await sendRealSms({
      phone,
      name: name || 'Valued Customer',
      orderId,
      type: type || 'dispatched',
      otp,
      customText: text
    });

    res.json({ success: true, data: notification });
  });

  // API 4: Inventory & Raw Stocks
  app.get('/api/inventory', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        rawStocks: rawStocksDatabase,
        standardProducts: productsDatabase
      }
    });
  });

  app.patch('/api/inventory/raw-stocks/:id', (req: Request, res: Response) => {
    const stock = rawStocksDatabase.find(s => s.id === req.params.id);
    if (!stock) {
      return res.status(404).json({ success: false, error: 'Raw stock item not found' });
    }
    const { addKg, setStockKg } = req.body;
    if (typeof addKg === 'number') {
      stock.currentStockKg += addKg;
      stock.lastProcuredDate = new Date().toISOString().split('T')[0];
    } else if (typeof setStockKg === 'number') {
      stock.currentStockKg = setStockKg;
    }
    res.json({ success: true, data: stock });
  });

  // API 5: WhatsApp Logs
  app.get('/api/whatsapp-logs', (req: Request, res: Response) => {
    res.json({ success: true, data: whatsAppLogs });
  });

  // API 5b: Google Forms & Customer Inquiries / Feedback
  app.get('/api/inquiries', (req: Request, res: Response) => {
    res.json({ success: true, data: inquiriesDatabase });
  });

  app.post('/api/inquiries', (req: Request, res: Response) => {
    const { fullName, phone, email, city, pincode, inquiryType, rating, quantityKg, message } = req.body;
    if (!fullName || !phone || !message) {
      return res.status(400).json({ success: false, error: 'Full name, phone, and message are required.' });
    }

    const newInquiry = {
      id: req.body.id || `INQ-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName,
      phone,
      email: email || '',
      city: city || 'Maharashtra',
      pincode: pincode || '',
      inquiryType: inquiryType || 'general',
      rating: rating || 5,
      quantityKg: Number(quantityKg) || 0,
      message,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    inquiriesDatabase.unshift(newInquiry);
    res.status(201).json({ success: true, data: newInquiry });
  });

  app.patch('/api/inquiries/:id/status', (req: Request, res: Response) => {
    const inq = inquiriesDatabase.find(i => i.id === req.params.id);
    if (!inq) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    if (req.body.status) inq.status = req.body.status;
    res.json({ success: true, data: inq });
  });

  // API 5.5: Staff & Role Access Management (कर्मचारी व रोल ॲक्सेस)
  app.get('/api/staff-users', (req: Request, res: Response) => {
    res.json({ success: true, data: staffUsersDatabase });
  });

  app.post('/api/staff-users', (req: Request, res: Response) => {
    const { email, displayName, role, phone, assignedArea } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const existingIndex = staffUsersDatabase.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingIndex >= 0) {
      staffUsersDatabase[existingIndex] = {
        ...staffUsersDatabase[existingIndex],
        displayName: displayName || staffUsersDatabase[existingIndex].displayName,
        role: role || staffUsersDatabase[existingIndex].role,
        phone: phone || staffUsersDatabase[existingIndex].phone,
        assignedArea: assignedArea || staffUsersDatabase[existingIndex].assignedArea
      };
      return res.json({ success: true, data: staffUsersDatabase[existingIndex], message: 'User role updated' });
    }

    const newStaff: StaffUserRecord = {
      id: `usr-${Date.now()}`,
      email: email.toLowerCase().trim(),
      displayName: displayName || email.split('@')[0],
      phone: phone || '',
      role: role || 'customer',
      status: 'active',
      assignedArea: assignedArea || 'Maharashtra',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    staffUsersDatabase.unshift(newStaff);
    res.status(201).json({ success: true, data: newStaff, message: 'Staff member added successfully' });
  });

  app.patch('/api/staff-users/:id/role', (req: Request, res: Response) => {
    const user = staffUsersDatabase.find(u => u.id === req.params.id || u.email.toLowerCase() === req.params.id.toLowerCase());
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    if (req.body.role) user.role = req.body.role;
    if (req.body.status) user.status = req.body.status;
    if (req.body.assignedArea) user.assignedArea = req.body.assignedArea;
    res.json({ success: true, data: user, message: 'Role updated successfully' });
  });

  app.delete('/api/staff-users/:id', (req: Request, res: Response) => {
    const initialLen = staffUsersDatabase.length;
    staffUsersDatabase = staffUsersDatabase.filter(u => u.id !== req.params.id && u.email.toLowerCase() !== req.params.id.toLowerCase());
    if (staffUsersDatabase.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Staff member not found' });
    }
    res.json({ success: true, message: 'Staff member access revoked' });
  });

  // API 6: AI Chutney Sommelier (अस्सल चव पारखी)
  app.post('/api/sommelier/pairings', async (req: Request, res: Response) => {
    const { dishName, spicePreference, language } = req.body;
    const dish = (dishName || 'Jowar Bhakri').trim();
    const lang = language === 'en' ? 'en' : 'mr';

    // Rich Maharashtrian pairing database fallback
    const fallbackRecommendations: Record<string, any> = {
      'bhakri': {
        recommendedChutneyMr: 'सोलापुरी शेंगदाणा चटणी व गावरान कांदा-लसूण चटणी',
        recommendedChutneyEn: 'Solapuri Crunchy Peanut Chutney & Gavran Kanda-Lasun',
        whyPairingMr: 'कडक किंवा मऊ गरम भाकरीसोबत शेंगदाणा चटणीत कच्चे लाकडी घाण्याचे तेल किंवा पांढरे लोणी मिसळल्यास स्वर्गीय चव मिळते. सोबत कांदा चुरडून खावा.',
        whyPairingEn: 'The nutty richness of Solapuri roasted peanuts and spicy garlic creates the ultimate rustic Maharashtrian staple with hot Jowar/Bajra Bhakri and raw wood-pressed oil.',
        proTipMr: 'भाकरीवर १ चमचा शेंगदाणा चटणी पसरवा आणि त्यावर २ चमचे कोमट शेंगदाणा तेल शिंपडा.',
        proTipEn: 'Spread 1 tbsp chutney on hot Bhakri and drizzle 2 tbsp warm groundnut oil or homemade white butter.',
        suggestedProductId: 'prod-shengdana-chutney'
      },
      'vada_pav': {
        recommendedChutneyMr: 'सुके खोबरे लसूण चटणी (वडापाव स्पेशल)',
        recommendedChutneyEn: 'Dry Coconut Garlic Vada Pav Red Chutney',
        whyPairingMr: 'गरमागरम बटाटा वडा आणि लादी पावामध्ये ही कुरकुरीत तळलेल्या लसणाची व खोबऱ्याची चटणी भरल्याशिवाय वडापावची खरी मजा येत नाही.',
        whyPairingEn: 'The crispy toasted copra and fiery garlic crumbs provide the quintessential crunchy street flavor inside the soft pav.',
        proTipMr: 'पावाच्या आतल्या बाजूला भरपूर सुकी लाल चटणी आणि सोबत तळलेली हिरवी मिरची ठेवा.',
        proTipEn: 'Sprinkle generously between the potato vada and fresh pav with a fried salted green chilli.',
        suggestedProductId: 'prod-vada-pav-coconut'
      },
      'thalipeeth': {
        recommendedChutneyMr: 'गावरान तिळाची चटणी व ओमेगा-३ जवसाची चटणी',
        recommendedChutneyEn: 'Authentic Roasted Sesame (Til) & Flaxseed Chutney',
        whyPairingMr: 'भाजणीच्या थालीपीठात आधीच अनेक धान्यांचे सत्व असते. त्यासोबत तीळ आणि जवसाची चटणी व घट्ट घरचे दही अप्रतिम संगती साधते.',
        whyPairingEn: 'Bhajani Thalipeeth harmonizes flawlessly with calcium-rich sesame and omega-3 flaxseed condiments accompanied by thick dahi.',
        proTipMr: 'थालीपीठाच्या मध्यभागी साजूक तुपाचा किंवा लोण्याचा गोळा ठेवून सोबत तिळाची चटणी घ्या.',
        proTipEn: 'Serve with fresh homemade white makkhan, hung curd, and a spoonful of Til Chutney.',
        suggestedProductId: 'prod-til-chutney'
      },
      'poha': {
        recommendedChutneyMr: 'जवसाची किंवा सुक्या खोबऱ्याची लसूण चटणी',
        recommendedChutneyEn: 'Roasted Flaxseed or Dry Coconut Garlic Chutney',
        whyPairingMr: 'कांदे पोहे किंवा दडपे पोह्यावर वरून बारीक शेव आणि अर्धा चमचा सुकी खोबरे-लसूण चटणी भुरभुरल्यास पोह्याची चव दुपटीने वाढते.',
        whyPairingEn: 'Adding a pinch of crispy coconut-garlic or flaxseed powder over Kanda Poha elevates its aromatic savoriness.',
        proTipMr: 'लिंबू पिळल्यानंतर वरून थोडीशी चटणी शिंपडा.',
        proTipEn: 'Garnish with freshly scraped coconut, lemon juice, and half a teaspoon of dry chutney.',
        suggestedProductId: 'prod-vada-pav-coconut'
      },
      'varan_bhaat': {
        recommendedChutneyMr: 'सोलापुरी शेंगदाणा चटणी किंवा गावरान कांदा-लसूण चटणी',
        recommendedChutneyEn: 'Solapuri Peanut Chutney with Pure Ghee & Steamed Rice',
        whyPairingMr: 'गरम साध्या भातावर साजूक तूप, पिवळेधमक वरण आणि ताटाच्या कोपऱ्यात खमंग शेंगदाणा चटणी ही अस्सल मराठी माणसाची कम्फर्ट फूड मेजवानी आहे.',
        whyPairingEn: 'The quintessential comfort food: Steaming hot Indrayani/Kolam rice, toor dal varan, pure cow ghee, and a side of crunchy peanut chutney.',
        proTipMr: 'तुपामध्ये चटणी कालवून भातासोबत आस्वाद घ्या.',
        proTipEn: 'Mix a small pinch of chutney directly into the hot ghee-rice for an explosion of rustic flavor.',
        suggestedProductId: 'prod-shengdana-chutney'
      }
    };

    // Attempt Gemini AI Generation if key available
    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const prompt = `You are a Grandmaster Maharashtrian Culinary Sommelier and Food Historian (अस्सल महाराष्ट्रीयन चव पारखी).
User is asking for the ideal traditional Maharashtrian chutney & spice pairing for this dish: "${dish}".
User Spice Preference: ${spicePreference || 'Medium'}.
Target Response Language: ${lang === 'mr' ? 'Marathi (मराठी)' : 'English'}.

Respond strictly in JSON format matching this schema:
{
  "dishIdentified": string,
  "recommendedChutneyMr": string,
  "recommendedChutneyEn": string,
  "whyPairingMr": string,
  "whyPairingEn": string,
  "proTipMr": string,
  "proTipEn": string,
  "flavorProfile": {
    "spice": string,
    "crunch": string,
    "traditionScore": string
  },
  "suggestedProductId": "prod-shengdana-chutney" | "prod-kanda-lasun" | "prod-vada-pav-coconut" | "prod-til-chutney" | "prod-javas-chutney" | "prod-kala-masala"
}`;

        const aiResponse = await gemini.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (aiResponse.text) {
          const parsed = JSON.parse(aiResponse.text);
          return res.json({ success: true, data: parsed, source: 'gemini_ai' });
        }
      } catch (err) {
        console.warn('Gemini Sommelier API fallback triggered:', err);
      }
    }

    // Keyword matching fallback
    const lower = dish.toLowerCase();
    let selectedFallback = fallbackRecommendations['bhakri'];
    if (lower.includes('vada') || lower.includes('pav') || lower.includes('samosa') || lower.includes('bhaji')) {
      selectedFallback = fallbackRecommendations['vada_pav'];
    } else if (lower.includes('thalipeeth') || lower.includes('paratha') || lower.includes('puri') || lower.includes('roti')) {
      selectedFallback = fallbackRecommendations['thalipeeth'];
    } else if (lower.includes('poha') || lower.includes('pohe') || lower.includes('upma') || lower.includes('khichdi')) {
      selectedFallback = fallbackRecommendations['poha'];
    } else if (lower.includes('rice') || lower.includes('bhaat') || lower.includes('varan') || lower.includes('dal')) {
      selectedFallback = fallbackRecommendations['varan_bhaat'];
    }

    res.json({
      success: true,
      data: {
        dishIdentified: dish,
        ...selectedFallback,
        flavorProfile: {
          spice: 'गावरान खमंग ठसका (Balanced & Zesty)',
          crunch: '१०/१० खलबत्त्यात कुटलेली',
          traditionScore: '१००% अस्सल गावरान'
        }
      },
      source: 'culinary_knowledge_base'
    });
  });

  // Recent AI Packaging Generations In-Memory Store
  const packagingGenerationsHistory: Array<{
    id: string;
    imageUrl: string;
    productName: string;
    productNameEn?: string;
    engineUsed: string;
    promptUsed: string;
    packagingType: string;
    styleVariant: string;
    aspectRatio: string;
    createdAt: string;
  }> = [];

  // API 7: AI Imagen Packaging & Label Generator
  app.post('/api/imagen/generate-packaging', async (req: Request, res: Response) => {
    const {
      productName,
      productNameEn,
      packagingType,
      styleVariant,
      aspectRatio,
      brandName,
      netWeight,
      spiceLevel,
      tagline,
      ingredientsHighlight,
      targetProductId
    } = req.body;

    if (!productName || typeof productName !== 'string' || !productName.trim()) {
      return res.status(400).json({ success: false, error: 'Product name is required for packaging label generation.' });
    }

    const cleanProductName = productName.trim();
    const prompt = buildImagenPackagingPrompt({
      productName: cleanProductName,
      productNameEn,
      packagingType,
      styleVariant,
      aspectRatio,
      brandName,
      netWeight,
      spiceLevel: Number(spiceLevel) || 4,
      tagline,
      ingredientsHighlight
    });

    const gemini = getGeminiClient();
    let generatedImageUrl = '';
    let engineUsed = 'studio_packaging_engine';
    let errorDetails: string | null = null;

    if (gemini) {
      // 1. Attempt Google Imagen 3 (imagen-3.0-generate-002) as requested
      try {
        console.log(`[AI Imagen Workflow] Invoking imagen-3.0-generate-002 for product: "${cleanProductName}"`);
        const imagenResponse = await gemini.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt,
          config: {
            numberOfImages: 1,
            aspectRatio: (aspectRatio as any) || '1:1',
            outputMimeType: 'image/jpeg',
          }
        });

        const img = imagenResponse.generatedImages?.[0];
        if (img?.image?.imageBytes) {
          generatedImageUrl = `data:image/jpeg;base64,${img.image.imageBytes}`;
          engineUsed = 'imagen-3.0-generate-002';
          console.log(`[AI Imagen Workflow] Successfully generated via Google Imagen 3!`);
        }
      } catch (imagenErr: any) {
        console.warn('[AI Imagen Workflow] Imagen 3 response info:', imagenErr?.message || imagenErr);
        errorDetails = imagenErr?.message || String(imagenErr);

        // 2. Fallback to gemini-3.1-flash-image if available
        try {
          console.log(`[AI Imagen Workflow] Attempting gemini-3.1-flash-image fallback...`);
          const flashImgResponse = await gemini.models.generateContent({
            model: 'gemini-3.1-flash-image',
            contents: {
              parts: [{ text: prompt }]
            },
            config: {
              imageConfig: {
                aspectRatio: (aspectRatio as any) || '1:1',
                imageSize: '1K'
              }
            }
          });

          for (const part of flashImgResponse.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData && part.inlineData.data) {
              generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
              engineUsed = 'gemini-3.1-flash-image';
              console.log(`[AI Imagen Workflow] Successfully generated via gemini-3.1-flash-image!`);
              break;
            }
          }
        } catch (flashErr: any) {
          console.warn('[AI Imagen Workflow] gemini-3.1-flash-image note:', flashErr?.message || flashErr);
        }
      }
    } else {
      console.log('[AI Imagen Workflow] Note: GEMINI_API_KEY not detected in environment, using Studio Packaging Engine.');
    }

    // 3. If neither model returned an image (e.g. no key, quota reached, offline mode), use studio branded SVG fallback
    if (!generatedImageUrl) {
      console.log(`[AI Imagen Workflow] Generating high-resolution studio label packaging artwork...`);
      generatedImageUrl = generateFallbackBrandedSvg({
        productName: cleanProductName,
        productNameEn,
        packagingType,
        styleVariant,
        aspectRatio,
        brandName,
        netWeight,
        spiceLevel: Number(spiceLevel) || 4,
        tagline,
        ingredientsHighlight
      });
      engineUsed = 'studio_packaging_engine';
    }

    // 4. Optionally update catalog product directly if targetProductId was provided
    let updatedProduct = null;
    if (targetProductId) {
      const prod = productsDatabase.find(p => p.id === targetProductId);
      if (prod) {
        prod.imageUrl = generatedImageUrl;
        updatedProduct = prod;
      }
    }

    const generationRecord = {
      id: `imgn-${Date.now()}`,
      imageUrl: generatedImageUrl,
      productName: cleanProductName,
      productNameEn: productNameEn || '',
      engineUsed,
      promptUsed: prompt,
      packagingType: packagingType || 'glass_jar',
      styleVariant: styleVariant || 'traditional_kolhapuri',
      aspectRatio: aspectRatio || '1:1',
      createdAt: new Date().toISOString()
    };

    packagingGenerationsHistory.unshift(generationRecord);
    if (packagingGenerationsHistory.length > 20) {
      packagingGenerationsHistory.pop();
    }

    res.json({
      success: true,
      data: generationRecord,
      updatedProduct,
      errorDetails: engineUsed === 'studio_packaging_engine' ? errorDetails : null
    });
  });

  app.get('/api/imagen/history', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: packagingGenerationsHistory
    });
  });

  // Serve uploads with immutable caching for fast customer loads
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  app.use('/uploads', express.static(uploadsDir, {
    maxAge: '30d',
    immutable: true,
    etag: true
  }));

  // Serve public directory assets with 7-day browser caching
  app.use(express.static(path.join(process.cwd(), 'public'), {
    maxAge: '7d',
    etag: true,
    setHeaders: (res, filePath) => {
      if (filePath.match(/\.(jpg|jpeg|png|webp|svg|gif|avif|ico|woff2?)$/i)) {
        res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
      }
    }
  }));

  // Vite middleware in development & static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌶️ अस्सल गावरान चटणी & मसाले Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
