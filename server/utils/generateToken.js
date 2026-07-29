import jwt from "jsonwebtoken";

const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;