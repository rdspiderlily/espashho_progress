import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdVisible, setPwdVisible] = useState(false);
  const [confirmPwdVisible, setConfirmPwdVisible] = useState(false);

  const handleOtpChange = (text: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = text.slice(-1);
    setOtp(updatedOtp);
  };

  const handleAction = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (currentStep === 1) {
        setCurrentStep(2);
      } else if (currentStep === 2) {
        setCurrentStep(3);
      }
    }, 1000);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.back();
    } else if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      setCurrentStep(2);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: currentStep === 1 ? "33.3%" : currentStep === 2 ? "66.6%" : "100%" }
          ]} 
        />
      </View>

      <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={28} color="#042652" />
      </TouchableOpacity>

      {currentStep === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subTitle}>Enter your email to send code</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="rgba(9, 136, 238, 0.6)"
              style={[styles.input, { flex: 1 }]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TouchableOpacity activeOpacity={0.6}>
              <Text style={styles.sendInlineLink}>Send</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>OTP</Text>
          <View style={styles.otpRow}>
            {otp.map((digit, idx) => (
              <TextInput
                key={`otp-${idx}`}
                style={styles.otpBox}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, idx)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.resendContainer} activeOpacity={0.7}>
            <Text style={styles.resendText}>Didn't receive code? <Text style={styles.resendHighlight}>Resend</Text></Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleAction} activeOpacity={0.8}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Verify Code</Text>}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Remember your Password? Back to </Text>
            <TouchableOpacity onPress={() => router.replace("/")} activeOpacity={0.7}>
              <Text style={styles.inlineLoginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentStep === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Confirm Password</Text>
          <Text style={styles.subTitle}>Please enter your new password</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="New Password"
              placeholderTextColor="rgba(9, 136, 238, 0.6)"
              secureTextEntry={!pwdVisible}
              style={[styles.input, { flex: 1 }]}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setPwdVisible(!pwdVisible)} activeOpacity={0.7}>
              <Ionicons name={pwdVisible ? "eye-outline" : "eye-off-outline"} size={24} color="rgba(9, 136, 238, 0.6)" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Confirm New Password"
              placeholderTextColor="rgba(9, 136, 238, 0.6)"
              secureTextEntry={!confirmPwdVisible}
              style={[styles.input, { flex: 1 }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setConfirmPwdVisible(!confirmPwdVisible)} activeOpacity={0.7}>
              <Ionicons name={confirmPwdVisible ? "eye-outline" : "eye-off-outline"} size={24} color="rgba(9, 136, 238, 0.6)" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleAction} activeOpacity={0.8}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Reset Password</Text>}
          </TouchableOpacity>
        </View>
      )}

      {currentStep === 3 && (
        <View style={styles.centeredStepContainer}>
          <View style={styles.successIconWrapper}>
            <Ionicons name="checkmark-circle" size={100} color="#00C851" />
          </View>

          <Text style={styles.title}>Password updated!</Text>
          <Text style={styles.subTitle}>You may sign in using your new password</Text>

          <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace("/")} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Return to Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 30,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: "#E2E8F0",
    width: width,
    position: "absolute",
    top: 50,
    left: 0,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0988EE",
  },
  backButton: {
    marginTop: 75,
    alignSelf: "flex-start",
    marginBottom: 20,
    padding: 5,
  },
  stepContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    paddingBottom: 40,
  },
  centeredStepContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  title: {
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 28,
    color: "#042652",
    textAlign: "center",
    marginBottom: 12,
  },
  subTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0988EE",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  input: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#0988EE",
    height: "100%",
  },
  sendInlineLink: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#0988EE",
    paddingLeft: 10,
  },
  fieldLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#042652",
    alignSelf: "flex-start",
    marginBottom: 10,
    marginTop: 10,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  otpBox: {
    width: width * 0.17,
    height: 55,
    borderWidth: 1,
    borderColor: "#0988EE",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#042652",
    backgroundColor: "#FFFFFF",
  },
  resendContainer: {
    alignSelf: "center",
    marginBottom: 35,
    padding: 4,
  },
  resendText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#718096",
  },
  resendHighlight: {
    fontFamily: "Inter_700Bold",
    color: "#0988EE",
  },
  primaryButton: {
    backgroundColor: "#0988EE",
    width: "100%",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  primaryButtonText: {
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    fontSize: 18,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  footerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#718096",
  },
  inlineLoginLink: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#042652",
    textDecorationLine: "underline",
  },
  successIconWrapper: {
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});