import { Text, View } from "react-native";
import Header from './Header';
import Footer from './Footer';
import styles from "../style/style";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default Scoreboard = ( { navigation }) => {
    return(
        <>
            <Header />
            <View style={styles.gameinfo}>
                <Text style={styles.gameinfo}>You did really well! Unfortunately I cannot show you your scores here :(</Text>
            </View>
            <Footer />
        </>
    )
}