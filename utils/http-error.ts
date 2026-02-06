// create a global error HttpError
class HttpError extends Error {
  public code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

export default HttpError;
