export class MissingParamError extends Error {
    constructor(paramName: string) {
      super(`Missing ${paramName}`);
      this.name = 'Misssing Param Error';
      this.stack = `Missing ${paramName}`
    }
  }
  