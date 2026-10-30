import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lifelens.ai',
  appName: 'LifeLens AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos'],
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1B4332',
      androidSplashResourceName: 'splash',
    },
  },
};

export default config;

