import React, { useEffect, useState, useRef, useCallback } from "react";
import { Image, Pressable, StyleSheet, Text, View, ScrollView, SafeAreaView, useWindowDimensions } from "react-native";
import { useThrottleAsync } from "../functions/throttler";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API } from "../config/constants";
import VerificationCheck from "../functions/verificationCheck";

const LevelChoiceSelected = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const SelectedLevel = route?.params?.SelectedLevel;
    const [loggedInUser, setLoggedInUser] = useState(null); // username or null
    const [guestLoggedIn, setGuestLoggedIn] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isTrueFalse, setIsTrueFalse] = useState(false);
    const [questionID, setQuestionID] = useState(null);
    const [question, setQuestion] = useState(null);
    const [answerA, setAnswerA] = useState(null);
    const [answerB, setAnswerB] = useState(null);
    const [answerC, setAnswerC] = useState(null);
    const [answerD, setAnswerD] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [supportingVerse, setSupportingVerse] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(false);
    const [checkingAnswer, setCheckingAnswer] = useState(false);
    const [answerCorrect, setAnswerCorrect] = useState(true);

    const [timer, setTimer] = useState(null);
    const [playerPoints, setPlayerPoints] = useState(0);

    // --- auth check on mount ---
    useEffect(() => {
        (async () => {
            try {
                const isUser = await VerificationCheck.CheckUserLogin();
                const isGuest = await VerificationCheck.CheckGuestLogin();

                if (!isUser && !isGuest) {
                    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
                    return;
                }

                if (isUser) {
                    const username = await VerificationCheck.CheckUser();
                    setLoggedInUser(username);
                } else {
                    const guestName = await VerificationCheck.CheckGuest();
                    setLoggedInUser(guestName);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            }
        })();
    }, [navigation]);

    // Reload/reset when the screen comes into focus so returning users don't see stale "incorrect" UI
    useFocusEffect(
        useCallback(() => {
            let active = true;

            // clear any answer state immediately so UI doesn't briefly show incorrect
            setSelectedAnswer(false);
            setCheckingAnswer(false);
            setAnswerCorrect(true);
            setCorrectAnswer(null);
            setSupportingVerse(null);

            // only fetch when auth has resolved (loggedInUser can be non-null) or guest flag true
            if (active && (loggedInUser !== null || guestLoggedIn === true)) {
                // nextQuestion is async; fire-and-forget is OK here but await to ensure sequence
                (async () => {
                    try {
                        await nextQuestion();
                    } catch (e) {
                        console.error("nextQuestion on focus failed:", e);
                    }
                })();
            }

            return () => {
                active = false;
            };
        }, [loggedInUser, guestLoggedIn, nextQuestion])
    );

    // --- define functions with useCallback so hooks below can reference them safely ---
    const getPlayerPoints = useCallback(async () => {
        try {
            if (!guestLoggedIn) {
                const url = `${API.BASE_URL}/trivia/getPlayerPoints`;
                const resp = await axios.post(url, { loggedInUser });
                setPlayerPoints(Number(resp.data.playerPoints) || 0);
            } else {
                const v = await AsyncStorage.getItem("catchingSoulsGuestPoints");
                setPlayerPoints(Number(v) || 0);
            }
        } catch (err) {
            console.error("getPlayerPoints error:", err);
        }
    }, [guestLoggedIn, loggedInUser]);

    const getTriviaQandA = useCallback(async () => {
        try {
            setIsLoading(true);
            setCorrectAnswer(null);

            const url = `${API.BASE_URL}/trivia/retrievequestion`;
            const response = await axios.post(url, {SelectedLevel: { SelectedLevel }});

            setIsTrueFalse(response.data.questionType === "TrueOrFalse");
            setQuestionID(response.data.questionID);
            setQuestion(response.data.question);
            setAnswerA(response.data.a);
            setAnswerB(response.data.b);
            setAnswerC(response.data.c);
            setAnswerD(response.data.d);
            setSupportingVerse(response.data.supportingVerse);
            setIsLoading(false);
        } catch (err) {
            console.error("getTriviaQandA error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [SelectedLevel]);

    const setTimerLimit = useCallback(() => {
        setTimer(30);
    }, []);

    // --- create throttled wrappers using the hook (top-level only) ---
    const throttledGetPlayerPoints = useThrottleAsync(getPlayerPoints, 2000);
    const throttledGetTriviaQandA = useThrottleAsync(getTriviaQandA, 2000);
    const throttledSetTimerLimit = useThrottleAsync(setTimerLimit, 2000);

    // --- call the throttled functions when auth info ready ---
    useEffect(() => {
        if (loggedInUser === null && !guestLoggedIn) return; // still resolving
        let active = true;
        (async () => {
            if (!active) return;
            setIsLoading(true);
            await throttledGetPlayerPoints();
            await throttledGetTriviaQandA();
            await throttledSetTimerLimit();
            setIsLoading(false);
        })();
        return () => {
            active = false;
        };
    }, [
        loggedInUser,
        guestLoggedIn,
        throttledGetPlayerPoints,
        throttledGetTriviaQandA,
        throttledSetTimerLimit,
    ]);

    // timer countdown
    useEffect(() => {
        if (timer == null) return;
        const id = setInterval(() => {
        setTimer((t) => {
            if (t == null) return null;
            if (t <= 1) {
            // time's up
            setTimer(null);
            checkSelectedAnswer(null);
            setSupportingVerse(null);
            return null;
            }
            return t - 1;
        });
        }, 1000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer]);

    // --- check answer ---
    const checkSelectedAnswer = useCallback(
        async (selectedAnswerChoice) => {
            if (checkingAnswer) return;
            setTimer(null);
            setSelectedAnswer(true);
            setCheckingAnswer(true);

            if (selectedAnswerChoice === null) {
                setAnswerCorrect(false);
                setCheckingAnswer(false);
                return;
            }

            try {
                const url = `${API.BASE_URL}/trivia/checkanswer`;
                const resp = await axios.post(url, {
                questionID,
                selectedAnswerChoice,
                loggedInUser,
                });

                const results = resp.data?.results;
                if (results === true || results === "true") {
                setAnswerCorrect(true);
                    if (guestLoggedIn) {
                        const raw = await AsyncStorage.getItem("catchingSoulsGuestPoints");
                        let currentPoints = Number(raw) || 0;
                        if (SelectedLevel === "Beginner") currentPoints += 1;
                        else if (SelectedLevel === "Intermediate") currentPoints += 2;
                        else if (SelectedLevel === "Advanced") currentPoints += 3;
                        else currentPoints += 0;
                        await AsyncStorage.setItem(
                            "catchingSoulsGuestPoints",
                            String(currentPoints)
                        );
                        setPlayerPoints(currentPoints);
                    }
                } else {
                    setCorrectAnswer(resp.data?.correctAnswer ?? null);
                    setAnswerCorrect(false);
                }
            } catch (err) {
                console.error("checkSelectedAnswer error:", err);
            } finally {
                setCheckingAnswer(false);
            }
        },
        [checkingAnswer, questionID, loggedInUser, guestLoggedIn, SelectedLevel]
    );

    const nextQuestion = useCallback(async () => {
        await getPlayerPoints();
        await getTriviaQandA();
        setTimerLimit();
        setSelectedAnswer(false);
    }, [getPlayerPoints, getTriviaQandA, setTimerLimit]);

    const leaveTrivia = useCallback(() => {
        navigation.navigate("LevelChoice");
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.form}>
            {isLoading ? (
                    <Text>Loading...</Text>
                ) : selectedAnswer ? (
                    checkingAnswer ? (
                        <Text>Checking answer...</Text>
                    ) : answerCorrect ? (
                        <View>
                            <Text style={styles.correctText}>Correct Answer</Text>
                            {supportingVerse && <Text style={styles.supportingVerse}>Supporting Verse: {supportingVerse}</Text>}
                            <Pressable style={styles.button} onPress={nextQuestion}>
                                <Text style={styles.buttonText}>Next Question</Text>
                            </Pressable>
                            <Pressable style={styles.cancelButton} onPress={leaveTrivia}>
                                <Text style={styles.cancelButtonText}>Leave Trivia</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.incorrectText}>Incorrect Answer</Text>
                            {correctAnswer && <Text style={styles.text}>The correct answer was: {String(correctAnswer)}</Text>}
                            {supportingVerse && <Text style={styles.supportingVerse}>Supporting Verse: {supportingVerse}</Text>}
                            <Pressable style={styles.button} onPress={nextQuestion}>
                                <Text style={styles.buttonText}>Next Question</Text>
                            </Pressable>
                            <Pressable style={styles.cancelButton} onPress={leaveTrivia}>
                                <Text style={styles.cancelButtonText}>Leave Trivia</Text>
                            </Pressable>
                        </View>
                    )
                    ) : (
                    <View>
                        {/* header row: points + timer */}
                        <View style={styles.triviaHeaderRow}>
                            <Text style={styles.playerPoints}>Points: {playerPoints}</Text>
                            <Text style={styles.timer}>Time: {timer ?? "-"}</Text>
                        </View>
                        {/* question on its own line so it cannot overlap the header */}
                        <Text style={styles.question}>{String(question)}</Text>
                        <Pressable
                        style={styles.button}
                        onPress={() => checkSelectedAnswer(answerA)}
                        >
                        <Text style={styles.buttonText}>{String(answerA)}</Text>
                        </Pressable>

                        <Pressable
                        style={styles.button}
                        onPress={() => checkSelectedAnswer(answerB)}
                        >
                        <Text style={styles.buttonText}>{String(answerB)}</Text>
                        </Pressable>
                        {!isTrueFalse && (
                        <>
                            <Pressable
                            style={styles.button}
                            onPress={() => checkSelectedAnswer(answerC)}
                            >
                            <Text style={styles.buttonText}>{String(answerC)}</Text>
                            </Pressable>
                            <Pressable
                            style={styles.button}
                            onPress={() => checkSelectedAnswer(answerD)}
                            >
                            <Text style={styles.buttonText}>{String(answerD)}</Text>
                            </Pressable>
                        </>
                        )}
                        <Pressable
                        style={[styles.cancelButton, { marginTop: 12 }]}
                        onPress={leaveTrivia}
                        >
                        <Text style={styles.cancelButtonText}>Leave Trivia</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

// create styles that mirror your web CSS and media rule.
// The original CSS file: client/src/Pages/LevelChoiceSelected/LevelChoiceSelected.css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingBottom: 24,
  },
  form: {
    width: "85%",
    borderWidth: 4,
    borderRadius: 16,
    borderColor: "purple",
    alignItems: "stretch",          // allow children to stretch inside card
    paddingVertical: 16,
    paddingHorizontal: 18,         // <-- important: keeps content away from border
    backgroundColor: "#fff",
    margin: "25%",
  },
  triviaHeaderRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  playerPoints: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    flexShrink: 1,                 // allow shrinking to avoid overflow
  },
  timer: {
    fontSize: 18,
    fontWeight: "800",
    color: "red",
    flexShrink: 1,                 // allow shrinking to avoid overflow
    textAlign: "right",
  },
  text: {
    width: "100%",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
    marginVertical: 12,
    color: "black",
    textAlign: "center",
  },
  question: {
    width: "100%",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
    marginVertical: 12,
    color: "black",
    textAlign: "center",
  },
  correctText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    marginVertical: 12,
  },
  incorrectText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
    marginVertical: 12,
  },
  button: {
    width: "100%",
    maxWidth: 380,
    height: 64,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "purple",
    backgroundColor: "gold",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    alignSelf: "center",
    paddingHorizontal: 14,
  },
  answerButton: {
    alignSelf: "center",
    marginHorizontal: 8,
  },
  buttonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 18,
  },
  cancelButton: {
    width: "100%",
    maxWidth: 360,
    height: 66,
    borderRadius: 14,
    borderWidth: 4,
    borderColor: "darkgoldenrod",
    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 14,
    alignSelf: "center",
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "white",
  },
  supportingVerse: {
    marginTop: 8,
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
});

export default LevelChoiceSelected;