import { Platform } from 'react-native';

// Simple check to detect if we're running in Bolt environment
export function isBoltEnvironment() {
  return process.env.BOLT_ENV === 'true' || Platform.OS === 'web';
}