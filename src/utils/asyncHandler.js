const asyncHandle = (handle) => async (req, res, next) => {
  try {
    await handle(req, res, next);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false, // Corrected to false for errors
      message: error.message || "Server Error",
    });
  }
};

export default asyncHandle;
