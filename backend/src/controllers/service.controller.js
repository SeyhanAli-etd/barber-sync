const Service = require('../models/service.model');

// @route   POST /api/services
// @desc    Create a new service
// @access  Private (Barbers only)
exports.createService = async (req, res) => {
  try {
    const { name, price, duration_minutes } = req.body;
    const barber_id = req.user.id;

    if (!name || !price || !duration_minutes) {
      return res.status(400).json({ message: 'Hizmet adı, fiyatı ve süresi zorunludur.' });
    }

    const newService = await Service.create({
      barber_id,
      name,
      price,
      duration_minutes,
    });

    res.status(201).json(newService);
  } catch (error) {
    // Handle unique constraint violation (barber_id, name)
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Bu isimde bir hizmetiniz zaten mevcut.' });
    }
    console.error('Hizmet oluşturma hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   GET /api/services
// @desc    Get all services for the logged-in barber
// @access  Private (Barbers only)
exports.getMyServices = async (req, res) => {
  try {
    const barber_id = req.user.id;
    const services = await Service.findByBarberId(barber_id);
    res.json(services);
  } catch (error) {
    console.error('Hizmetleri getirme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   PUT /api/services/:id
// @desc    Update a service
// @access  Private (Barbers only)
exports.updateService = async (req, res) => {
  try {
    const { id: serviceId } = req.params;
    const { name, price, duration_minutes } = req.body;
    const barber_id = req.user.id;

    if (!name || !price || !duration_minutes) {
      return res.status(400).json({ message: 'Hizmet adı, fiyatı ve süresi zorunludur.' });
    }

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Hizmet bulunamadı.' });
    }

    // Check ownership
    if (service.barber_id !== barber_id) {
      return res.status(403).json({ message: 'Bu hizmeti düzenleme yetkiniz yok.' });
    }

    const updatedService = await Service.update(serviceId, { name, price, duration_minutes });
    res.json(updatedService);
  } catch (error) {
    if (error.code === '23505') {
        return res.status(409).json({ message: 'Bu isimde başka bir hizmetiniz zaten mevcut.' });
    }
    console.error('Hizmet güncelleme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   DELETE /api/services/:id
// @desc    Delete a service (soft delete)
// @access  Private (Barbers only)
exports.deleteService = async (req, res) => {
  try {
    const { id: serviceId } = req.params;
    const barber_id = req.user.id;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Hizmet bulunamadı.' });
    }

    if (service.barber_id !== barber_id) {
      return res.status(403).json({ message: 'Bu hizmeti silme yetkiniz yok.' });
    }

    await Service.remove(serviceId);
    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Hizmet silme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};