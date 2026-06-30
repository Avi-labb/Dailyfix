import pool from '../config/db.js';

const getAllBanners = async (req, res) => {
  try {
    const [banners] = await pool.query('SELECT * FROM banners WHERE active = true ORDER BY position');
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllBannersAdmin = async (req, res) => {
  try {
    const [banners] = await pool.query('SELECT * FROM banners ORDER BY position');
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createBanner = async (req, res) => {
  try {
    const { title, subtitle, image, link, position, active } = req.body;
    const [result] = await pool.query(
      'INSERT INTO banners (title, subtitle, image, link, position, active) VALUES (?, ?, ?, ?, ?, ?)',
      [title, subtitle, image, link, position || 0, active || true]
    );
    res.status(201).json({ message: 'Banner created', bannerId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { title, subtitle, image, link, position, active } = req.body;
    await pool.query(
      'UPDATE banners SET title=?, subtitle=?, image=?, link=?, position=?, active=? WHERE id=?',
      [title, subtitle, image, link, position, active, req.params.id]
    );
    res.json({ message: 'Banner updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    await pool.query('DELETE FROM banners WHERE id = ?', [req.params.id]);
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