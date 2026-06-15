import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function DataPrivacyPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#042652" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Privacy Notice</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Last Updated */}
        <Text style={styles.lastUpdated}>Last Updated: April 25, 2026</Text>

        {/* Welcome Section */}
        <Text style={styles.sectionTitle}>Welcome to ESPA-SHH-O</Text>
        <Text style={styles.paragraph}>
          We value your privacy. This Data Privacy Notice explains how we collect, use, and protect your personal information when you use our app.
        </Text>

        {/* What We Collect */}
        <Text style={styles.sectionTitle}>What We Collect</Text>
        <Text style={styles.subSectionTitle}>You give us:</Text>
        <Text style={styles.bulletPoint}>• Your name, email, date of birth, gender, phone number</Text>
        <Text style={styles.bulletPoint}>• Your school (optional)</Text>
        <Text style={styles.bulletPoint}>• Profile picture (optional)</Text>
        <Text style={styles.bulletPoint}>• Student ID photo (optional)</Text>
        <Text style={styles.bulletPoint}>• Business permit photo (if you are a business owner)</Text>

        <Text style={styles.subSectionTitle}>We automatically collect:</Text>
        <Text style={styles.bulletPoint}>• Noise levels (just the number, not the audio)</Text>
        <Text style={styles.bulletPoint}>• Light levels (just the number)</Text>
        <Text style={styles.bulletPoint}>• Your rough location (to make sure you are really at the space)</Text>
        <Text style={styles.bulletPoint}>• How you use the app</Text>

        <Text style={styles.subSectionTitle}>We do NOT collect:</Text>
        <Text style={styles.bulletPoint}>• Audio files</Text>
        <Text style={styles.bulletPoint}>• Your home address</Text>
        <Text style={styles.bulletPoint}>• Your voice recordings</Text>

        {/* Why We Collect */}
        <Text style={styles.sectionTitle}>Why We Collect Your Data</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>What We Collect</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Why</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Name, email, date of birth, gender, phone number</Text>
            <Text style={styles.tableCell}>To create your account</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Noise and light data</Text>
            <Text style={styles.tableCell}>To help students find good study spots</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Your location</Text>
            <Text style={styles.tableCell}>To check that recordings are real</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Business permit</Text>
            <Text style={styles.tableCell}>For our records (we don't check if it's real)</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Student ID</Text>
            <Text style={styles.tableCell}>For our records (we don't check if it's real)</Text>
          </View>
        </View>

        {/* What We Share */}
        <Text style={styles.sectionTitle}>What We Share</Text>
        <Text style={styles.paragraph}>
          We share with:
        </Text>
        <Text style={styles.bulletPoint}>• Other users: Your reviews and ratings (not your email)</Text>
        <Text style={styles.bulletPoint}>• Business owners: Your reviews and recording values of their space</Text>
        <Text style={styles.bulletPoint}>• Maya and PayPal: Your payment info</Text>
        <Text style={styles.paragraph}>We never sell your information.</Text>

        {/* Your Choices */}
        <Text style={styles.sectionTitle}>Your Choices</Text>
        <Text style={styles.bulletPoint}>• You can delete your account anytime</Text>
        <Text style={styles.bulletPoint}>• You can turn off location (but then you cannot record)</Text>

        {/* Cookies & Third-Party Services */}
        <Text style={styles.sectionTitle}>Cookies & Third-Party Services</Text>
        <Text style={styles.paragraph}>
          We use essential cookies to keep you logged in. We do not use tracking cookies or analytics that share your data with advertisers.
        </Text>

        {/* How Long We Keep Your Data */}
        <Text style={styles.sectionTitle}>How Long We Keep Your Data</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>What</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>How Long</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Your account</Text>
            <Text style={styles.tableCell}>Until you delete it</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Your recordings</Text>
            <Text style={styles.tableCell}>As long as you have an account</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Your uploaded ID or permit or photos</Text>
            <Text style={styles.tableCell}>Deleted 30 days after you delete your account</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Payment records</Text>
            <Text style={styles.tableCell}>5 years (by law)</Text>
          </View>
        </View>

        {/* Your Rights (Philippines) */}
        <Text style={styles.sectionTitle}>Your Rights (Philippines)</Text>
        <Text style={styles.paragraph}>
          Under Philippine law, you can:
        </Text>
        <Text style={styles.bulletPoint}>• Ask what data we have about you</Text>
        <Text style={styles.bulletPoint}>• Fix wrong information</Text>
        <Text style={styles.bulletPoint}>• Ask us to delete your data</Text>
        <Text style={styles.paragraph}>
          To do any of these, email support@espa-shh-o.com
        </Text>

        {/* Kids */}
        <Text style={styles.sectionTitle}>Kids</Text>
        <Text style={styles.paragraph}>
          This app is for people 13 and older. We do not collect data from children under 13.
        </Text>

        {/* Changes */}
        <Text style={styles.sectionTitle}>Changes</Text>
        <Text style={styles.paragraph}>
          If we make big changes, we will tell you in the app.
        </Text>

        {/* Contact Us */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          Email: privacy@espa-shh-o.com
        </Text>

        {/* Spacer at bottom */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Accept Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => router.push("./terms-and-conditions")}
        >
          <Text style={styles.buttonText}>I Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F7FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#F0F7FF",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 18,
    color: "#042652",
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 100,
  },
  lastUpdated: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 20,
    color: "#042652",
    marginTop: 20,
    marginBottom: 10,
  },
  subSectionTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    color: "#042652",
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    marginBottom: 6,
    marginLeft: 10,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#0988EE",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#0988EE",
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#333",
  },
  tableHeader: {
    backgroundColor: "#0988EE",
    color: "#FFF",
    fontFamily: "Inter_700Bold",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F0F7FF",
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  acceptButton: {
    backgroundColor: "#0988EE",
    width: "100%",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
});