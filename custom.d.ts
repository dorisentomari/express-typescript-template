declare namespace Express {
  export interface Request {
    $server?: {
      user?: object;
    };
  }
}
