// app/(main)/(tabs)/home.tsx
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { getTransactionsForMonth, Transaction } from "../../../lib/database";

const TransactionItem = ({ item }: { item: Transaction }) => {
  // Simple logic for icons, can be expanded
  const getIconInfo = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("traveloka") || cat.includes("travel")) {
      return { name: "airplane", color: "#4A90E2" };
    }
    if (
      cat.includes("starbucks") ||
      cat.includes("food") ||
      cat.includes("makanan")
    ) {
      return { name: "cafe", color: "#00704A" };
    }
    return { name: "cash", color: Colors.light.icon };
  };

  const icon = getIconInfo(item.category);

  return (
    <View style={styles.transactionItem}>
      <View
        style={[
          styles.transactionIconContainer,
          { backgroundColor: `${icon.color}20` },
        ]}
      >
        <Ionicons name={icon.name as any} size={24} color={icon.color} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{item.category}</Text>
        <Text style={styles.transactionSubtitle}>
          {item.description || new Date(item.created_at!).toLocaleDateString()}
        </Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          {
            color:
              item.type === "income"
                ? Colors.light.success
                : Colors.light.danger,
          },
        ]}
      >
        {item.type === "income" ? "+" : "-"}
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(item.amount)}
      </Text>
    </View>
  );
};

export default function HomeScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  const balance = totalIncome - totalExpense;

  const loadDashboardData = async () => {
    if (!session?.user) return;

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      const monthlyTxs = await getTransactionsForMonth(
        session.user.id,
        year,
        month
      );

      if (monthlyTxs) {
        let income = 0;
        let expense = 0;

        monthlyTxs.forEach((tx) => {
          if (tx.type === "income") income += tx.amount;
          else expense += tx.amount;
        });

        setTotalIncome(income);
        setTotalExpense(expense);
        const sortedTxs = [...monthlyTxs].sort(
          (a, b) =>
            new Date(b.created_at!).getTime() -
            new Date(a.created_at!).getTime()
        );
        setRecentTransactions(sortedTxs.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadDashboardData().finally(() => setLoading(false));
    }, [session])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, [session]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.light.tint}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{
                uri: `https://i.pravatar.cc/150?u=${session?.user?.email}`,
              }}
              style={styles.avatar}
            />
            <Text style={styles.headerTitle}>
              Hi, {session?.user?.email?.split("@")[0] || "User"}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Ionicons
              name="search-outline"
              size={28}
              color={Colors.light.text}
            />
          </View>
        </View>

        {/* Balance Card */}
        <View style={[styles.card, styles.balanceCard]}>
          <Text style={styles.balanceLabel}>Your balance</Text>
          <Text style={styles.balanceAmount}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(balance)}
          </Text>
        </View>

        {/* Reports Card Placeholder */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Reports</Text>
            <Pressable onPress={() => router.push("/(main)/(tabs)/budget")}>
              <Text style={styles.seeAllText}>Details</Text>
            </Pressable>
          </View>
          <View style={styles.chartContainer}>
            <Ionicons
              name="bar-chart-outline"
              size={50}
              color={Colors.light.icon}
            />
            <Text style={styles.chartPlaceholderText}>
              Monthly chart will be here
            </Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Pressable onPress={() => router.push("/(main)/(tabs)/transactions")}>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => (
              <TransactionItem key={tx.id} item={tx} />
            ))
          ) : (
            <View style={styles.card}>
              <Text style={styles.emptyText}>No transactions this month.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles have been updated to match the new design
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { padding: 20, paddingBottom: 100 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  balanceCard: {
    backgroundColor: Colors.light.tint,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.light.card,
    marginTop: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  seeAllText: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: "600",
  },
  chartContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  chartPlaceholderText: {
    color: Colors.light.icon,
    fontSize: 16,
  },
  transactionsSection: {
    marginTop: 10,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.background,
  },
  transactionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  transactionSubtitle: {
    fontSize: 14,
    color: Colors.light.icon,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: Colors.light.icon,
    padding: 20,
  },
});
