import jwt from 'jsonwebtoken';
import jwtToken from '../../config/jwtSecret.js';

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        error: '🔴 No token is provided 🔴'
      });
    };

    //decode
    const decodedUser = jwt.verify(token, jwtToken.secretKey);

    //attach user
    req.user = decodedUser;
    next();
  } catch (error) {
    return res.status(400).json(
      {
        error: '🔴 Something went wrong 🔴',
        message: error.message
      }
    );
  };
};

