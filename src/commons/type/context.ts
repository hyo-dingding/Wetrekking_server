export interface IUser {
  user?: {
    email: string;
    password: string;
    id: string;
    mountainId: string;
  };
}

export interface IContext {
  req: Request & IUser;
  res: Response;
}
