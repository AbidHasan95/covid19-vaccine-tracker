import React, { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { ImageBackground, View, StyleSheet, Image, FlatList, Text, TouchableHighlight, Button, TouchableWithoutFeedback } from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
// https://stackoverflow.com/questions/45868284/how-to-get-currently-visible-index-in-rn-flat-list
// https://stackoverflow.com/questions/51514911/scrolltoindex-not-working-react-native-on-a-flatlist/51516851
const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
        district_name: 'Burdwan',
        district_id: 1
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
        district_name: 'Burdwan1',
        district_id: 2
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        district_name: 'Burdwan3',
        district_id: 3
    },
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3xd53abb28ba',
        title: 'Fourth Item',
        district_name: 'Burdwan4',
        district_id: 4
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbh91aa97f63',
        title: 'Fifth Item',
        district_name: 'Burdwan5',
        district_id: 5
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e2yd72',
        title: 'Sixth Item',
        district_name: 'Burdwan6',
        district_id: 6
    },
];





function WelcomeScreen({ navigation }) {
    const states = require('../data/states_districts1.json');
    const [currState, setCurrState] = useState("");
    const [dist, setDist] = useState(-1);
    const [distList, setdistList] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [refresh, setRefresh] = useState(false);
    // var flatlistRef = useRef(null);
    var flatlistRef = null;

    var states_list = Object.keys(states).sort((a, b) => a - b);
    // console.log(states[currState]);

    const StateItem = ({ props, textColor, textBackgroundColor }) => (
        <TouchableWithoutFeedback onPress={() => {

            setRefresh(true);
            const doAction = async () => {
                if (currState != props) {
                    setButtonDisabled(true);

                }
                setCurrState(props);
                setdistList(states[props].districts);
                setRefresh(false);
                if (flatlistRef != null & distList.length != 0) {
                    // console.log("hereeeeee");
                    flatlistRef.scrollToIndex({ index: 0, animated: false });
                }

                setDist(-1);
            };
            doAction();
        }}>
            <View style={[styles.item, textBackgroundColor]}>
                <Text style={[styles.title, textColor]}>{props}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    const renderState = ({ item }) => {
        if (item == currState) {
            var color = "white";
            var backgroundColor = "teal";
        }
        else {
            var color = "black";
            var backgroundColor = null;
        }
        // console.log(item);

        return (<StateItem props={item} textColor={{ color }} textBackgroundColor={{ backgroundColor }} />);
    }

    const DistItem = ({ props, textColor, textBackgroundColor }) => (
        <TouchableWithoutFeedback onPress={() => {
            const doAction = async () => {
                setDist(props.district_id);
                setButtonDisabled(false);
            };
            doAction();
        }}>
            <View style={[styles.item, textBackgroundColor]}>
                <Text style={[styles.title, textColor]}>{props.district_name}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    const renderDist = ({ item }) => {
        if (item.district_id === dist) {
            var color = "white";
            var backgroundColor = "teal";
            // console.log("I am here1", item.district_id);
        }
        else {
            var color = "black";
            var backgroundColor = null;
            // console.log("I am here2");
        }
        return (<DistItem props={item} textColor={{ color }} textBackgroundColor={{ backgroundColor }} />);
    }

    return (
        <ImageBackground style={styles.background}
            source={require("../assets/background.jpg")}>

            {/* <Image style={styles.logo} source={require("../assets/covid_logo4.png")} /> */}
            <View style={styles.container}>
                <View style={{ width: 100, height: 100, alignSelf: "center", marginBottom: 50 }}>
                    <Image style={styles.logo2} source={require("../assets/covid_logo4.png")} />
                </View>

                <View style={{ width: "80%", alignSelf: "center", marginBottom: 50 }}>
                    <Text style={{ textAlign: "center", alignSelf: "center", fontSize: 17, fontWeight: "bold" }}>Choose state and district to fetch available slots in the next 7 days</Text>
                </View>

                <View style={styles.statesStyle}>
                    <FlatList
                        data={states_list}
                        snapToAlignment={'center'}
                        snapToInterval={150}
                        // decelerationRate={'fast'}
                        pagingEnabled={true}
                        renderItem={renderState}
                        keyExtractor={item => String(states[item].state_id)}
                        horizontal={true}
                        viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}

                    />
                </View>
                <View style={styles.districtsStyle}>
                    {/* <Text>{currState}</Text> */}
                    <FlatList
                        data={distList}
                        renderItem={renderDist}
                        snapToInterval={100}
                        refreshing={refresh}
                        keyExtractor={item => String(item.district_id)}
                        horizontal={true}
                        extraData={currState}
                        ref={ref => { flatlistRef = ref }}
                        initialScrollIndex={0}
                    />
                </View>
                <View style={{ width: "100%", alignItems: "center", flexDirection: "row", justifyContent: "center" }}>

                    <Button
                        title="View Available Slots"
                        style={styles.submitButton}

                        disabled={buttonDisabled}
                        onPress={() => navigation.navigate('SlotResults', { "State_name": currState, "District_id": dist })}
                    />

                </View>
                {/* <TouchableHighlight onPress={() => console.log("pressed")} disabled={true}>
                    <View>
                        <Text>Hello</Text>
                    </View>
                </TouchableHighlight> */}
            </View>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    statesStyle: {
        width: "100%",
        height: 70,
        marginBottom: 20
        // backgroundColor: "darkgreen",
        // opacity: 0.4
    },
    districtsStyle: {
        width: "100%",
        height: 70,
        marginBottom: 20
        // backgroundColor: "green"
    },
    logo: {
        width: "30%",
        height: "15%",
        resizeMode: "center",
        // borderWidth: 2,
        borderColor: "blue",
        top: "20%",
        position: "absolute"
    },
    logo2: {
        width: "100%",
        height: "100%",
        resizeMode: "center",
        // borderWidth: 2,
        borderColor: "blue",
        // top: "20%",
        // position: "absolute"
    },
    item: {
        // backgroundColor: "cyan",
        marginHorizontal: 10,
        minWidth: 70,
        maxWidth: 110,
        height: "100%",
        // flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 10
        // borderColor: "red",
        // borderWidth: 2

    },
    title: {
        color: "black",
        borderColor: "red",
        // borderWidth: 2
        textAlignVertical: "center",
        textAlign: "center"
    },
    distItem: {
        borderWidth: 2,
        borderColor: "black",
        alignItems: "center"
    },
    container: {
        bottom: "20%"
    },
    selectedItem: {
        color: "white",
        backgroundColor: "teal"
    },
    nonSelected: {
        color: "red"
    },
    submitButton: {
        width: 200,
        alignSelf: "center",

    }
})
export default WelcomeScreen;