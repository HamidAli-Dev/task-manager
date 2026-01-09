export const attachSocketIO = (io) => {
  return (req, res, next) => {
    req.io = io;
    next();
  };
};
