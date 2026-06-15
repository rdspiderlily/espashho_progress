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

export default function TermsAndConditionsPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#042652" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
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
          Thanks for using our app. We're happy to have you here.
          By using ESPA-SHH-O, you agree to these terms. Please read them carefully.
        </Text>

        {/* Who Can Use */}
        <Text style={styles.sectionTitle}>Who Can Use ESPA-SHH-O</Text>
        <Text style={styles.paragraph}>
          ESPA-SHH-O is for anyone looking for great study spaces in Colon.
        </Text>
        <Text style={styles.bulletPoint}>• If you are 18 or older: You can use all features, including premium subscriptions.</Text>
        <Text style={styles.bulletPoint}>• If you are 13 to 17 years old: You can use the free version. Please ask a parent or guardian before using the app.</Text>
        <Text style={styles.bulletPoint}>• If you are under 13: Please do not use ESPA-SHH-O. This app is designed for older students.</Text>

        {/* Kids Under 13 */}
        <Text style={styles.sectionTitle}>Kids Under 13</Text>
        <Text style={styles.paragraph}>
          We care about kids' privacy. We do not collect information from children under 13. If we discover a user is under 13, we will close their account.
        </Text>

        {/* Your Account */}
        <Text style={styles.sectionTitle}>Your Account</Text>
        <Text style={styles.paragraph}>
          Please keep your password safe. You are responsible for what happens on your account.
          If you think someone else is using your account, let us know right away.
        </Text>

        {/* What You Can Share */}
        <Text style={styles.sectionTitle}>What You Can Share</Text>
        <Text style={styles.paragraph}>
          You own everything you post. You just give us permission to show it in the app.
        </Text>
        <Text style={styles.paragraph}>
          We do NOT store:
        </Text>
        <Text style={styles.bulletPoint}>• Audio files (only decibel numbers)</Text>
        <Text style={styles.bulletPoint}>• Your voice recordings</Text>

        {/* Flagging Reviews */}
        <Text style={styles.sectionTitle}>Flagging Reviews</Text>
        <Text style={styles.paragraph}>
          See a review that seems off? You can flag it.
          If a review gets 3 flags, the system hides it automatically.
        </Text>
        <Text style={styles.paragraph}>A few things to know:</Text>
        <Text style={styles.bulletPoint}>• You can flag a review once</Text>
        <Text style={styles.bulletPoint}>• One flag per review per user</Text>
        <Text style={styles.bulletPoint}>• You cannot flag your own review</Text>

        {/* Our Community Rules */}
        <Text style={styles.sectionTitle}>Our Community Rules</Text>
        <Text style={styles.paragraph}>Please be kind. Do not:</Text>
        <Text style={styles.bulletPoint}>• Post fake reviews or fake recordings</Text>
        <Text style={styles.bulletPoint}>• Pretend to be someone else</Text>
        <Text style={styles.bulletPoint}>• Post inappropriate photos</Text>
        <Text style={styles.paragraph}>
          If you own a business and post fake reviews about your own space, we will remove your account.
        </Text>

        {/* What Happens If You Break the Rules */}
        <Text style={styles.sectionTitle}>What Happens If You Break the Rules</Text>
        <Text style={styles.paragraph}>
          We want everyone to have a good experience. If you break the rules, we may need to suspend your account.
        </Text>

        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>What Happened</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>First Time</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Second Time</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Many reviews have been auto-hidden</Text>
            <Text style={styles.tableCell}>3 day break</Text>
            <Text style={styles.tableCell}>14 day break</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Inappropriate photo</Text>
            <Text style={styles.tableCell}>7 day break</Text>
            <Text style={styles.tableCell}>Permanent removal</Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          During a break, you cannot use the app. Your subscriptions will be paused.
        </Text>

        {/* Payments */}
        <Text style={styles.sectionTitle}>Payments</Text>
        <Text style={styles.paragraph}>
          Business spaces need a subscription. You can cancel anytime in your account settings.
        </Text>

        {/* Changes to These Terms */}
        <Text style={styles.sectionTitle}>Changes to These Terms</Text>
        <Text style={styles.paragraph}>
          We may update these terms once in a while. We will let you know in the app when we do.
        </Text>

        {/* A Few Legal Things */}
        <Text style={styles.sectionTitle}>A Few Legal Things</Text>
        <Text style={styles.paragraph}>
          We try hard to keep the app running smoothly, but we cannot promise it will never have issues.
          We do not check if recordings or documents are real. Please be careful when visiting spaces.
        </Text>

        {/* What We Are Not Responsible For */}
        <Text style={styles.sectionTitle}>What We Are Not Responsible For</Text>
        <Text style={styles.paragraph}>
          We are not responsible for:
        </Text>
        <Text style={styles.bulletPoint}>• What other users review</Text>
        <Text style={styles.bulletPoint}>• Your safety when you visit spaces</Text>
        <Text style={styles.bulletPoint}>• You visit spaces at your own risk</Text>

        {/* Philippine Law */}
        <Text style={styles.sectionTitle}>Philippine Law</Text>
        <Text style={styles.paragraph}>
          These terms follow the laws of the Philippines. Any disputes will be handled in Cebu City.
        </Text>

        {/* Contact Us */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          Have questions? Email us at support@espa-shh-o.com. We usually reply within 2 days.
        </Text>

        {/* Thank You */}
        <Text style={styles.sectionTitle}>Thank You</Text>
        <Text style={styles.paragraph}>
          Thanks for being part of ESPA-SHH-O. Now go find your perfect study spot!
        </Text>

        {/* Spacer at bottom */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Agree Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.agreeButton}
          onPress={() => router.push("/registerOption")}
        >
          <Text style={styles.buttonText}>I Agree</Text>
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
  agreeButton: {
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