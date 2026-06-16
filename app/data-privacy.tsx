import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Section {
  title: string;
  body: string;
  list: string[];
}

interface TableRow {
  label: string;
  value: string;
}

interface ViolationRow {
  label: string;
  step1: string;
  step2: string;
}

interface PrivacyContent {
  lastUpdated: string;
  sections: Section[];
  tableHeader: string[];
  tableData: TableRow[];
  retentionHeader: string[];
  retentionData: TableRow[];
}

interface TermsContent {
  lastUpdated: string;
  sections: Section[];
  violationHeader: string[];
  violationData: ViolationRow[];
  legalSections: Section[];
  contactInfo: string;
}

const PRIVACY_CONTENT: PrivacyContent = {
  lastUpdated: "Last Updated: April 25, 2026",
  sections: [
    {
      title: "1. Scope and Overview",
      body: "This Data Privacy Policy governs the collection, processing, and management of personal data acquired through the ESPA-SHH-O application ecosystem. We are committed to maintaining strict regulatory adherence regarding user privacy.",
      list: []
    },
    {
      title: "2. Data Explicitly Provided by the User",
      body: "During the user onboarding and account configuration procedures, the following data categories are required or optionally requested:",
      list: [
        "Account Credentials: Full name, verified email address, date of birth, gender orientation, and contact phone number.",
        "Academic Information: Current institutional enrollment name (Optional status).",
        "Profile Identification: User profile imagery and student identification documentation photographs (Optional status).",
        "Commercial Verification: State business permit documentation imagery (Mandatory exclusively for study space operators)."
      ]
    },
    {
      title: "3. Automated Data Collection Mechanism",
      body: "To facilitate platform telemetry, the system programmatically tracks and archives specific real-time ambient metrics:",
      list: [
        "Acoustic Telemetry: Ambient noise decibel levels are converted directly into numerical data. Raw audio streams are never captured, processed, or permanently stored.",
        "Luminosity Telemetry: Relative ambient lighting values are generated utilizing device hardware lux sensors.",
        "Geographic Location Matrix: Approximate spatial coordinate data is cross-referenced solely to validate physical presence inside a designated workspace.",
        "Diagnostic Analytics: Anonymous application interaction logging to optimize structural stability and user experience paths."
      ]
    },
    {
      title: "4. Explicit Data Collection Restrictions",
      body: "To uphold user confidentiality, the application infrastructure enforces zero-retention parameters on the following datasets:",
      list: [
        "Permanent audio waveforms, vocal audio fragments, or conversational recordings.",
        "Residential physical home address coordinates or private geographic landmarks."
      ]
    },
    {
      title: "5. Information Sharing and Dissemination Protocol",
      body: "User information is distributed exclusively under strict access configurations to maintain workspace integrity:",
      list: [
        "Public Application Interface: User reviews, operational space ratings, and public text descriptions are accessible to general platform users (Email records are hidden).",
        "Registered Workspace Operators: Space managers receive access to user feedback alongside numerical decibel and light logs captured on-site.",
        "Financial Gateways: Payment transaction parameters are managed via secure end-to-end processing with Maya and PayPal networks."
      ]
    },
    {
      title: "6. Regulatory Rights and Administrative Choices",
      body: "Pursuant to the Republic of the Philippines Data Privacy Act, users hold comprehensive administrative dominion over their files:",
      list: [
        "Account Termination: Users can trigger a permanent erasure sequence of their complete profile record from the database architecture.",
        "Hardware Authorization Toggles: Location and sensor services can be disabled within device parameters, which deactivates physical sensor reporting modules.",
        "Information Access Requests: Users retain the right to query accurate summaries of their active data footprints by reaching out to privacy@espa-shh-o.com."
      ]
    },
    {
      title: "7. Cookie Utilization and Minor Restrictions",
      body: "The platform restricts cookie usage to essential authentication tokens intended to maintain active user session validation. Third-party ad-tracking networks and data aggregation networks are blocked. Furthermore, the platform does not knowingly collect or manage profiles for individuals below the age of 13.",
      list: []
    }
  ],
  tableHeader: ["Data Class", "System Operational Purpose"],
  tableData: [
    { label: "Profile Information", value: "To establish unique identity records, manage security configurations, and maintain session verification." },
    { label: "Telemetry Metrics", value: "To feed live, quantitative sound and illumination data to the public workspace directory." },
    { label: "Location Parameters", value: "To validate presence thresholds, prevent fraudulent reporting, and verify metric origins." },
    { label: "Corporate Records", value: "To screen, confirm, and catalog administrative records for student or operator verification." }
  ],
  retentionHeader: ["Data Classification", "Statutory Retention Period"],
  retentionData: [
    { label: "Account Profile Metadata", value: "Retained continuously throughout the active lifespan of the user profile record." },
    { label: "Workspace Metric Logs", value: "Preserved inside tracking files for as long as the parent account remains open." },
    { label: "Verification Documents", value: "Systematically scrubbed from cloud file structures 30 days after account deletion." },
    { label: "Financial Records", value: "Maintained for a mandatory 5-year duration in compliance with national fiscal tracking laws." }
  ]
};

const TERMS_CONTENT: TermsContent = {
  lastUpdated: "Last Updated: April 25, 2026",
  sections: [
    {
      title: "1. Acceptance of Terms and Conditions",
      body: "By registering an account, interacting with the system interface, or accessing database materials hosted on ESPA-SHH-O, you signify an irrevocable agreement to remain bound by these terms, governing laws, and active corporate guidelines.",
      list: []
    },
    {
      title: "2. Age Eligibility Standards",
      body: "Platform access criteria are regulated strictly across explicit biological age cohorts:",
      list: [
        "Adult Cohort (Ages 18 and older): Full access privileges across all modules, including workspace registration and subscription plans.",
        "Minor Cohort (Ages 13 to 17): Limited access parameters confined to the free application tier. Explicit parental or legal guardian oversight is mandatory.",
        "Underage Classification (Below Age 13): Strictly banned from account registration. Identified records will be deactivated immediately."
      ]
    },
    {
      title: "3. Account Security and Maintenance Obligations",
      body: "Account owners bear exclusive liability for maintaining the confidentiality of their authentication factors. Any system events executing under your access codes fall under your legal jurisdiction. Unauthorized system breaches must be reported to the security support desk instantly.",
      list: []
    },
    {
      title: "4. Intellectual Ownership of User Content",
      body: "Users preserve complete intellectual ownership rights over text reviews and uploaded images. By submitting content, you grant the platform an unrestricted, worldwide, royalty-free license to host, display, and analyze your entries publicly.",
      list: []
    },
    {
      title: "5. Crowdsourced Moderation and Flagging Protocols",
      body: "To protect community integrity, an automated content monitoring framework runs continuously across user feedback modules:",
      list: [
        "Automatic Suppression Limit: Submissions collecting 3 flags from separate users are automatically isolated and hidden from public screens.",
        "Flagging Constraints: A user can submit exactly 1 flag per unique entry. Users are blocked from flagging their own content submissions."
      ]
    },
    {
      title: "6. Explicitly Prohibited Activities",
      body: "Engaging in any of the following infractions will prompt immediate corrective actions and account adjustments:",
      list: [
        "Fraudulent Reporting: Submitting artificial workspace ratings, false crowd descriptions, or distorted noise/lux telemetry.",
        "Identity Spoofing: Fabricating student status parameters or falsely projecting management rights over a commercial property.",
        "Illicit Media Sharing: Distributing graphic, non-academic, or copyright-infringing imagery inside the platform directories.",
        "Commercial Manipulation: Workspace owners are completely prohibited from fabricating self-promotional reviews or manipulating space visibility metrics falsely."
      ]
    }
  ],
  violationHeader: ["Guideline Infraction", "Initial Action Step", "Secondary Recourse Step"],
  violationData: [
    { label: "Excessive Flag Suppression History", step1: "3-Day Temporary Suspension", step2: "14-Day Temporary Suspension" },
    { label: "Prohibited Media and Image Uploads", step1: "7-Day Temporary Suspension", step2: "Permanent System Revocation" }
  ],
  legalSections: [
    {
      title: "7. Technical Liability Limitations",
      body: "Platform services are provided strictly on an 'as-is' operational basis. We do not independently audit the accuracy of student registration papers or local business permits. Users utilize physical workspaces at their own discretion and liability.",
      list: [
        "The platform assumes no legal liability for data text discrepancies or telemetry calculation lags.",
        "The platform provides no safety guarantees or security oversight regarding physical environments listed in the app."
      ]
    },
    {
      title: "8. Governing Law and Jurisdictional Selection",
      body: "These operational conditions are evaluated under the statutory legal guidelines of the Republic of the Philippines. Any structural disputes or official litigation arising from platform usage shall be adjudicated within the trial courts of Cebu City.",
      list: []
    }
  ],
  contactInfo: "Legal documentation requests, compliance questions, or technical clarifications can be sent to support@espa-shh-o.com. Inquiries are processed and answered within 2 standard business days."
};

export default function DataPrivacyPage() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");
  
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const [privacyScrolledToBottom, setPrivacyScrolledToBottom] = useState(false);
  const [termsScrolledToBottom, setTermsScrolledToBottom] = useState(false);

  const isBothAccepted = privacyChecked && termsChecked;

  const handleTabChange = (tab: "privacy" | "terms") => {
    setActiveTab(tab);
    // Reset scroll view position back to top when tabs are switched
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>, tab: "privacy" | "terms") => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 25;

    if (isCloseToBottom) {
      if (tab === "privacy") {
        setPrivacyScrolledToBottom(true);
      } else {
        setTermsScrolledToBottom(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.topSubtitle}>BEFORE YOU REGISTER</Text>
        <Text style={styles.headerTitle}>Privacy & Terms of Use</Text>
        <Text style={styles.headerDesc}>
          Please read and accept the following sections before creating your user account.
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "privacy" && styles.activeTabButton]}
          onPress={() => handleTabChange("privacy")}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={activeTab === "privacy" ? "#0988EE" : "#666"}
            style={styles.tabIcon}
          />
          <View style={styles.tabLabelRow}>
            <Text style={[styles.tabButtonText, activeTab === "privacy" && styles.activeTabButtonText]} numberOfLines={1}>
              Data Privacy
            </Text>
            {privacyChecked && <Ionicons name="checkmark-circle" size={13} color="#28A745" style={{ marginLeft: 3 }} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "terms" && styles.activeTabButton]}
          onPress={() => handleTabChange("terms")}
        >
          <Ionicons
            name="document-text-outline"
            size={20}
            color={activeTab === "terms" ? "#D9383A" : "#666"}
            style={styles.tabIcon}
          />
          <View style={styles.tabLabelRow}>
            <Text style={[styles.tabButtonText, activeTab === "terms" && styles.activeTabButtonText, activeTab === "terms" && { color: "#D9383A" }]} numberOfLines={1}>
              Terms & Conditions
            </Text>
            {termsChecked && <Ionicons name="checkmark-circle" size={13} color="#28A745" style={{ marginLeft: 3 }} />}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.contentWrapper}>
        {activeTab === "privacy" ? (
          <View style={{ flex: 1 }}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.contentSectionTitle}>DATA PRIVACY NOTICE</Text>
              {privacyChecked && (
                <View style={styles.readBadge}>
                  <Ionicons name="checkmark-circle-outline" size={14} color="#28A745" />
                  <Text style={styles.readText}> Read</Text>
                </View>
              )}
            </View>

            <ScrollView 
              ref={scrollViewRef}
              style={styles.textContentBox} 
              showsVerticalScrollIndicator={false}
              onScroll={(e) => handleScroll(e, "privacy")}
              scrollEventThrottle={16}
            >
              <Text style={styles.lastUpdated}>{PRIVACY_CONTENT.lastUpdated}</Text>
              
              {PRIVACY_CONTENT.sections.map((sec, sIdx) => (
                <View key={`priv-sec-${sIdx}`} style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>{sec.title}</Text>
                  <Text style={styles.paragraph}>{sec.body}</Text>
                  {sec.list.map((item, lIdx) => (
                    <View key={`priv-l-${lIdx}`} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ))}

              <Text style={styles.sectionTitle}>8. Data Usage Framework</Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableHeader, { flex: 0.8 }]}>{PRIVACY_CONTENT.tableHeader}</Text>
                  <Text style={[styles.tableCell, styles.tableHeader, { flex: 1.2 }]}>{PRIVACY_CONTENT.tableHeader}</Text>
                </View>
                {PRIVACY_CONTENT.tableData.map((row, index) => (
                  <View key={`table-${index}`} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableLabelCell, { flex: 0.8 }]}>{row.label}</Text>
                    <Text style={[styles.tableCell, { flex: 1.2 }]}>{row.value}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>9. Storage Retention Rules</Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableHeader, { flex: 0.8 }]}>{PRIVACY_CONTENT.retentionHeader}</Text>
                  <Text style={[styles.tableCell, styles.tableHeader, { flex: 1.2 }]}>{PRIVACY_CONTENT.retentionHeader}</Text>
                </View>
                {PRIVACY_CONTENT.retentionData.map((row, index) => (
                  <View key={`retention-${index}`} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableLabelCell, { flex: 0.8 }]}>{row.label}</Text>
                    <Text style={[styles.tableCell, { flex: 1.2 }]}>{row.value}</Text>
                  </View>
                ))}
              </View>
              <View style={{ height: 15 }} />
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.checkboxContainer, 
                !privacyScrolledToBottom && styles.checkboxContainerDisabled
              ]}
              activeOpacity={privacyScrolledToBottom ? 0.8 : 1}
              disabled={!privacyScrolledToBottom}
              onPress={() => setPrivacyChecked(!privacyChecked)}
            >
              <View style={[
                styles.checkbox, 
                privacyChecked && styles.checkboxSelected,
                !privacyScrolledToBottom && styles.checkboxDisabled
              ]}>
                {privacyChecked && <Ionicons name="checkmark" size={14} color="#FFF" />}
              </View>
              <Text style={[styles.checkboxLabel, !privacyScrolledToBottom && styles.checkboxLabelDisabled]}>
                {privacyScrolledToBottom 
                  ? <>I have read and understood the <Text style={styles.linkText}>Data Privacy Notice</Text>. I consent to the collection and processing of my personal data.</>
                  : "Please scroll to the bottom of the notice to unlock this agreement box."
                }
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.contentSectionTitle, { color: "#D9383A" }]}>TERMS & CONDITIONS</Text>
              <Text style={styles.scrollDownIndicator}>↓ Scroll to accept terms</Text>
            </View>

            <ScrollView 
              ref={scrollViewRef}
              style={styles.textContentBox} 
              showsVerticalScrollIndicator={false}
              onScroll={(e) => handleScroll(e, "terms")}
              scrollEventThrottle={16}
            >
              <Text style={styles.lastUpdated}>{TERMS_CONTENT.lastUpdated}</Text>
              
              {TERMS_CONTENT.sections.map((sec, sIdx) => (
                <View key={`terms-sec-${sIdx}`} style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>{sec.title}</Text>
                  <Text style={styles.paragraph}>{sec.body}</Text>
                  {sec.list.map((item, lIdx) => (
                    <View key={`terms-l-${lIdx}`} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ))}

              <Text style={styles.sectionTitle}>7. Violation Action Matrix</Text>
              <Text style={styles.paragraph}>Account penalties are instituted if users violate platform guidelines:</Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableHeader, { flex: 1 }]}>{TERMS_CONTENT.violationHeader}</Text>
                  <Text style={[styles.tableCell, styles.tableHeader, { flex: 0.7 }]}>{TERMS_CONTENT.violationHeader}</Text>
                  <Text style={[styles.tableCell, styles.tableHeader, { flex: 0.7 }]}>{TERMS_CONTENT.violationHeader}</Text>
                </View>
                {TERMS_CONTENT.violationData.map((row, index) => (
                  <View key={`terms-table-${index}`} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableLabelCell, { flex: 1 }]}>{row.label}</Text>
                    <Text style={[styles.tableCell, { flex: 0.7 }]}>{row.step1}</Text>
                    <Text style={[styles.tableCell, { flex: 0.7 }]}>{row.step2}</Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.paragraph, { fontStyle: "italic", color: "#718096" }]}>Note: Account premium subscriptions are paused during system suspension breaks.</Text>

              {TERMS_CONTENT.legalSections.map((sec, sIdx) => (
                <View key={`terms-legal-${sIdx}`} style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>{sec.title}</Text>
                  <Text style={styles.paragraph}>{sec.body}</Text>
                  {sec.list.map((item, lIdx) => (
                    <View key={`terms-leg-l-${lIdx}`} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ))}

              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>9. Administrative Contact</Text>
                <Text style={styles.paragraph}>{TERMS_CONTENT.contactInfo}</Text>
              </View>
              <View style={{ height: 15 }} />
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.checkboxContainer, 
                !termsScrolledToBottom && styles.checkboxContainerDisabled,
                !termsScrolledToBottom && { borderColor: "#FED7D7", backgroundColor: "#FFF5F5" }
              ]}
              activeOpacity={termsScrolledToBottom ? 0.8 : 1}
              disabled={!termsScrolledToBottom}
              onPress={() => setTermsChecked(!termsChecked)}
            >
              <View style={[
                styles.checkbox, 
                termsChecked && styles.checkboxSelected,
                !termsScrolledToBottom && { borderColor: "#E53E3E" },
                !termsScrolledToBottom && styles.checkboxDisabled
              ]}>
                {termsChecked && <Ionicons name="checkmark" size={14} color="#FFF" />}
              </View>
              <Text style={[
                styles.checkboxLabel, 
                !termsScrolledToBottom && styles.checkboxLabelDisabled,
                !termsScrolledToBottom && { color: "#C53030" }
              ]}>
                {termsScrolledToBottom 
                  ? <>I have read and understood the <Text style={[styles.linkText, { color: "#D9383A" }]}>Terms and Conditions</Text>. I agree to remain legally bound by all usage rules.</>
                  : "Please scroll to the bottom of the terms to unlock this agreement box."
                }
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.bottomNavigationArea}>
        <View style={styles.statusButtonsRow}>
          <View style={[styles.statusBadge, privacyChecked && styles.statusBadgeActive]}>
            <Ionicons name="checkmark-circle" size={16} color={privacyChecked ? "#28A745" : "#A0AEC0"} />
            <Text style={[styles.statusBadgeText, privacyChecked && styles.statusBadgeTextActive]}>
              Privacy Check
            </Text>
          </View>

          <View style={[styles.statusBadge, termsChecked && styles.statusBadgeActive]}>
            <Ionicons name="checkmark-circle" size={16} color={termsChecked ? "#28A745" : "#A0AEC0"} />
            <Text style={[styles.statusBadgeText, termsChecked && styles.statusBadgeTextActive]}>
              Terms Check
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryActionButton, isBothAccepted ? styles.buttonEnabled : styles.buttonDisabled]}
          disabled={!isBothAccepted}
          onPress={() => router.push("/registerOption")}
        >
          <Text style={styles.primaryActionButtonText}>
            {isBothAccepted ? "Proceed to Register" : "Please Accept Both to Proceed"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  topSubtitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: "#718096",
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 22,
    color: "#0A2540",
    marginBottom: 4,
  },
  headerDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#4A5568",
    lineHeight: 16,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    marginHorizontal: 20,
    padding: 6,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 4,
  },
  tabButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 11.5,
    color: "#718096",
    textAlign: "center",
  },
  activeTabButtonText: {
    color: "#0988EE",
  },
  contentWrapper: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  contentSectionTitle: {
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 12,
    color: "#0988EE",
    letterSpacing: 0.5,
  },
  readBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  readText: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: "#28A745",
  },
  scrollDownIndicator: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "#A0AEC0",
  },
  textContentBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    marginHorizontal: 20,
    padding: 14,
  },
  lastUpdated: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "#718096",
    textAlign: "center",
    marginBottom: 12,
  },
  sectionBlock: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 14,
    color: "#0A2540",
    marginBottom: 6,
  },
  paragraph: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#2D3748",
    lineHeight: 18,
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: 4,
    marginBottom: 4,
  },
  bulletDot: {
    fontSize: 14,
    color: "#4A5568",
    marginRight: 6,
    lineHeight: 18,
  },
  bulletText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 12.5,
    color: "#4A5568",
    lineHeight: 17,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    marginVertical: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tableCell: {
    padding: 8,
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "#4A5568",
    lineHeight: 15,
  },
  tableLabelCell: {
    fontFamily: "Inter_700Bold",
    color: "#2D3748",
  },
  tableHeader: {
    backgroundColor: "#0988EE",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    backgroundColor: "#EBF8FF",
    borderWidth: 1,
    borderColor: "#BEE3F8",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
    padding: 12,
    alignItems: "flex-start",
  },
  checkboxContainerDisabled: {
    backgroundColor: "#EDF2F7",
    borderColor: "#CBD5E0",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#0988EE",
    borderRadius: 4,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: "#0988EE",
  },
  checkboxDisabled: {
    borderColor: "#A0AEC0",
    backgroundColor: "#E2E8F0",
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 11.5,
    color: "#2B6CB0",
    lineHeight: 16,
  },
  checkboxLabelDisabled: {
    color: "#718096",
  },
  linkText: {
    fontFamily: "Inter_700Bold",
    color: "#0988EE",
    textDecorationLine: "underline",
  },
  bottomNavigationArea: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 45,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  statusButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingVertical: 8,
    width: "48%",
    backgroundColor: "#F7FAFC",
  },
  statusBadgeActive: {
    borderColor: "#C6F6D5",
    backgroundColor: "#F0FFF4",
  },
  statusBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: "#718096",
    marginLeft: 4,
  },
  statusBadgeTextActive: {
    color: "#22543D",
  },
  primaryActionButton: {
    width: "100%",
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonEnabled: {
    backgroundColor: "#0988EE",
  },
  buttonDisabled: {
    backgroundColor: "#CBD5E0",
  },
  primaryActionButtonText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
});