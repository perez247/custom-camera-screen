import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cameracu.online',
  appName: 'camera',
  webDir: 'dist',
  server: {
    hostname: 'localhost',
    iosScheme: 'https',
    androidScheme: 'https'
  },
};

export default config;
