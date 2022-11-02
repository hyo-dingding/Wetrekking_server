export interface IUser {
  user?: {
    email: string;
    password: string;
  };
}

export interface IContext {
  req: Request & IUser;
  res: Response;
}
