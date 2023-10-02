export class ServerError extends Error {
    constructor(stack: string = `Internal Server Error`) {
      super(`Internal Server Error`);
      this.name = 'Server Error';
      this.stack = stack;
    }
  }
  