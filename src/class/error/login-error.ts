export class LoginError extends Error {
  constructor(stack: string = 'Login Error') {
    super('Error on login');
    this.name = 'Login Error';
    this.stack = stack;
  }
}
