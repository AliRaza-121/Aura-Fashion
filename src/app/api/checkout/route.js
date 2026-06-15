import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import SiteContent from '@/models/SiteContent';
import { sendEmail } from '@/lib/sendEmail';
import { z } from 'zod';
import rateLimit from '@/lib/rateLimit';

const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().min(4, "Postal code is required"),
  }),
  cartItems: z.array(z.object({
    product: z.string(),
    title: z.string(),
    size: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    image: z.string().optional(),
  })).min(1, "Cart cannot be empty"),
  paymentMethod: z.string().optional(),
});

export async function POST(req) {
  try {
    const rateLimitResult = rateLimit(req, 10, 60000); // 10 requests per minute
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many checkout attempts. Please try again later.' }, { status: 429 });
    }

    await dbConnect();
    const rawBody = await req.json();
    
    // Validate request body
    const parseResult = checkoutSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid input data', details: parseResult.error.format() }, { status: 400 });
    }
    
    const { shippingAddress, cartItems, paymentMethod } = parseResult.data;

    // Secure Pricing Verification & Stock Check
    let calculatedItemsPrice = 0;
    const finalOrderItems = [];

    for (const item of cartItems) {
      let product = null;
      let isMock = false;

      if (item.product.startsWith('lookbook-item-') || item.product.startsWith('lookbook-bundle-') || item.product.startsWith('featured-item-') || item.product.startsWith('featured-bundle-') || item.product.startsWith('parallax-item-')) {
        isMock = true;
        const content = await SiteContent.findOne({ identifier: 'global_content' }).lean();
        if (content) {
          if (item.product === 'lookbook-item-1') product = { _id: item.product, title: content.lookbook?.item1Name || 'Lookbook Item', price: content.lookbook?.item1Price || 14500, stockQuantity: 999 };
          if (item.product === 'lookbook-item-2') product = { _id: item.product, title: content.lookbook?.item2Name || 'Lookbook Item', price: content.lookbook?.item2Price || 8000, stockQuantity: 999 };
          if (item.product === 'lookbook-item-3') product = { _id: item.product, title: content.lookbook?.item3Name || 'Lookbook Item', price: content.lookbook?.item3Price || 11200, stockQuantity: 999 };
          if (item.product === 'lookbook-bundle-1') product = { _id: item.product, title: `${content.lookbook?.shopHeading || 'The Autumn Edit'} Bundle`, price: (content.lookbook?.item1Price || 14500) + (content.lookbook?.item2Price || 8000) + (content.lookbook?.item3Price || 11200), stockQuantity: 999 };
          if (item.product === 'featured-item-1') product = { _id: item.product, title: content.featuredLook?.item1Name || 'Featured Item', price: content.featuredLook?.item1Price || 18000, stockQuantity: 999 };
          if (item.product === 'featured-item-2') product = { _id: item.product, title: content.featuredLook?.item2Name || 'Featured Item', price: content.featuredLook?.item2Price || 15000, stockQuantity: 999 };
          if (item.product === 'featured-item-3') product = { _id: item.product, title: content.featuredLook?.item3Name || 'Featured Item', price: content.featuredLook?.item3Price || 12000, stockQuantity: 999 };
          if (item.product === 'featured-bundle-1') product = { _id: item.product, title: `${content.featuredLook?.heading ? content.featuredLook.heading.replace(/\n/g, ' ') : 'Urban Nomad'} Bundle`, price: content.featuredLook?.bundlePrice || 45000, stockQuantity: 999 };
          if (item.product === 'parallax-item-1') product = { _id: item.product, title: content.parallaxCampaign?.productName || 'Alpine Puffer Coat', price: content.parallaxCampaign?.productPrice || 35000, stockQuantity: 999 };
        }
      } else {
        product = await Product.findById(item.product);
      }
      
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.title}` }, { status: 404 });
      }

      if (product.stockQuantity < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${item.title}. Available: ${product.stockQuantity}` }, { status: 400 });
      }

      calculatedItemsPrice += product.price * item.quantity;
      
      finalOrderItems.push({
        product: product._id,
        title: product.title || product.name,
        size: item.size,
        quantity: item.quantity,
        price: product.price, // Trust the DB price, not the client!
        image: item.image || product.images?.[0] || '/placeholder.png'
      });

      // Decrement Stock
      if (!isMock) {
        product.stockQuantity -= item.quantity;
        await product.save();
      }
    }

    const calculatedShippingPrice = calculatedItemsPrice > 15000 ? 0 : 500;
    const calculatedTotalPrice = calculatedItemsPrice + calculatedShippingPrice;

    // Create Order
    const order = await Order.create({
      orderItems: finalOrderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      itemsPrice: calculatedItemsPrice,
      shippingPrice: calculatedShippingPrice,
      totalPrice: calculatedTotalPrice,
      isPaid: false, // Since it's COD
      isDelivered: false
    });

    // Send Confirmation Email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0; color: #000; letter-spacing: 2px;">AURA</h1>
          <p style="color: #666; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Order Confirmation</p>
        </div>
        
        <p>Hi ${shippingAddress.fullName},</p>
        <p>Thank you for your order! We are processing it and will ship it out soon.</p>
        
        <h3 style="border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">Order Details (ID: ${order._id})</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          ${finalOrderItems.map(item => `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                <strong>${item.title}</strong> (Size: ${item.size}) x ${item.quantity}
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">
                Rs ${(item.price * item.quantity).toLocaleString()}
              </td>
            </tr>
          `).join('')}
        </table>
        
        <div style="text-align: right; margin-bottom: 20px;">
          <p style="margin: 5px 0;">Subtotal: Rs ${calculatedItemsPrice.toLocaleString()}</p>
          <p style="margin: 5px 0;">Shipping: ${calculatedShippingPrice === 0 ? 'Free' : 'Rs ' + calculatedShippingPrice.toLocaleString()}</p>
          <h3 style="margin: 10px 0;">Total: Rs ${calculatedTotalPrice.toLocaleString()}</h3>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px;">
          <h4 style="margin-top: 0;">Shipping Address</h4>
          <p style="margin: 0; color: #555;">
            ${shippingAddress.street}<br/>
            ${shippingAddress.city}, ${shippingAddress.postalCode}<br/>
            Phone: ${shippingAddress.phone}
          </p>
        </div>
      </div>
    `;

    // Try to send email, but don't fail the order if email fails
    try {
      await sendEmail({
        to: shippingAddress.email,
        subject: `Aura Order Confirmation - ${order._id}`,
        html: htmlContent
      });
    } catch (emailErr) {
      console.error('Failed to send order confirmation email:', emailErr);
    }

    return NextResponse.json({ success: true, orderId: order._id }, { status: 201 });
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
