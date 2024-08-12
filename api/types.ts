export interface User {
    email: string;
    username: string;
    password: string;
    country: string;
    details: {
      accountNumber: string;
      balance: number;
    };
  }
  

  export interface AuthenticatedRequest {
    user?: {
      email: string;
      // Add other properties you store in the token, if any
    };
  }