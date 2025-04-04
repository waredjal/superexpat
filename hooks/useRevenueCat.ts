import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { isBoltEnvironment } from './useEnvironment';
import Purchases from 'react-native-purchases';

// Define types for Purchases and related objects
interface CustomerInfo {
  entitlements: {
    active: Record<string, boolean>;
  };
}

interface PurchasesPackage {
  identifier: string;
}

interface Purchases {
  configure: (options: { apiKey: string }) => Promise<void>;
  getCustomerInfo: () => Promise<CustomerInfo>;
  getOfferings: () => Promise<{ current?: { availablePackages: PurchasesPackage[] } }>;
  purchasePackage: (packageToPurchase: PurchasesPackage) => Promise<{ customerInfo: CustomerInfo }>;
  restorePurchases: () => Promise<CustomerInfo>;
}

const REVENUECAT_API_KEY = Platform.select({
  ios: 'XXXX', // Replace with your actual RevenueCat iOS API key
  android: 'YOUR_ANDROID_API_KEY',
  default: '',
});

export function useRevenueCat() {
  const [isReady, setIsReady] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const isBolt = isBoltEnvironment();

  useEffect(() => {
    const initRevenueCat = async () => {
      if (isBolt) {
        setIsReady(true);
        return;
      }

      try {
        console.log("STARTING")
        await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
        console.log("PURCHASE")
        const info = await Purchases.getCustomerInfo();
        console.log({info})
        setCustomerInfo(info);
        setIsReady(true);
      } catch (error) {
        console.log({error})
        console.error('RevenueCat initialization error:', error);
        setIsReady(true); // Set ready even on error to allow fallback behavior
      }
    };

    initRevenueCat();
  }, [isBolt]);

  const fetchOfferings = async () => {
    if (isBolt || !Purchases) return [];

    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setPackages(offerings.current.availablePackages);
        return offerings.current.availablePackages;
      }
      return [];
    } catch (error) {
      console.error('Error fetching offerings:', error);
      return [];
    }
  };

  const purchasePackage = async (packageToPurchase: PurchasesPackage) => {
    if (isBolt || !Purchases) return null;

    try {
      const { customerInfo: updatedInfo } = await Purchases.purchasePackage(packageToPurchase);
      setCustomerInfo(updatedInfo);
      return updatedInfo;
    } catch (error) {
      console.error('Error making purchase:', error);
      throw error;
    }
  };

  const restorePurchases = async () => {
    if (isBolt || !Purchases) return null;

    try {
      const restoredInfo = await Purchases.restorePurchases();
      setCustomerInfo(restoredInfo);
      return restoredInfo;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  };

  return {
    isReady,
    customerInfo,
    packages,
    fetchOfferings,
    purchasePackage,
    restorePurchases,
    isBoltEnvironment: isBolt,
  };
}