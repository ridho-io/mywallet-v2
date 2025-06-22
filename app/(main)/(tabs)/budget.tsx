// app/(tabs)/budget.tsx
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BudgetCard from "../../../components/specific/BudgetCard"; // Gunakan komponen baru
import SetBudgetModal from "../../../components/specific/SetBudgetModal";
import { useAuth } from "../../../contexts/AuthContext";
import {
  Budget,
  getBudgetsForMonth,
  getTransactionsForMonth,
  Transaction,
} from "../../../lib/database";

type BudgetDisplayInfo = {
  category: string;
  budgetAmount: number;
  spentAmount: number;
};

export default function BudgetScreen() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [budgetInfo, setBudgetInfo] = useState<BudgetDisplayInfo[]>([]);

  // Logika asli: Mengambil data budget dan transaksi, lalu menggabungkannya
  const loadData = async () => {
    if (!session?.user) return;
    setLoading(true);

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // bulan di JS (0-11)

      // 1. Ambil semua budget untuk bulan ini
      const budgets: Budget[] = await getBudgetsForMonth(
        session.user.id,
        year,
        month
      );
      // 2. Ambil semua transaksi untuk bulan ini
      const transactions: Transaction[] = await getTransactionsForMonth(
        session.user.id,
        year,
        month
      );

      // 3. Gabungkan data di sisi client
      const spendingByCategory: { [key: string]: number } = {};
      transactions.forEach((tx) => {
        if (tx.type === "expense") {
          spendingByCategory[tx.category] =
            (spendingByCategory[tx.category] || 0) + tx.amount;
        }
      });

      const displayInfo: BudgetDisplayInfo[] = budgets.map((budget) => ({
        category: budget.category,
        budgetAmount: budget.amount,
        spentAmount: spendingByCategory[budget.category] || 0,
      }));

      setBudgetInfo(displayInfo);
    } catch (error: any) {
      Alert.alert("Error", error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [session])
  );

  const handleSuccess = () => {
    setModalVisible(false);
    loadData();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Monthly Budget</Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 50 }}
          size="large"
          color={Colors.light.tint}
        />
      ) : (
        <FlatList
          data={budgetInfo}
          keyExtractor={(item) => item.category}
          // Gunakan komponen BudgetCard baru
          renderItem={({ item }) => (
            <BudgetCard
              category={item.category}
              budgetAmount={item.budgetAmount}
              spentAmount={item.spentAmount}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>
                No budgets set for this month.
              </Text>
              <Text style={styles.emptyText}>Press '+' to start.</Text>
            </View>
          }
        />
      )}

      <SetBudgetModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={handleSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: Colors.light.text },
  addButton: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 20,
  },
  list: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: { color: Colors.light.icon, fontSize: 16 },
});
