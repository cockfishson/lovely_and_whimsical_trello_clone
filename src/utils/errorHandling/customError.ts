export class CustomError extends Error {
    statusCode: number;
    details: object;
    constructor(statusCode:number, message:string) {
      super(typeof message === "string" ? message : "");
      this.statusCode = statusCode;
      this.name = this.constructor.name;
      this.details = typeof message === "object" ? message : {};
      Error.captureStackTrace(this, this.constructor);
    }
  }
  