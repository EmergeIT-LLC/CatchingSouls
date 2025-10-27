import React from "react";
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";

const About = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>About Catching Souls:{"\n"}Your Ultimate Bible Trivia</Text>

        <Text style={styles.paragraph}>
          Welcome to Catching Souls, the ultimate Bible trivia app designed to deepen your understanding of the Bible while having fun! Our mission is to provide an engaging platform where users can test their knowledge, learn new insights, and grow in their faith through interactive quizzes.
        </Text>

        <Text style={styles.h2}>Why Catching Souls?</Text>
        <Text style={styles.paragraph}>
          At Catching Souls, we understand the importance of knowing and understanding the Bible's teachings. Whether you are a devoted believer seeking to reinforce your biblical knowledge or a curious individual looking to explore the Scriptures, our app caters to all levels of familiarity with the Bible.
        </Text>

        <Text style={styles.h2}>Features and Benefits:</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}><Text style={styles.bold}>1. Educational and Fun Quizzes:</Text> Our true or false and multiple-choice quizzes are both educational and enjoyable. Each question is carefully crafted to challenge your biblical understanding and encourage you to delve deeper into the Scriptures.</Text>

          <Text style={styles.listItem}><Text style={styles.bold}>2. Weekly Updated Content:</Text> Never run out of new challenges! We upload fresh sets of questions every week, ensuring that you always have something new to explore and learn.</Text>

          <Text style={styles.listItem}><Text style={styles.bold}>3. Comprehensive Bible Coverage:</Text> Catching Souls covers various topics from both the Old and New Testaments. From iconic biblical events to lesser-known narratives, our quizzes encompass a wide range of subjects to provide a holistic understanding of the Bible.</Text>

          <Text style={styles.listItem}><Text style={styles.bold}>4. User-Friendly Interface:</Text> Our app features an intuitive and user-friendly interface that makes navigation smooth and enjoyable. Accessing quizzes and reviewing your progress has never been easier.</Text>

          <Text style={styles.listItem}><Text style={styles.bold}>5. Faith-Enriching Experience:</Text> Catching Souls aims not only to impart knowledge but also to deepen your spiritual connection. Through thought-provoking questions and informative explanations, our app strives to enrich your faith journey.</Text>
        </View>

        <Text style={styles.h2}>Our Commitment to Accuracy:</Text>
        <Text style={styles.paragraph}>
          We take the accuracy of our content seriously. All questions in Catching Souls are meticulously researched and verified to ensure that the information provided is reliable and faithful to the Scriptures. Our team of biblical scholars and experts collaborates to maintain the highest standard of biblical accuracy.
        </Text>

        <Text style={styles.h2}>Join Us Today:</Text>
        <Text style={styles.paragraph}>
          Embark on an enriching journey through the Bible with Catching Souls. Strengthen your biblical knowledge, deepen your understanding of God's Word, and have fun along the way. Whether you're a beginner or a seasoned Bible scholar, our app is here to aid you on your quest for spiritual growth and knowledge.
        </Text>

        <Text style={styles.paragraph}>
          Join Catching Souls now and start catching wisdom from the Scriptures!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  title: { fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 12 },
  h2: { fontSize: 18, fontWeight: "700", marginTop: 10, marginBottom: 6 },
  paragraph: { fontSize: 15, color: "#111", marginBottom: 10, lineHeight: 22 },
  list: { marginVertical: 6 },
  listItem: { fontSize: 15, color: "#111", marginBottom: 8, lineHeight: 20 },
  bold: { fontWeight: "700" },
});

export default About;