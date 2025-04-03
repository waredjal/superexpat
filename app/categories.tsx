import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = {
  "categories": [
    {
      "key": "everything",
      "label_en": "Everything",
      "icon": "🌍",
      "suggestedQuestions": [
        "Tell me everything I need to know about moving here",
        "What are the main challenges I should prepare for?",
        "What's the first thing I should do after arriving?"
      ]
    },
    {
      "key": "cost_of_living",
      "label_en": "Cost of Living",
      "icon": "💰",
      "suggestedQuestions": [
        "What's the average monthly cost for a family?",
        "How much should I budget for housing?",
        "What are typical utility costs?"
      ]
    },
    {
      "key": "climate",
      "label_en": "Climate",
      "icon": "☀️",
      "suggestedQuestions": [
        "What's the weather like throughout the year?",
        "When is the best time to visit?",
        "How severe are the seasons?"
      ]
    },
    {
      "key": "internet_quality",
      "label_en": "Internet Quality",
      "icon": "🌐",
      "suggestedQuestions": [
        "What's the average internet speed?",
        "Which are the best internet providers?",
        "How much does good internet cost?"
      ]
    },
    {
      "key": "safety",
      "label_en": "Safety",
      "icon": "🛡️",
      "suggestedQuestions": [
        "Which are the safest neighborhoods?",
        "How's the crime rate in different areas?",
        "What safety precautions should I take?"
      ]
    },
    {
      "key": "visa_administration",
      "label_en": "Visa / Administration",
      "icon": "📝",
      "suggestedQuestions": [
        "What type of visa do I need?",
        "How long does the visa process take?",
        "What documents are required?"
      ]
    },
    {
      "key": "schooling",
      "label_en": "Schooling",
      "icon": "🎓",
      "suggestedQuestions": [
        "What are the best international schools?",
        "How does the local education system work?",
        "What are the school fees like?"
      ]
    },
    {
      "key": "health",
      "label_en": "Health",
      "icon": "🏥",
      "suggestedQuestions": [
        "How does the healthcare system work?",
        "What insurance do I need?",
        "Where are the best hospitals?"
      ]
    },
    {
      "key": "taxes",
      "label_en": "Taxes & Fiscality",
      "icon": "📊",
      "suggestedQuestions": [
        "What's the tax system like?",
        "Do I need to pay taxes in both countries?",
        "Are there any tax benefits for expats?"
      ]
    },
    {
      "key": "employment",
      "label_en": "Employment",
      "icon": "💼",
      "suggestedQuestions": [
        "How's the job market for expats?",
        "What's the average salary in my field?",
        "Do I need a work permit?"
      ]
    },
    {
      "key": "housing_availability",
      "label_en": "Housing",
      "icon": "🏠",
      "suggestedQuestions": [
        "What are the best areas to live in?",
        "How does the rental process work?",
        "What documents do I need to rent?"
      ]
    }
  ]
};

export default function Categories() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = React.useState<any>(null);

  React.useEffect(() => {
    loadCountry();
  }, []);

  const loadCountry = async () => {
    const country = await AsyncStorage.getItem('selectedCountry');
    if (country) {
      setSelectedCountry(JSON.parse(country));
    }
  };

  const handleCategorySelect = async (category: any) => {
    await AsyncStorage.setItem('selectedCategory', JSON.stringify(category));
    router.push('/chat');
  };

  const handleCountryPress = () => {
    Alert.alert(
      'Switch Country',
      'Would you like to switch to a different country?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => router.push('/country-selection')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.ibb.co/Tqrm5Cfq/a0d0d3a2-9152-4f0c-b868-e6183076cd3b.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>What would you like to know?</Text>
          <Text style={styles.subtitle}>Select a category to start chatting with me</Text>
        </View>
        {selectedCountry && (
          <TouchableOpacity onPress={handleCountryPress}>
            <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesGrid}>
          {categories.categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={styles.categoryCard}
              onPress={() => handleCategorySelect(category)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryTitle}>{category.label_en}</Text>
              {category.key === 'everything' && (
                <Text style={styles.categoryDescription}>Get comprehensive information about all aspects</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  headerTextContainer: {
    flex: 1,
  },
  countryFlag: {
    fontSize: 24,
    marginLeft: 15,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    paddingBottom: 20,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});