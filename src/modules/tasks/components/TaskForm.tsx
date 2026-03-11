import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useTheme } from '@themes/ThemeContext';
import type { Theme } from '@themes/index';

interface TaskFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialDueDate?: string | null;
  submitLabel: string;
  onSubmit: (data: { title: string; description: string; dueDate: string | null }) => void;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialTitle = '',
  initialDescription = '',
  initialDueDate = null,
  submitLabel,
  onSubmit,
  loading,
}) => {
  const { theme } = useTheme();
  const styles = makeStyles(theme);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [dueDate, setDueDate] = useState(initialDueDate ?? '');
  const [dateError, setDateError] = useState('');

  const handleDateChange = (value: string) => {
    // Only allow numbers and hyphens
    const sanitized = value.replace(/[^0-9-]/g, '');
    setDueDate(sanitized);

    // Clear error if empty
    if (!sanitized) {
      setDateError('');
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (sanitized.length === 10) {
      if (!dateRegex.test(sanitized)) {
        setDateError('Invalid date format. Use YYYY-MM-DD');
        return;
      }

      // Check if it's a valid date
      const selectedDate = new Date(sanitized);
      if (isNaN(selectedDate.getTime())) {
        setDateError('Invalid date');
        return;
      }

      // Check if date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setDateError('Date cannot be in the past');
        return;
      }

      setDateError('');
    } else if (sanitized.length > 10) {
      setDateError('Invalid date format');
    } else {
      setDateError('');
    }
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    // Validate date if provided
    if (dueDate && dateError) {
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Task title"
          placeholderTextColor={theme.colors.textSecondary}
          autoFocus
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add a description..."
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
        <TextInput
          style={[styles.input, dateError ? styles.inputError : null]}
          value={dueDate}
          onChangeText={handleDateChange}
          placeholder="2026-03-15"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />
        {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

        <TouchableOpacity
          style={[styles.button, (loading || dateError) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading || !!dateError}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>{submitLabel}</Text>
        </TouchableOpacity>
      </ScrollView>
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
      padding: theme.spacing.large,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 6,
      marginTop: theme.spacing.medium,
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
    },
    inputError: {
      borderColor: theme.colors.error,
      borderWidth: 2,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
    textArea: {
      minHeight: 100,
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: theme.spacing.large,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });
