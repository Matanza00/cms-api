class ErrorHandler extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode?: number) {
    super(message);

    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    // Ensure the correct prototype chain is maintained
    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}

export default ErrorHandler;
