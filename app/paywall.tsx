import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Platform, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useRevenueCat } from '@/hooks/useRevenueCat';

export default function Paywall() {
  const router = useRouter();
  const [isFreeTrialEnabled, setIsFreeTrialEnabled] = useState(true);
  const { isReady, packages, fetchOfferings, purchasePackage, restorePurchases, isBoltEnvironment } = useRevenueCat();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isReady && !isBoltEnvironment) {
      fetchOfferings();
    }
  }, [isReady, isBoltEnvironment]);

  const handlePurchase = async () => {
    if (isBoltEnvironment) {
      router.replace('/categories');
      return;
    }

    setIsLoading(true);
    try {
      const selectedPackage = packages.find(pkg => 
        pkg.identifier === (isFreeTrialEnabled ? 'weekly_trial' : 'lifetime')
      );

      if (!selectedPackage) {
        throw new Error('Selected package not found');
      }

      await purchasePackage(selectedPackage);
      router.replace('/categories');
    } catch (error) {
      console.error('Purchase error:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (isBoltEnvironment) return;

    setIsLoading(true);
    try {
      const restoredInfo = await restorePurchases();
      if (restoredInfo?.entitlements.active['pro']) {
        router.replace('/categories');
      }
    } catch (error) {
      console.error('Restore error:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://i.ibb.co/Tqrm5Cfq/a0d0d3a2-9152-4f0c-b868-e6183076cd3b.png' }}
            style={styles.robotImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Ready to go SuperExpat PRO?</Text>
        <Text style={styles.subtitle}>
          {isBoltEnvironment 
            ? 'Demo Mode - No payment required'
            : 'No commitment, cancel anytime'}
        </Text>

        <View style={styles.planCard}>
          <Text style={styles.planTitle}>SuperExpat Pro</Text>
          <Text style={styles.planFeatures}>
            Effortless expatriation, Instant answers, Extended messages, Unlimited chats, Full access
          </Text>
          {!isBoltEnvironment && (
            <Text style={styles.pricing}>
              {isFreeTrialEnabled 
                ? 'Free for 3 days, then €4.99/week'
                : 'One-time payment, €44.99'}
            </Text>
          )}
        </View>

        {!isBoltEnvironment && (
          <View style={styles.trialToggleContainer}>
            <Text style={styles.trialText}>
              {isFreeTrialEnabled ? 'Free Trial Activated' : 'Activate Free Trial'}
            </Text>
            <Switch
              value={isFreeTrialEnabled}
              onValueChange={setIsFreeTrialEnabled}
              trackColor={{ false: '#767577', true: '#34C759' }}
              thumbColor="#fff"
            />
          </View>
        )}

        {!isBoltEnvironment && isFreeTrialEnabled && (
          <View style={styles.timeline}>
            <Text style={styles.timelineText}>Starting today</Text>
            <View style={styles.timelineDetails}>
              <Text style={styles.timelineFree}>3 days free</Text>
              <Text style={styles.timelinePrice}>€0.00</Text>
            </View>
            <View style={styles.timelineDetails}>
              <Text style={styles.timelineDate}>Due March 24, 2025</Text>
              <Text style={styles.timelinePrice}>€4.99</Text>
            </View>
          </View>
        )}

        {!isBoltEnvironment && !isFreeTrialEnabled && (
          <View style={styles.lifetimeOffer}>
            <View style={styles.saveTag}>
              <Text style={styles.saveText}>Save 76%</Text>
            </View>
            <Text style={styles.lifetimeText}>Lifetime access</Text>
            <Text style={styles.lifetimePrice}>€44.99</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
          onPress={handlePurchase}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>
              {isBoltEnvironment 
                ? 'Continue to Demo'
                : (isFreeTrialEnabled ? 'Start Free Trial' : 'Get Started')}
            </Text>
          )}
        </TouchableOpacity>

        {!isBoltEnvironment && (
          <TouchableOpacity 
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={isLoading}
          >
            <Text style={styles.restoreButtonText}>Restore Purchase</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Terms</Text>
          <View style={styles.secureContainer}>
            <Image
              source={{ uri: 'https://i.ibb.co/M6pKqFR/apple.png' }}
              style={styles.appleIcon}
              resizeMode="contain"
            />
            <Text style={styles.footerText}>Secured by Apple</Text>
          </View>
          <Text style={styles.footerText}>Privacy</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginVertical: 10,
  },
  robotImage: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#2a2a40',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  planFeatures: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 8,
  },
  pricing: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  trialToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a40',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  trialText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  timeline: {
    marginBottom: 16,
  },
  timelineText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  timelineDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timelineFree: {
    color: '#34C759',
    fontSize: 14,
  },
  timelineDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  timelinePrice: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  lifetimeOffer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  saveTag: {
    backgroundColor: '#34C759',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 6,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  lifetimeText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
  },
  lifetimePrice: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#4A4AFF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  restoreButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButtonText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  secureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appleIcon: {
    width: 14,
    height: 14,
    tintColor: 'rgba(255, 255, 255, 0.5)',
  },
});