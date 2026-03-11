import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@themes/ThemeContext';
import type { Theme } from '@themes/index';

interface AuthFormProps {
  title: string;
  submitLabel: string;
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
  error: string | null;
  footerText: string;
  footerActionLabel: string;
  onFooterAction: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  submitLabel,
  onSubmit,
  loading,
  error,
  footerText,
  footerActionLabel,
  onFooterAction,
}) => {
  const { theme } = useTheme();
  const styles = makeStyles(theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateGmail = (emailValue: string): boolean => {
    const trimmedEmail = emailValue.trim().toLowerCase();
    
    // Check if email is empty
    if (!trimmedEmail) {
      setEmailError('');
      return false;
    }

    // Check if email ends with @gmail.com
    if (!trimmedEmail.endsWith('@gmail.com')) {
      setEmailError('Only Gmail addresses are accepted');
      return false;
    }

    // Validate email format
    const emailRegex = /^[a-z0-9](\.?[a-z0-9]){1,}@gmail\.com$/i;
    if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Please enter a valid Gmail address');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value.trim()) {
      validateGmail(value);
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail || !password) {
      if (!trimmedEmail) {
        setEmailError('Email is required');
      }
      return;
    }

    if (!validateGmail(trimmedEmail)) {
      return;
    }

    onSubmit(trimmedEmail, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <Text style={styles.title}>{title}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Email (Gmail only)"
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={handleEmailChange}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
        />
        {emailError ? <Text style={styles.validationError}>{emailError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          autoComplete="password"
        />

        <TouchableOpacity
          style={[styles.button, (loading || emailError) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading || !!emailError}
          activeOpacity={0.7}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>{submitLabel}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{footerText} </Text>
          <TouchableOpacity onPress={onFooterAction}>
            <Text style={styles.footerAction}>{footerActionLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.large,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 32,
    },
    error: {
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.medium,
      fontSize: 14,
    },
    input: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      marginBottom: theme.spacing.medium,
    },
    inputError: {
      borderColor: theme.colors.error,
      borderWidth: 2,
      marginBottom: 4,
    },
    validationError: {
      color: theme.colors.error,
      fontSize: 12,
      marginBottom: theme.spacing.small,
      marginTop: -8,
      marginLeft: 4,
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: theme.spacing.small,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.large,
    },
    footerText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    footerAction: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
  });
