// app/(auth)/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import AnimatedButton from '../../components/core/AnimatedButton';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password dan Konfirmasi Password tidak cocok.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    setLoading(false);
    if (error) {
      Alert.alert('Error Pendaftaran', error.message);
    } else if (data.session === null && data.user) {
      // Ini adalah kasus di mana konfirmasi email diaktifkan
      Alert.alert(
        'Pendaftaran Berhasil',
        'Silakan cek email Anda untuk verifikasi sebelum masuk.',
        [{ text: 'OK', onPress: () => router.push('/login') }]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Buat Akun Baru</Text>
      <Text style={styles.subtitle}>Mulai kelola keuangan Anda hari ini!</Text>

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
        <TextInput
          style={styles.input}
          placeholder="Konfirmasi Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <View style={{height: 20}}/>
        <AnimatedButton onPress={handleSignUp}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{loading ? 'Mendaftar...' : 'Daftar'}</Text>
            </View>
        </AnimatedButton>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Sudah punya akun? </Text>
        <Link href="/login" asChild>
            <Text style={styles.link}>Masuk di sini</Text>
        </Link>
      </View>
    </ScrollView>
  );
}


// Anda bisa membuat file style terpisah untuk auth agar tidak duplikasi
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