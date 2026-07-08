const Report = require('../models/report.model');

// @route   GET /api/reports/revenue
// @desc    Get daily and monthly revenue reports for the logged-in barber
// @access  Private (Barbers only)
exports.getRevenueReport = async (req, res) => {
  try {
    const barberId = req.user.id;

    const now = new Date();

    // Günlük periyot: Bugünün başından yarının başına kadar
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // Aylık periyot: Bu ayın başından sonraki ayın başına kadar
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Her iki sorguyu paralel olarak çalıştır
    const [dailyStats, monthlyStats] = await Promise.all([
      Report.getRevenueStats(barberId, startOfDay, endOfDay),
      Report.getRevenueStats(barberId, startOfMonth, endOfMonth),
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