const Report = require('../models/report.model');

// @route   GET /api/reports/revenue
// @desc    Get daily and monthly revenue report for the logged-in barber
// @access  Private (Barbers only)
exports.getRevenueReport = async (req, res) => {
  try {
    const barberId = req.user.id;

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const [dailyStats, monthlyStats] = await Promise.all([
      Report.getRevenueStats(barberId, startOfToday, endOfToday),
      Report.getRevenueStats(barberId, startOfMonth, endOfMonth)
    ]);

    res.json({
      daily: dailyStats,
      monthly: monthlyStats,
    });
  } catch (error) {
    console.error('Ciro raporu getirme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   GET /api/reports/monthly-summary
// @desc    Get monthly revenue summary for the last 12 months
// @access  Private (Barbers only)
exports.getMonthlySummary = async (req, res) => {
    try {
        const barberId = req.user.id;
        const monthlyData = await Report.getMonthlyRevenue(barberId);
        res.json(monthlyData);
    } catch (error) {
        console.error('Aylık ciro özeti getirme hatası:', error);
        res.status(500).send('Sunucu Hatası');
    }
};