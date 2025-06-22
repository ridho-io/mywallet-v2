// app/(tabs)/reports.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Financial Reports</Text>
        </View>
        
        {/* Placeholder untuk chart utama */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending Overview</Text>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="pie-chart-outline" size={60} color={Colors.light.icon} />
            <Text style={styles.placeholderText}>Monthly spending chart will be displayed here.</Text>
          </View>
        </View>
        
        {/* Placeholder untuk laporan lain */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Income vs Expense</Text>
           <View style={styles.chartPlaceholder}>
            <Ionicons name="analytics-outline" size={60} color={Colors.light.icon} />
            <Text style={styles.placeholderText}>Income vs Expense bar chart.</Text>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Category Breakdown</Text>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="list-outline" size={60} color={Colors.light.icon} />
            <Text style={styles.placeholderText}>List of spending by category.</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { padding: 20, paddingBottom: 100 },
  header: {
    paddingBottom: 10,
    marginBottom: 10
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
  },
  chartPlaceholder: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 15,
    gap: 10,
  },
  placeholderText: {
    color: Colors.light.icon,
    fontSize: 16,
    textAlign: 'center'
  },
});