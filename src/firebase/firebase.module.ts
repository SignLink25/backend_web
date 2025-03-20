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
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC22ydvtHriie23\nr504KYFLVwAHvUrFDSTbexcHr45F/u4o74VelTWxQqHntaqT7dRKIJ03XL1efQtH\n7/H6sjmzYzO8tLrPFx98uzTq8/zh0SIwvf1LiG0iZoERg7XUa7kza8emz6C7R56F\nu1JYk5ScVSd965l5c9HXHSkpxhLy8FzAsK2SgCFONTqBvy/WXE75AT8ivteGAXmA\n5du1NmoYev0/acofLHT/aJbcGWiOQRnc67QAdob5QQFpNIeC+XscWeMqRn7KnG5n\nEIkRbPVkrKwPECG9VnHrs2AaFZDMHlFoGc3BtvZve0G7X+dvmCgMb+aThLbratn0\nV37PRrR/AgMBAAECggEASH/3EGa2LFj0rFZQV0K5lWYOyILIgP2XpgAVXwI/vkf4\nJLnnHtu5OKmLKSRR2Co9eBCbVSaLnMmmbeTYhAYjM5l7G3Bq+w4XeWx+bEPF+cDi\nNgI2Sjryzmdm+EtJDkqR2S38MIr1Fxwr4akmWqFVFHD84gPGS63cvtY8imgS/kgc\nY7PDxXOtFKEwl0gbI98gadQlsT9VtnuQIcoRkAgmr6D4vSSIb+jX3MSNk1O3d+BA\nnh0N1tYatoeihGWha4JRGBKzfUro4HEOxrRqdpDo6WHA+oiqXXdrHNSvRE5Ez82V\nhQvq90xtcKssG3qbE7niVTzDSdDAMb820JcMJm1edQKBgQDZ4JDdd5Yt5VNR1dVV\nkx0SpvRLW8QFitZISQKoeqYgPWcKtwV+H11TZEzQErWPBL3+4dsPu5RxQSjKjAOQ\n072cX5riDIF9oC0EDSe1P/72PrOKxbJb3iRtIo7M/l4WfeEvVZoiw/o1q0byL9zd\nov3BHfg+x7DFkfljsczD3EyxtQKBgQDW2eBmjaVrd+n6/d2aNHxtvl9/TDur7fHQ\nG7u9QTJlgziNzLK5IDRpkGKp0+yE4zt8c/yyW8onXiHebAyTsycTi5Ti5nJMz6O7\ng7l6F0bhIZonJpAGMcb3PdyhFqC2p0wXGIdcvAAuzsT/8u5xzIPNCqm34P1bDUNo\ndYwWZVk94wKBgCHG3q52y6Fx2+jj7Z7Gn8s0dsr3/vuc+ntaVj8oRHjbDA5tMTzM\nP/udoQrg26TAZ3QML5nQysKEB37fFe5t5QdJCwngRnLjUhc+stk2gqBKOCtbWrtD\nRQJmSR0ekheKjE56Rtr85t1LIESLhwIVMqGts76H1q/KYY9DESuMC5fBAoGAH3f0\nDTFL/EypAbEzRwXO/8f1dtC0oL8OPvwA6HxnJEUvAF3uA317D8ctHFDFAMXDjbvz\nVDBrkI6SCWDsCqof3BYCraUxMpzrD2kAvqgwIoNob7mPOMkLqmTuLs4ApiAk3fEi\nymti33g7lH2BfTuGRn78Uslqcm6j4+XrqdAYXR8CgYBnCNPUVNJ8Zv6UmUelxFMi\n/G0IHEUsldm4WI7Sa+XvZ0syOZ34GXgBAhNR97edyFKO6n0KzPhjOYrHqGuGLnHu\npSEtRnIUrKWitjK8ld3uRioN9lZwqQjET3o9fPWDE8AQ5I3bhfTg8jnu7sb+jA+t\nn1+dWsJfjPfksU1cMaOpGQ==\n-----END PRIVATE KEY-----',
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
