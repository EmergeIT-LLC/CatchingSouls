import React, { useEffect, useState, useRef, useCallback } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import TextField from "../components/TextField";
import { useThrottleAsync } from "../functions/throttler";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API } from "../config/constants";
import entryCheck from "../functions/entryCheck";
import VerificationCheck from "../functions/verificationCheck";

const LevelChoiceSelected = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const SelectedLevel = route?.params?.SelectedLevel ?? "Beginner";
    const [loggedInUser, setLoggedInUser] = useState(null); // username or null
    const [guestLoggedIn, setGuestLoggedIn] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isTrueFalse, setIsTrueFalse] = useState(false);
    const [questionID, setQuestionID] = useState(null);
    const [question, setQuestion] = useState("");
    const [answerA, setAnswerA] = useState("");
    const [answerB, setAnswerB] = useState("");
    const [answerC, setAnswerC] = useState("");
    const [answerD, setAnswerD] = useState("");
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
            setQuestionID(response.data.questionID ?? null);
            setQuestion(response.data.question ?? "");
            setAnswerA(response.data.a ?? "");
            setAnswerB(response.data.b ?? "");
            setAnswerC(response.data.c ?? "");
            setAnswerD(response.data.d ?? "");
            setSupportingVerse(response.data.supportingVerse ?? null);
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
                    else currentPoints += 3;
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
        navigation.goBack();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                {isLoading ? (
                <Text>Loading...</Text>
                ) : selectedAnswer ? (
                checkingAnswer ? (
                    <Text>Checking answer...</Text>
                ) : answerCorrect ? (
                    <View>
                    <Text>Correct Answer</Text>
                    {supportingVerse ? (
                        <Text>Supporting Verse: {supportingVerse}</Text>
                    ) : null}
                    <Pressable style={styles.button} onPress={nextQuestion}>
                        <Text style={styles.buttonText}>Next Question</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={leaveTrivia}>
                        <Text style={styles.buttonText}>Leave Trivia</Text>
                    </Pressable>
                    </View>
                ) : (
                    <View>
                    <Text>
                        Incorrect. The correct answer was: {String(correctAnswer)}
                    </Text>
                    <Text>Supporting Verse: {supportingVerse}</Text>
                    <Pressable style={styles.button} onPress={nextQuestion}>
                        <Text style={styles.buttonText}>Next Question</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={leaveTrivia}>
                        <Text style={styles.buttonText}>Leave Trivia</Text>
                    </Pressable>
                    </View>
                )
                ) : (
                <View>
                    <Text style={styles.text}>Points: {playerPoints}</Text>
                    <Text style={styles.text}>
                    Time Remaining: {timer ?? "-"} seconds
                    </Text>
                    <Text style={styles.text}>{String(question)}</Text>

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
                    style={[styles.button, { marginTop: 12 }]}
                    onPress={leaveTrivia}
                    >
                    <Text style={styles.buttonText}>Leave Trivia</Text>
                    </Pressable>
                </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    form: {
        width: "85%",
        borderWidth: 4,
        borderRadius: 16,
        borderColor: "purple",
        alignItems: "center",
        paddingVertical: 16,
    },
    text: { fontSize: 16, marginVertical: 8 },
    button: {
        width: 260,
        height: 44,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "purple",
        backgroundColor: "gold",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
    },
    buttonText: { color: "black", fontWeight: "bold" },
});

export default LevelChoiceSelected;