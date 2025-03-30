export class ApiError extends Error {
  constructor(stateCode, message, isOperational = true, stack = "") {
    super(message);
    this.stateCode = stateCode;
    this.isOperational = isOperational;
    this.stack = `${stateCode}`.startsWith("4") ? "Fail" : "Error";

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
