// app/index.tsx
import React, {useRef} from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedButton from '@/components/core/AnimatedButton';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  const animation = useRef<LottieView>(null);

  return (
    <LinearGradient
      colors={['#4A90E2', '#50E3C2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <LottieView ref={animation} source={require('../assets/animations/welcome.json')} autoPlay loop style={styles.illustration} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Finance App</Text>
            <Text style={styles.subtitle}>
              Carrying out financial transactions with the best security.
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <AnimatedButton onPress={() => router.push('/login')}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Get started</Text>
            </View>
          </AnimatedButton>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  illustration: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 25,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
  },
});