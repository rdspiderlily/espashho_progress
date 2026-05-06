import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import PhoneInput from "react-native-phone-number-input";
import { db } from "../firebaseConfig";

const { width } = Dimensions.get("window");

export default function SpaceCustomerProfile() {
  const router = useRouter();
  const phoneInput = useRef<PhoneInput>(null);
  const auth = getAuth();

  // --- STATES ---
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobText, setDobText] = useState("Date of Birth");
  const [sex, setSex] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Profile Data States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  // Modal Visibility States
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  const sexData = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  // Get current logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        router.replace("/");
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const personalDetails = userData.personalDetails || {};

        // Prefill ALL fields
        setFirstName(personalDetails.firstName || "");
        setLastName(personalDetails.lastName || "");
        setUsername(userData.username || "");

        // Prefill date of birth
        if (
          personalDetails.dateOfBirth &&
          personalDetails.dateOfBirth !== "Date of Birth"
        ) {
          setDobText(personalDetails.dateOfBirth);
          const parsedDate = new Date(personalDetails.dateOfBirth);
          if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate);
          }
        }

        // Prefill sex
        if (personalDetails.sex) {
          setSex(personalDetails.sex);
        }

        // Prefill phone number
        if (personalDetails.phoneNumber) {
          setPhoneNumber(personalDetails.phoneNumber);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setDobText(selectedDate.toLocaleDateString());
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0988EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Edit Profile</Text>

        <View style={styles.form}>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="rgba(9, 136, 238, 0.6)"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="rgba(9, 136, 238, 0.6)"
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={{
                flex: 1,
                color:
                  dobText === "Date of Birth"
                    ? "rgba(9, 136, 238, 0.6)"
                    : "#0988EE",
                fontFamily: "Inter_400Regular",
              }}
            >
              {dobText}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#0988EE" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={sexData}
            labelField="label"
            valueField="value"
            placeholder="Sex at Birth"
            value={sex}
            onChange={(item) => setSex(item.value)}
            renderRightIcon={() => (
              <Ionicons name="chevron-down" size={20} color="#0988EE" />
            )}
          />

          <PhoneInput
            ref={phoneInput}
            defaultValue={phoneNumber}
            defaultCode="PH"
            layout="first"
            onChangeFormattedText={(text) => setPhoneNumber(text)}
            containerStyle={styles.phoneContainer}
            textContainerStyle={styles.phoneTextContainer}
            codeTextStyle={{ color: "#0988EE", fontFamily: "Inter_400Regular" }}
            textInputStyle={{
              color: "#0988EE",
              fontFamily: "Inter_400Regular",
              height: 45,
            }}
          />

          <TextInput
            placeholder="Username"
            placeholderTextColor="rgba(9, 136, 238, 0.6)"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              placeholderTextColor="rgba(9, 136, 238, 0.6)"
              style={styles.flexInput}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons
                name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#0988EE"
              />
            </TouchableOpacity>
          </View>

          {/* Trigger Save Modal */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => setSaveModalVisible(true)}
          >
            <Text style={styles.confirmText}>Confirm Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setLogoutModalVisible(true)}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* --- MODAL: SAVE SUCCESS --- */}
      <Modal animationType="fade" transparent={true} visible={saveModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name="checkmark-circle-outline"
              size={60}
              color="#28a745"
            />
            <Text style={styles.modalTitle}>Profile Saved!</Text>
            <Text style={styles.modalSubTitle}>
              Your information has been successfully updated.
            </Text>
            <TouchableOpacity
              style={[styles.modalBtn, styles.saveConfirmBtn]}
              onPress={() => setSaveModalVisible(false)}
            >
              <Text style={styles.confirmBtnText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- MODAL: LOGOUT CONFIRM --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="help-circle-outline" size={60} color="#0988EE" />
            <Text style={styles.modalTitle}>Log Out?</Text>
            <Text style={styles.modalSubTitle}>
              Are you sure you want to logout? Any unsaved changes will be lost.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.logoutConfirmBtn]}
                onPress={() => {
                  setLogoutModalVisible(false);
                  router.replace("/");
                }}
              >
                <Text style={styles.confirmBtnText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- LAYOUT ---
  container: {
    flex: 1,
    backgroundColor: "#F0F7FF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 24,
    color: "#042652",
    marginBottom: 40,
  },
  form: {
    width: "100%",
  },

  // --- INPUTS ---
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#0988EE",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFF",
    color: "#0988EE",
    fontFamily: "Inter_400Regular",
  },
  inputContainer: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0988EE",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  flexInput: {
    flex: 1,
    color: "#0988EE",
    fontFamily: "Inter_400Regular",
  },
  dropdown: {
    height: 55,
    borderColor: "#0988EE",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "rgba(9, 136, 238, 0.6)",
    fontFamily: "Inter_400Regular",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#0988EE",
    fontFamily: "Inter_400Regular",
  },
  phoneContainer: {
    width: "100%",
    height: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0988EE",
    marginBottom: 15,
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  phoneTextContainer: {
    backgroundColor: "#FFF",
    paddingVertical: 0,
  },

  // --- BUTTONS ---
  confirmButton: {
    backgroundColor: "#0988EE",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  confirmText: {
    color: "#FFF",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  logoutBtn: {
    marginTop: 25,
    alignItems: "center",
  },
  logoutText: {
    fontFamily: "Inter_700Bold",
    color: "#FF4D4D",
    fontSize: 16,
  },

  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 22,
    color: "#042652",
    marginTop: 10,
  },
  modalSubTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 15,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalBtn: {
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  saveConfirmBtn: {
    backgroundColor: "#0988EE",
    width: "100%",
  },
  logoutConfirmBtn: {
    backgroundColor: "#FF4D4D",
    flex: 0.45,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "#0988EE",
    flex: 0.45,
  },
  cancelBtnText: {
    color: "#0988EE",
    fontFamily: "Inter_700Bold",
  },
  confirmBtnText: {
    color: "#FFF",
    fontFamily: "Inter_700Bold",
  },
});
