import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileSetup() {
  const router = useRouter();
  const [ageGroup, setAgeGroup] = useState('');
  const [personalSituation, setPersonalSituation] = useState('');
  const [professionalStatus, setProfessionalStatus] = useState('');
  const [duration, setDuration] = useState('');
  const [mainConcerns, setMainConcerns] = useState('');

  const handleContinue = async () => {
    const userProfile = {
      ageGroup,
      personalSituation,
      professionalStatus,
      duration,
      mainConcerns,
    };
    
    await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
    router.push('/paywall');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.ibb.co/YB0t1LMB/DALL-E-2025-03-21-07-17-35-A-small-robot-icon-wearing-a-red-superhero-cape-The-robot-has-a-cute-comp.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Help Super Expat assist you better!</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age Group</Text>
          <View style={styles.optionsContainer}>
            {['18-24', '25-34', '35-44', '45-60', '60+'].map((age) => (
              <TouchableOpacity
                key={age}
                style={[
                  styles.option,
                  ageGroup === age && styles.selectedOption
                ]}
                onPress={() => setAgeGroup(age)}
              >
                <Text style={[
                  styles.optionText,
                  ageGroup === age && styles.selectedOptionText
                ]}>{age}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Situation</Text>
          <View style={styles.optionsContainer}>
            {['Single', 'Couple', 'Family'].map((situation) => (
              <TouchableOpacity
                key={situation}
                style={[
                  styles.option,
                  personalSituation === situation && styles.selectedOption
                ]}
                onPress={() => setPersonalSituation(situation)}
              >
                <Text style={[
                  styles.optionText,
                  personalSituation === situation && styles.selectedOptionText
                ]}>{situation}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Status</Text>
          <View style={styles.optionsContainer}>
            {['Student', 'Employed', 'Self-employed', 'Retired'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.option,
                  professionalStatus === status && styles.selectedOption
                ]}
                onPress={() => setProfessionalStatus(status)}
              >
                <Text style={[
                  styles.optionText,
                  professionalStatus === status && styles.selectedOptionText
                ]}>{status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planned Duration of Expatriation</Text>
          <View style={styles.optionsContainer}>
            {['Short-term', 'Long-term', 'Permanent'].map((term) => (
              <TouchableOpacity
                key={term}
                style={[
                  styles.option,
                  duration === term && styles.selectedOption
                ]}
                onPress={() => setDuration(term)}
              >
                <Text style={[
                  styles.optionText,
                  duration === term && styles.selectedOptionText
                ]}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    padding: 20,
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1A1A1A',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  optionText: {
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
  continueButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});