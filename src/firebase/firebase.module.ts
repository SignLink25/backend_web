import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { envs } from '../config/envs';

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  useFactory: () => {
    const firebaseConfig = {
      type: envs.type,
      project_id: envs.projectId,
      private_key_id: envs.privateKeyId,
      private_key: envs.privateKey,
      client_email: envs.clientEmail,
      client_id: envs.clientId,
      auth_uri: envs.authUri,
      token_uri: envs.tokenUri,
      auth_provider_x509_cert_url: envs.authCertUrl,
      client_x509_cert_url: envs.clientCertUrl,
      universe_domain: envs.universalDomain,
    } as admin.ServiceAccount;

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
      storageBucket: `${firebaseConfig.projectId}.appspot.com`,
    });
  },
};

@Module({
  providers: [firebaseProvider],
  exports: [firebaseProvider],
})
export class FirebaseModule {}
