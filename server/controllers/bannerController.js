import Banner from '../models/Banner.js';

const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ position: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllBannersAdmin = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ position: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createBanner = async (req, res) => {
  try {
    const { title, subtitle, image, link, position, active } = req.body;
    const banner = new Banner({
      title,
      subtitle,
      image,
      link,
      position: position !== undefined ? position : 0,
      active: active !== undefined ? active : true
    });
    await banner.save();
    res.status(201).json({ message: 'Banner created', bannerId: banner._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { title, subtitle, image, link, position, active } = req.body;
    await Banner.findByIdAndUpdate(req.params.id, {
      title,
      subtitle,
      image,
      link,
      position,
      active
    });
    res.json({ message: 'Banner updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  getAllBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner
};
