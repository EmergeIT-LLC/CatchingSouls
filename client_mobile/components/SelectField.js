import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, spacing, radius } from './themes';

export default function SelectField({ label, value, onValueChange, items, error, style }) {
  return (
    <View style={[styles.container, style]}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {items.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: spacing.md },
  label: { marginBottom: spacing.xs, color: colors.text, fontWeight: '600' },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 44,
  },
  error: { color: colors.danger, marginTop: spacing.xs },
});
