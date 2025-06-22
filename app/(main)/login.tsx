// app/(auth)/login.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import AnimatedButton from '@/components/core/AnimatedButton';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Login Error', error.message);
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Selamat Datang!</Text>
        <Text style={styles.subtitle}>Masuk untuk melanjutkan</Text>

        <View style={styles.form}>
            <TextInput
            style={styles.input}
            placeholder="Alamat Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            />
            <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />
            <View style={{height: 20}}/>
            <AnimatedButton onPress={handleLogin}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Masuk'}</Text>
                </View>
            </AnimatedButton>
        </View>

        {/* 2. Tambahkan Link ke halaman Register */}
        <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <Link href="/register" asChild>
                <Text style={styles.link}>Daftar di sini</Text>
            </Link>
        </View>
    </ScrollView>
  );
}

// Gunakan style yang sama dengan register.tsx
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F0F4F8',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1C1C1E',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#8E8E93',
        marginBottom: 40,
    },
    form: {
        width: '100%',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#8E8E93',
    },
    link: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: 'bold',
    },
});