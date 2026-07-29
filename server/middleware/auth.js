import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

const authMiddleware = (req, res, next) => {
  try {
    let token = req.cookies.adminToken;

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;