import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, SafeAreaView, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Send, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const getSuggestedQuestions = (category: any) => {
  if (category && category.suggestedQuestions) {
    return category.suggestedQuestions;
  }
  
  return [
    "What should I know about this topic?",
    "What are the main challenges?",
    "What are the best resources for more information?"
  ];
};

export default function Chat() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const profile = await AsyncStorage.getItem('userProfile');
    const country = await AsyncStorage.getItem('selectedCountry');
    const category = await AsyncStorage.getItem('selectedCategory');
    
    if (profile) setUserProfile(JSON.parse(profile));
    if (country) setSelectedCountry(JSON.parse(country));
    if (category) {
      const categoryData = JSON.parse(category);
      setSelectedCategory(categoryData);
      setSuggestedQuestions(getSuggestedQuestions(categoryData));
    }
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

  const sendMessage = async (text: string = message) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { text, sender: 'user' as const }];
    setMessages(newMessages);
    setMessage('');

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert expatriation assistant. The user is interested in ${selectedCategory?.label_en} in ${selectedCountry?.name}. 
                       Their profile: ${JSON.stringify(userProfile)}`
            },
            {
              role: 'user',
              content: text
            }
          ]
        })
      });

      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      
      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' }]);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://i.ibb.co/Tqrm5Cfq/a0d0d3a2-9152-4f0c-b868-e6183076cd3b.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>SuperExpat Assistant</Text>
          {selectedCountry && (
            <TouchableOpacity onPress={handleCountryPress}>
              <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBox,
                msg.sender === 'user' ? styles.userMessage : styles.botMessage
              ]}
            >
              {msg.sender === 'bot' && (
                <Image
                  source={{ uri: 'https://i.ibb.co/Tqrm5Cfq/a0d0d3a2-9152-4f0c-b868-e6183076cd3b.png' }}
                  style={styles.botAvatar}
                  resizeMode="contain"
                />
              )}
              <View style={[
                styles.messageContent,
                msg.sender === 'user' ? styles.userMessageContent : styles.botMessageContent
              ]}>
                <Text style={[
                  styles.messageText,
                  msg.sender === 'user' ? styles.userMessageText : styles.botMessageText
                ]}>{msg.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.suggestedQuestionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {suggestedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => sendMessage(question)}
              >
                <Text style={styles.suggestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={() => sendMessage()}
            disabled={!message.trim()}
          >
            <Send color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1A1A1A',
  },
  backButton: {
    padding: 8,
  },
  countryFlag: {
    fontSize: 24,
    marginLeft: 10,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  botAvatar: {
    width: 24,
    height: 24,
    marginRight: 8,
    marginBottom: 4,
  },
  messageContent: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userMessageContent: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
    marginLeft: 'auto',
  },
  botMessageContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#1A1A1A',
  },
  suggestedQuestionsContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  suggestionChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  suggestionText: {
    color: '#1A1A1A',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 12,
    paddingTop: 12,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
    color: '#1A1A1A',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});