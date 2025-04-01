const httpStatus = require('http-status');
const { User } = require('../../models/user.model'); // Correct way

const { Order } = require('../../models/order.model');

const moment = require('moment');

// Get total customers, total orders, total revenue
const getDashboardSummary = async (req, res) => {
  try {
    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    // Total customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Total orders this month
    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Total revenue this month
    const totalRevenue = await Order.aggregate([
      {
        $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } },
      },
      {
        $unwind: '$items',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails',
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ['$items.quantity', '$productDetails.price'] },
          },
        },
      },
    ]);

    res.status(httpStatus.OK).json({
      totalCustomers,
      totalOrders,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

module.exports = { getDashboardSummary };
