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

// Login/Auth Styles
export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
    },
    form: {
        width: '85%',
        alignSelf: 'center',
        borderWidth: 4,
        borderRadius: 16,
        borderColor: 'purple',
        alignItems: 'center',
        paddingVertical: 16,
    },
    logo: {
        width: 250,
        height: 250,
        marginBottom: 12,
    },
    title: {
        color: 'crimson',
        fontSize: 28,
        marginVertical: 12,
        fontWeight: '700',
    },
    button: {
        width: 260,
        height: 44,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'purple',
        backgroundColor: 'purple',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonTextOutline: {
        color: 'purple',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 8,
    },
});

// Content/About Styles
export const contentStyles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#fff" 
    },
    form: {
        width: "92%",
        alignSelf: "center",
        borderWidth: 4,
        borderColor: "purple",
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 18,
        backgroundColor: "#fff",
        marginTop: 12,
        marginBottom: 18,
    },
    title: { 
        fontSize: 22, 
        fontWeight: "800", 
        textAlign: "center", 
        marginBottom: 12 
    },
    h2: { 
        fontSize: 18, 
        fontWeight: "700", 
        marginTop: 10, 
        marginBottom: 6 
    },
    paragraph: { 
        fontSize: 15, 
        color: "#111", 
        marginBottom: 10, 
        lineHeight: 22 
    },
    list: { 
        marginVertical: 6 
    },
    listItem: { 
        fontSize: 15, 
        color: "#111", 
        marginBottom: 8, 
        lineHeight: 20 
    },
    bold: { 
        fontWeight: "700" 
    },
    button: {
        backgroundColor: 'purple',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

// Dashboard Styles
export const dashboardStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'crimson',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    greeting: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonsContainer: {
        padding: 20,
        gap: 15,
    },
    button: {
        backgroundColor: 'purple',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'purple',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});

// Level Choice Styles
export const levelStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'crimson',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'purple',
        padding: 16,
        borderRadius: 12,
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    questionCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'purple',
        padding: 16,
        marginBottom: 20,
    },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    answerButton: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'purple',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    answerButtonSelected: {
        backgroundColor: 'purple',
    },
    answerText: {
        fontSize: 14,
        color: 'purple',
        textAlign: 'center',
        fontWeight: '600',
    },
    answerTextSelected: {
        color: '#fff',
    },
    scoreText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'purple',
        textAlign: 'center',
        marginVertical: 10,
    },
});

// Contact Styles
export const contactStyles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff',
    },
    form: {
        width: '92%',
        alignSelf: 'center',
        borderWidth: 4,
        borderRadius: 16,
        borderColor: 'purple',
        alignItems: 'stretch',
        paddingVertical: 18,
        paddingHorizontal: 18,
        backgroundColor: '#fff',
        marginTop: 12,
        marginBottom: 18,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        marginBottom: 12,
    },
    h2: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 10,
        marginBottom: 6,
    },
    paragraph: {
        fontSize: 14,
        marginBottom: 8,
        color: '#111',
    },
    paragraphSmall: {
        fontSize: 13,
        color: '#222',
    },
    bold: {
        fontWeight: '700',
    },
    link: {
        color: 'purple',
        textDecorationLine: 'underline',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    listIndex: {
        fontSize: 14,
        fontWeight: '700',
        width: 18,
    },
    listContent: {
        flex: 1,
        paddingLeft: 6,
    },
    listTitle: {
        fontWeight: '700',
        fontSize: 14,
    },
});

// Logout Styles
export const logoutStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        width: '85%',
        borderWidth: 4,
        borderRadius: 16,
        borderColor: 'purple',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    logo: {
        width: 250,
        height: 250,
        marginBottom: 12,
    },
    title: {
        color: 'crimson',
        fontSize: 28,
        marginVertical: 12,
        fontWeight: '700',
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginVertical: 12,
    },
});

export default {
    common: commonStyles,
    profile: profileStyles,
    image: imageStyles,
    table: tableStyles,
    admin: adminStyles,
    login: loginStyles,
    content: contentStyles,
    dashboard: dashboardStyles,
    level: levelStyles,
    contact: contactStyles,
    logout: logoutStyles,
};
