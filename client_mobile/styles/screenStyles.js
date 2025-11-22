import { StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../components/themes';

// Common/Shared Styles
export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.lg,
    },
    centeredScrollContent: {
        flexGrow: 1,
        padding: spacing.lg,
        justifyContent: 'center',
    },
    form: {
        borderWidth: 4,
        borderColor: colors.primary,
        borderRadius: radius.lg,
        padding: spacing.lg,
        alignItems: 'center',
    },
    formNonCentered: {
        borderWidth: 4,
        borderColor: colors.primary,
        borderRadius: radius.lg,
        padding: spacing.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    title24: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: spacing.lg,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    text: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    message: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    bold: {
        fontWeight: 'bold',
    },
    status: {
        marginTop: spacing.md,
        color: colors.danger,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

// Profile/Info Display Styles
export const profileStyles = StyleSheet.create({
    infoContainer: {
        width: '100%',
        marginBottom: spacing.lg,
    },
    infoRow: {
        marginBottom: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    value: {
        fontSize: 16,
        color: colors.text,
    },
});

// Image Styles
export const imageStyles = StyleSheet.create({
    logo: {
        width: 200,
        height: 200,
        marginBottom: spacing.lg,
    },
    logoGreyedOut: {
        width: 200,
        height: 200,
        marginBottom: spacing.lg,
        opacity: 0.5,
    },
});

// Table Styles
export const tableStyles = StyleSheet.create({
    section: {
        marginTop: spacing.xl,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    table: {
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: radius.sm,
        overflow: 'hidden',
    },
    wideTable: {
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: radius.sm,
        overflow: 'hidden',
        minWidth: 600,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        padding: spacing.sm,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        color: colors.bg,
        fontSize: 12,
    },
    row: {
        flexDirection: 'row',
        padding: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    cell: {
        flex: 1,
        fontSize: 12,
        color: colors.text,
    },
    cellSmall: {
        flex: 0.5,
        fontSize: 11,
        color: colors.text,
    },
    cellLarge: {
        flex: 2,
        fontSize: 11,
        color: colors.text,
    },
});

// Admin Styles
export const adminStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    form: {
        borderWidth: 4,
        borderColor: colors.primary,
        borderRadius: radius.lg,
        padding: spacing.xl,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
});

export default {
    common: commonStyles,
    profile: profileStyles,
    image: imageStyles,
    table: tableStyles,
    admin: adminStyles,
};
