import React, { useEffect, useState } from "react";
import {
	Text,
	View,
	StyleSheet,
	Alert,
	FlatList,
	KeyboardAvoidingView,
} from "react-native";
import NumberContainer from "../components/game/NumberContainer";
import Card from "../components/ui/Card";
import PrimaryButton from "../components/ui/PrimaryButton";
import Title from "../components/ui/Title";
import { Ionicons } from "@expo/vector-icons";
import GuessLogItem from "../components/game/GuessLogItem";
const generateRandomBetween = (min, max, exclude) => {
	const randomNumber = Math.floor(Math.random() * (max - min)) + min;
	if (randomNumber === exclude) {
		return generateRandomBetween(min, max, exclude);
	} else {
		return randomNumber;
	}
};

let minBoundary = 1;
let maxBoundary = 100;

const GameScreen = ({ userNumber, gameOverHandler }) => {
	const initialGuess = generateRandomBetween(1, 100, userNumber);
	const [currentGuess, setCurrentGuess] = useState(initialGuess);
	const [guessRounds, setGuessRounds] = useState([initialGuess]);

	useEffect(() => {
		if (userNumber === currentGuess) {
			gameOverHandler(guessRounds.length);
		}
	}, [userNumber, currentGuess, gameOverHandler]);

	useEffect(() => {
		minBoundary = 1;
		maxBoundary = 100;
	}, []);

	const nextGuessHandler = (direction) => {
		if (
			(direction === "lower" && currentGuess < userNumber) ||
			(direction === "greater" && currentGuess > userNumber)
		) {
			Alert.alert("Don't lie!", "You know that this is wrong...", [
				{
					text: "Sorry",
					style: "cancel",
				},
			]);
			return;
		}
		if (direction === "lower") {
			maxBoundary = currentGuess;
		} else {
			minBoundary = currentGuess + 1;
		}
		const newRandomNumber = generateRandomBetween(
			minBoundary,
			maxBoundary,
			currentGuess
		);
		setCurrentGuess(newRandomNumber);
		setGuessRounds((prev) => [newRandomNumber, ...prev]);
	};
	const guessRoundsLength = guessRounds.length;
	return (
		<KeyboardAvoidingView>
			<View style={styles.screen}>
				<Title>Opponent's Guess</Title>
				<NumberContainer>{currentGuess}</NumberContainer>
				<Card>
					<Text>Higher or lower?</Text>
					<View style={styles.buttons}>
						<PrimaryButton onPress={() => nextGuessHandler("greater")}>
							<Ionicons name="add" size={24} color="white" />
						</PrimaryButton>
						<PrimaryButton onPress={() => nextGuessHandler("lower")}>
							<Ionicons name="remove-outline" size={24} color="white" />
						</PrimaryButton>
					</View>
				</Card>
				<View style={styles.listContainer} s>
					<FlatList
						data={guessRounds}
						renderItem={({ item, index }) => (
							<GuessLogItem
								roundNumber={guessRoundsLength - index}
								guess={item}
							/>
						)}
						keyExtractor={(item) => item}
					/>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

export default GameScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		padding: 24,
	},
	buttons: {
		flexDirection: "row",
		justifyContent: "center",
	},
	listContainer: {
		flex: 1,
		padding: 16,
	},
});
