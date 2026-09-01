export interface Environment {
  production: boolean;
  baseUrl: string;
  auth0: {
    domainUrl: string;
    clientId: string;
    clientSecret: string;
  };
}
