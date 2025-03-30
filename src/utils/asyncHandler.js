const asyncHandle = (handle) => async (req, res, next) => {
  try {
    await handle(req, res, next);
  } catch (error) {
    res.status(error.message || 500).json({
      success: true,
      message: error.message || "Server Error",
    });
  }
};

export default asyncHandle;
