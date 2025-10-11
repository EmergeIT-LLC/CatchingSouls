import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing, radius } from '../theme';

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary' | 'outline' | 'ghost'
  style,
  textStyle,
}) {
  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    variant === 'primary' && styles.primary,
    variant === 'outline' && styles.outline,
    variant === 'ghost' && styles.ghost,
    isDisabled && styles.disabled,
    style,
  ];

  const labelStyle = [
    styles.label,
    variant === 'outline' || variant === 'ghost' ? { color: colors.text } : null,
    textStyle,
  ];

  return (
    <Pressable style={containerStyle} onPress={onPress} disabled={isDisabled} hitSlop={8}>
      {loading ? <ActivityIndicator color={colors.text} /> : <Text style={labelStyle}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 44,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  primary: { backgroundColor: colors.accent },
  outline: { backgroundColor: 'transparent' },
  ghost: { backgroundColor: 'transparent', borderWidth: 0 },
  disabled: { opacity: 0.6 },
  label: { fontWeight: 'bold', color: colors.text },
});