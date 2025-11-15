export class AppError extends Error {
  public details?: any;

  constructor(
    public statusCode: number,
    message: string,
    detailsOrOperational?: any,
    public isOperational = true
  ) {
    super(message);

    // Handle the case where third parameter is boolean (old API)
    if (typeof detailsOrOperational === 'boolean') {
      this.isOperational = detailsOrOperational;
    } else if (detailsOrOperational !== undefined) {
      // Third parameter is details
      this.details = detailsOrOperational;
    }

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}
