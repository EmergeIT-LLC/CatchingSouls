import React from 'react';
import { Text, View, Pressable, ScrollView, Linking, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { contactStyles } from '../styles/screenStyles';

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
        <SafeAreaView style={contactStyles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                // adjust this offset to match your header/navbar height
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={contactStyles.form}>
                        <Text style={contactStyles.title}>Contact Us</Text>
                        <Text style={contactStyles.paragraph}>
                            We value your feedback, questions, and suggestions at Catching Souls Bible Trivia. If you have any inquiries or need assistance with our app, please don't hesitate to get in touch with us. Our dedicated support team is here to help you.
                        </Text>

                        <Text style={contactStyles.h2}>Contact Information:</Text>
                        <Text style={contactStyles.paragraph}>
                            <Text style={contactStyles.bold}>Email: </Text>
                            <Text style={contactStyles.link} onPress={handleMail}>
                                CatchingSoulsTrivia@Outlook.com
                            </Text>
                        </Text>

                        <Text style={contactStyles.h2}>How Can We Assist You?</Text>

                        {listItems.map((it, idx) => (
                            <View key={idx} style={contactStyles.listItem}>
                                <Text style={contactStyles.listIndex}>{idx + 1}.</Text>
                                <View style={contactStyles.listContent}>
                                    <Text style={contactStyles.listTitle}>{it.title}:</Text>
                                    <Text style={contactStyles.paragraphSmall}>{it.body}</Text>
                                </View>
                            </View>
                        ))}

                        <Text style={contactStyles.h2}>Connect with Us Today:</Text>
                        <Text style={contactStyles.paragraph}>
                            Catching Souls Bible Trivia is committed to creating a supportive and engaging platform for Bible enthusiasts worldwide. We aim to foster a community that celebrates knowledge, faith, and growth through the exploration of the Scriptures.
                        </Text>
                        <Text style={contactStyles.paragraph}>
                            Drop us an email at{' '}
                            <Text style={contactStyles.link} onPress={handleMail}>
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

export default Contact;