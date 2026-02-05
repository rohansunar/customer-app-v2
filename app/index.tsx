import { SplashScreen, useSplashNavigation } from '@/components/splash';

export default function AppEntry() {
  const { navigateBasedOnAuth } = useSplashNavigation();

  return <SplashScreen onFinish={navigateBasedOnAuth} />;
}
