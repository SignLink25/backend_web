import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  TYPE: string;
  PROJECT_ID: string;
  PRIVATE_KEY_ID: string;
  PRIVATE_KEY: string;
  CLIENT_EMAIL: string;
  CLIENT_ID: string;
  AUTH_URI: string;
  TOKEN_URI: string;
  AUTH_CERT_URL: string;
  CLIENT_CERT_URL: string;
  UNIVERSAL_DOMAIN: string;
  PORT: number;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_PORT: number;
}

const envsSchema = joi
  .object({
    TYPE: joi.string().required(),
    PROJECT_ID: joi.string().required(),
    PRIVATE_KEY_ID: joi.string().required(),
    PRIVATE_KEY: joi.string().required(),
    CLIENT_EMAIL: joi.string().required(),
    CLIENT_ID: joi.string().required(),
    AUTH_URI: joi.string().required(),
    TOKEN_URI: joi.string().required(),
    AUTH_CERT_URL: joi.string().required(),
    CLIENT_CERT_URL: joi.string().required(),
    UNIVERSAL_DOMAIN: joi.string().required(),
    PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  type: envVars.TYPE,
  projectId: envVars.PROJECT_ID,
  privateKeyId: envVars.PRIVATE_KEY_ID,
  privateKey: envVars.PRIVATE_KEY,
  clientEmail: envVars.CLIENT_EMAIL,
  clientId: envVars.CLIENT_ID,
  authUri: envVars.AUTH_URI,
  tokenUri: envVars.TOKEN_URI,
  authCertUrl: envVars.AUTH_CERT_URL,
  clientCertUrl: envVars.CLIENT_CERT_URL,
  universalDomain: envVars.UNIVERSAL_DOMAIN,
  port: envVars.PORT,
  db_host: envVars.DB_HOST,
  db_port: envVars.DB_PORT,
  db_user: envVars.DB_USER,
  db_password: envVars.DB_PASSWORD,
  db_name: envVars.DB_NAME,
};
