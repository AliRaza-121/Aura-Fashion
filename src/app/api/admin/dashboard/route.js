import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let startDate, endDate;
    let days = 7;

    if (startDateParam && endDateParam) {
      let tempStart = new Date(startDateParam);
      tempStart.setHours(0, 0, 0, 0);
      let tempEnd = new Date(endDateParam);
      tempEnd.setHours(23, 59, 59, 999);
      
      if (tempStart > tempEnd) {
        startDate = new Date(endDateParam);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDateParam);
        endDate.setHours(23, 59, 59, 999);
      } else {
        startDate = tempStart;
        endDate = tempEnd;
      }
      
      const diffTime = Math.abs(endDate - startDate);
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    } else {
      const daysParam = parseInt(searchParams.get('days')) || 7;
      days = daysParam > 0 ? daysParam : 7;
      endDate = new Date();
      startDate = new Date(endDate.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
      startDate.setHours(0, 0, 0, 0);
    }

    // Current dates
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Total active products
    const totalProducts = await Product.countDocuments();

    // 2. Best sellers and Out of stock alerts
    const bestSellers = await Product.find({ isBestSeller: true }).limit(5).lean();
    const outOfStockProducts = await Product.find({
      $or: [
        { stockQuantity: { $lte: 0 } },
        { inStock: false }
      ]
    }).select('_id title images stockQuantity').lean();

    // 3. Total orders & recent orders
    const totalOrders = await Order.countDocuments();
    const recentOrdersDb = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email').lean();

    const ordersThisMonth = await Order.countDocuments({ createdAt: { $gte: startOfThisMonth } });
    const ordersLastMonth = await Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } });
    let orderGrowth = 0;
    if (ordersLastMonth > 0) {
      orderGrowth = ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100;
    } else if (ordersThisMonth > 0) {
      orderGrowth = 100;
    }

    // Format recent orders for the frontend
    const recentOrders = recentOrdersDb.map(order => ({
      id: `#ORD-${order._id.toString().substring(18, 24).toUpperCase()}`,
      customer: order.shippingAddress?.fullName || order.user?.name || 'Guest User',
      date: order.createdAt,
      amount: order.totalPrice,
      status: order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Pending',
    }));

    // 4. Total revenue
    const revenueAggregation = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    const revenueThisMonthAggr = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfThisMonth } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const revenueLastMonthAggr = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    const revThisMonth = revenueThisMonthAggr.length > 0 ? revenueThisMonthAggr[0].total : 0;
    const revLastMonth = revenueLastMonthAggr.length > 0 ? revenueLastMonthAggr[0].total : 0;
    
    let revenueGrowth = 0;
    if (revLastMonth > 0) {
      revenueGrowth = ((revThisMonth - revLastMonth) / revLastMonth) * 100;
    } else if (revThisMonth > 0) {
      revenueGrowth = 100;
    }

    // 5. Total customers
    const totalCustomers = await User.countDocuments();
    const newCustomersThisWeek = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });

    // 6. Chart Data (Dynamic Days)
    const dailyRevenueAggr = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const chartMap = {};
    let periodRevenue = 0;

    for (let i = 0; i < days; i++) {
      const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      let label = d.toLocaleDateString('en-US', { weekday: 'short' });
      if (days > 14) {
        label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      chartMap[dateStr] = { date: label, revenue: 0 };
    }

    dailyRevenueAggr.forEach(day => {
      if (chartMap[day._id]) {
        chartMap[day._id].revenue = day.revenue;
        periodRevenue += day.revenue;
      }
    });

    const chartData = Object.values(chartMap);

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      periodRevenue,
      recentOrders,
      bestSellers,
      outOfStockProducts,
      revenueGrowth: revenueGrowth.toFixed(1),
      orderGrowth: orderGrowth.toFixed(1),
      newCustomersThisWeek,
      chartData,
      days
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
