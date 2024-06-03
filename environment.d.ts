declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_NAME: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      DB_PORT: string;
      SECRET: string;
      JWT_EXPIRE: string;
    }
  }
}

export {};
