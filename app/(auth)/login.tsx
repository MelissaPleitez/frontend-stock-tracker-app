import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";

const TABS_ROUTE = "/(tabs)/stocks" as const;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { login, register, loading, error: apiError } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    setValidationError(null);

    if (!email || !password) {
      setValidationError("Please fill in all fields.");
      return;
    }

    const success = isRegister
      ? await register(email, password)
      : await login(email, password);

    if (success) {
      router.replace(TABS_ROUTE);
    }
  };

  const handleToggle = () => {
    setIsRegister(!isRegister);
    setValidationError(null);
  };

  const activeError = validationError || apiError;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Stock Tracker</Text>
            <Text style={styles.subtitle}>
              {isRegister
                ? "Create your account"
                : "Monitor your stocks in real time"}
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setValidationError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setValidationError(null);
              }}
              secureTextEntry
            />

            {activeError && <Text style={styles.error}>{activeError}</Text>}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isRegister ? "Create Account" : "Login"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleToggle}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleText}>
                {isRegister
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <Text style={styles.toggleLink}>
                  {isRegister ? "Login" : "Register"}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  error: {
    color: "#ff4444",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#00d4aa",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  toggleText: {
    color: "#888",
    fontSize: 14,
  },
  toggleLink: {
    color: "#00d4aa",
    fontWeight: "600",
  },
});
