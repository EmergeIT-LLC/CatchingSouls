import React from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, ScrollView, Linking, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Contact = () => {
    const handleMail = () => {
        Linking.openURL('mailto:catchingsoulstrivia@outlook.com');
    };

    const listItems = [
        {
            title: 'Technical Support',
            body: 'Encountering any technical issues while using the Catching Souls app? Reach out to us, and our tech experts will swiftly address and resolve any problems you may face.',
        },
        {
            title: 'Questions and Feedback',
            body: 'We love hearing from our users! If you have any questions about our quizzes, want to provide feedback on your experience, or have suggestions for improvements, feel free to drop us an email. We welcome your thoughts and strive to enhance your Catching Souls journey based on your valuable input.',
        },
        {
            title: 'Content Contributions',
            body: 'Are you a Bible enthusiast with a passion for crafting engaging trivia questions? We welcome content contributions from fellow users. If you have well-researched and accurate Bible trivia questions, please feel free to share them with us. Your contributions might even feature in our weekly uploads!',
        },
        {
            title: 'Partnership and Collaborations',
            body: 'Catching Souls is open to collaborations and partnerships with like-minded organizations, churches, or individuals. If you have ideas for joint ventures or faith-based projects, let us know, and we can explore the possibilities together.',
        },
        {
            title: 'Reporting Issues',
            body: 'If you come across any questionable content or encounter inaccuracies in our trivia questions, please inform us immediately. We strive to maintain the highest standard of biblical accuracy and appreciate your assistance in ensuring the quality of our app.',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                // adjust this offset to match your header/navbar height
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.form}>
                        <Text style={styles.title}>Contact Us</Text>
                        <Text style={styles.paragraph}>
                            We value your feedback, questions, and suggestions at Catching Souls Bible Trivia. If you have any inquiries or need assistance with our app, please don't hesitate to get in touch with us. Our dedicated support team is here to help you.
                        </Text>

                        <Text style={styles.h2}>Contact Information:</Text>
                        <Text style={styles.paragraph}>
                            <Text style={styles.bold}>Email: </Text>
                            <Text style={styles.link} onPress={handleMail}>
                                CatchingSoulsTrivia@Outlook.com
                            </Text>
                        </Text>

                        <Text style={styles.h2}>How Can We Assist You?</Text>

                        {listItems.map((it, idx) => (
                            <View key={idx} style={styles.listItem}>
                                <Text style={styles.listIndex}>{idx + 1}.</Text>
                                <View style={styles.listContent}>
                                    <Text style={styles.listTitle}>{it.title}:</Text>
                                    <Text style={styles.paragraphSmall}>{it.body}</Text>
                                </View>
                            </View>
                        ))}

                        <Text style={styles.h2}>Connect with Us Today:</Text>
                        <Text style={styles.paragraph}>
                            Catching Souls Bible Trivia is committed to creating a supportive and engaging platform for Bible enthusiasts worldwide. We aim to foster a community that celebrates knowledge, faith, and growth through the exploration of the Scriptures.
                        </Text>
                        <Text style={styles.paragraph}>
                            Drop us an email at{' '}
                            <Text style={styles.link} onPress={handleMail}>
                                CatchingSoulsTrivia@Outlook.com
                            </Text>
                            , and we'll be delighted to connect with you. Thank you for being a part of Catching Souls, and we look forward to accompanying you on your biblical journey.
                        </Text>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
     );
}

const styles = StyleSheet.create({
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
  formInputs: {
    marginTop: 12,
    alignItems: 'center',
    paddingBottom: 24,
  },
  input: {
    width: 260,
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    width: 260,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'purple',
    backgroundColor: 'gold',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: { color: 'black', fontWeight: 'bold' },
});

export default Contact;