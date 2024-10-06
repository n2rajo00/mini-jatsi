import { useState, useEffect } from 'react';
import { Text, View, Pressable } from "react-native";
import Header from './Header';
import Footer from './Footer';
import { 
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS_LIMIT,
    BONUS_POINTS } from '../constants/Game'
import { Container, Row, Col } from "react-native-flex-grid";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../style/style";

let  board = [];

export default Gameboard = ({ navigation, route }) => {

    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices');
    const [GameEndStatus, setGameEndStatus] = useState(false);

    const[selectedDices,setSelectedDices] = 
        useState(new Array(NBR_OF_DICES).fill(false));

    const [diceSpots, setDiceSpots] =
        useState(new Array(NBR_OF_DICES).fill(0));

    const [selectedDicePoints, setSelectedDicePoints] =
        useState(new Array(MAX_SPOT).fill(false));
        
    const [dicePointsTotal, setDicePointsTotal] =
        useState(new Array(MAX_SPOT).fill(0));

    const [playerName, setPlayerName] = useState('');

    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, []);

    // useEffect for navigating through screens and carry points there
    //useEffect(() => {
     ////       getScoreboardData();
    //    });
    //    return unsubscribe;
   // }, [navigation])

    useEffect(() => {
        checkWinner();
        if (nbrOfThrowsLeft === NBR_OF_THROWS) {
          setStatus('Game has not started');
        }
        if (nbrOfThrowsLeft < 0) {
          setNbrOfThrowsLeft(NBR_OF_THROWS-1);
        }
    }, [nbrOfThrowsLeft]);
  

    const row = [];
    for (let dice = 0; dice < NBR_OF_DICES; dice++) {
        row.push(
            <Col key={"dice" + dice}>
                <Pressable
                    key={"dice" + dice}
                    onPress={() => selectDice(dice)}
                    >
                  <MaterialCommunityIcons
                    name={board[dice]}
                    key={"dice" + dice}
                    size={50}
                    color={getDiceColor(dice)}
                    >
                  </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }

    const pointsRow = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={"pointsRow" + spot}>
                <Text key={"pointsRow" + spot}>{getSpotTotal(spot)}</Text>
            </Col>
        );
    }

    const pointToSelectRow = [];
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        pointToSelectRow.push(
        <Col key={"buttonsRow" + diceButton}>
            <Pressable 
                key={"buttonsRow" + diceButton}
                onPress={() => selectDicePoints(diceButton) }
            >
                <MaterialCommunityIcons 
                key={"buttonsRow" + diceButton}
                name={"numeric-" + (diceButton + 1) + "-circle"}
                size={35}
                color={getDicePointsColor(diceButton)}
                >
                </MaterialCommunityIcons>
            </Pressable>
        </Col>
        );
    }

    const selectDice = (i) => {
        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false : true;
        setSelectedDices(dices);
    }

    function getDiceColor(i) {
        return selectedDices[i] ? "black" : "#ea23dd"
    }

    function getDicePointsColor (i) {
        return selectedDicePoints[i] ? "black" : "#ea23dd"
    }

    const selectDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            let selected = [...selectedDices];
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            if (!selectedPoints[i]) {
                selectedPoints[i] = true;
                let nbrOfDices = 
                    diceSpots.reduce(
                        (total, x) => (x === (i + 1) ? total + 1 : total), 0);
                points[i] = nbrOfDices * (i + 1);
                setDicePointsTotal(points);
                setSelectedDicePoints(selectedPoints);
                setNbrOfThrowsLeft(NBR_OF_THROWS);
                return points[i];
            }
            else {
                setStatus("You already selected points for " + (i + 1));
            }
        }
        else {
            setStatus("Throw " + NBR_OF_THROWS + " times before setting points.")
        }
    }

    const throwDices = () => {
        let spots = [...diceSpots];
        for (let i = 0; i < NBR_OF_DICES; i++) {
          if (!selectedDices[i]) {
            let randomNumber = Math.floor(Math.random() * MAX_SPOT + 1);
            spots[i] = randomNumber;
            board[i] = 'dice-' + randomNumber;
          }
        }
        setDiceSpots(spots);
        setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
    }
    
    const checkWinner = () => {
        if (board.every((val, i, arr) => val === arr[0]) && nbrOfThrowsLeft > 0) {
          setStatus('You won');
        }
        else if (board.every((val, i, arr) => val === arr[0]) && nbrOfThrowsLeft === 0) {
          setStatus('You won, game over');
          setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        }
        else if (nbrOfThrowsLeft === 0) {
          setStatus('Game over');
          setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        }
        else {
          setStatus('Keep on throwing');
        }
      }

    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }

    return (
        <>
            <Header/>
            <View>
                <Container>
                    <Row style={styles.flex}>{row}</Row>
                </Container>
                <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
                <Text style={styles.gameinfo}>{status}</Text>
                <Pressable style={styles.button}
                    onPress={() => throwDices()}>
                    <Text>THROW DICES</Text>
                </Pressable>
                <Container>
                    <Row>{pointsRow}</Row>
                </Container>
                <Container>
                    <Row>{pointToSelectRow}</Row>
                </Container>
                <Text style={styles.gameinfo}>Player Name: {playerName}</Text>
            </View>
            <Footer />
        </>
    )
}