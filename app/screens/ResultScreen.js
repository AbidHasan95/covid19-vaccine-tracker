import React, { useState, useEffect } from 'react';
import {
    Alert,
    View,
    Text,
    StatusBar,
    StyleSheet,
    SectionList,
    ImageBackground,
    Modal,
    Pressable,
    Button
} from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid4 } from 'uuid';
// const { uuid } = require('uuidv4');

function parseTime(timeStr) {
    // return timeStr;
    var date = new Date(`01-01-20T${timeStr}`);
    // var date = new Date();
    // console.log(date, `01-01-2000 ${timeStr}`);
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    // minutes = minutes < 10 ? '0'+minutes : minutes;
    minutes = ('0' + minutes).slice(-2);
    timeStr = hours + ':' + minutes + ' ' + ampm;
    return timeStr;
}

const formatData = (jsondata) => {
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // December 2, 2021 Thursday 
    var vacSlots = {}
    // console.log(jsondata)
    // console.log("------", jsondata);
    var id = 0
    for (var center of jsondata.centers) {
        // console.log(center.name)

        for (var slot of center.sessions) {
            // console.log(slot);
            try {
                var date = slot.date;
            }
            catch (err) {
                console.log("The errrorrrrrrr", err, slot.date);
            }
            var date = date.substring(6,) + date.substring(2, 6) + date.substring(0, 2)
            // console.log(date, typeof (date));
            var date = new Date(date);
            // console.log(date, typeof (date));
            // id += 1;
            var entry = {
                "id": uuid4(),
                "name": center.name,
                "address": center.address,
                "block_name": center.block_name,
                "pincode": String(center.pincode),
                "timing": parseTime(center.from) + " - " + parseTime(center.to),
                "fee": center.fee_type,
                "vaccine": slot.vaccine,
                "slots": slot.slots,
                "min_age": String(slot.min_age_limit),
            };
            if (date in vacSlots) {
                vacSlots[date].push(entry);
            }
            else {
                vacSlots[date] = [entry];
            }
        }
    }
    // console.log(vacSlots);
    var data = [];
    var dates = Object.keys(vacSlots);
    dates = dates.sort((a, b) => (new Date(a)) - (new Date(b)));
    // console.log(dates, typeof (dates[0]));
    for (var slotDate of dates) {
        // var slotDate = new Date("05-05-2021");
        slotDate = new Date(slotDate);
        var m = monthNames[slotDate.getMonth()];
        var day = dayNames[slotDate.getDay()];
        var d = slotDate.getDate();
        var y = slotDate.getFullYear();
        var dateHeader = `${m} ${d},${y} ${day}`;
        var newEntry = { "date": dateHeader, "data": vacSlots[slotDate] };
        data.push(newEntry);
    }
    return data;
}



function NoData({ message }) {
    return (<View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{message}</Text>
    </View>);
}

const renderEntry = ({ item }) => {
    return (
        <Entry props={item} />
    );
}

function ResultScreen({ navigation, route }) {
    var [isLoading, setloading] = useState(true);
    var [data, setData] = useState([]);
    // var [modalVisible, setModalVisible] = useState(false);


    function Entry({ props }) {
        // console.log("props", props.address);
        return (
            <View style={styles.entry}>
                <View style={styles.row}>
                    <View style={styles.dataView}>
                        <Text style={styles.entryText} >Name: {props.name}</Text>
                    </View>
                    <View style={styles.dataView}>
                        <Text style={styles.entryText}>Address: {props.address}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.dataView}>
                        <Text style={styles.entryText}>Block: {props.block_name}</Text>
                    </View>
                    <View style={styles.dataView}>
                        <Text style={styles.entryText}>Pincode: {props.pincode}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.dataView}>
                        <Text style={styles.entryText}>Timing: {props.timing}</Text>
                    </View>
                    <View style={styles.dataView}>
                        <Text style={styles.entryText}>Fee: {props.fee}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.dataView}>
                        <Text style={styles.entryText}>Vaccine: {props.vaccine}</Text>
                    </View>
                    <View style={styles.dataView}>
                        <Text style={styles.entryText}>Min Age: {props.min_age}</Text>
                    </View>
                </View>
                {/* <View>
                    <Button title="Press me" onPress={() => setModalVisible(!modalVisible)} />
                </View> */}

            </View>
        );
    }
    const getData = async () => {
        try {
            var url1 = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=737&date=17-05-2021";
            var url2 = "https://ron-swanson-quotes.herokuapp.com/v2/quotesrrr";
            let response1 = await fetch(url1).then((response) => { return response.json(); }).then((json) => { setData(formatData(json)); setloading(false); }).catch((error) => console.log(error));
            // let response1 = await fetch(url1).then((response) => response.text()).then((response) => console.log(response)).then((response) => { return require('./sample_response.json'); }).then((response) => { setData(formatData(response)); setloading(false); }).catch((error) => console.log(error));
            // let response1 = await fetch(url1).then((response) => { return response.json(); }).then((response) => { return setData(formatData(response)); }).catch((error) => console.log(error));
            // let json = response;
            // console.log(response1, Platform.OS);
            return response1;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {

        var dist_id = route.params.District_id;
        var date = new Date();
        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();
        date = `${day}-${month}-${year}`;

        var url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${dist_id}&date=${date}`;
        var url1 = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=737&date=17-05-2021";
        var url2 = "https://ron-swanson-quotes.herokuapp.com/v2/quotesrrr";
        let response1 = fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'user-agent': 'Chrome/90.0.4430.93 Safari/537.36',
            }
        }).then((response) => { return response.json(); }).then((json) => { setData(formatData(json)); setloading(false); }).catch((error) => console.log(error));
        // var data2 = require('./sample_response.json');
        // setData(formatData(data2));
        // setloading(false);
    }, []);
    return (
        <ImageBackground style={styles.background}
            source={require("../assets/background.jpg")}>
            <View style={{
                marginTop: StatusBar.currentHeight,
            }}>
                <View style={styles.centeredView}>
                    {/* <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Hello World!</Text>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.textStyle}>Hide Modal</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal> */}
                </View>
                {isLoading ? (<NoData message={"Loading..."} />) :
                    (data.length ? (<SectionList
                        sections={data}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item }) => <Entry props={item} />}
                        stickySectionHeadersEnabled={true}
                        renderSectionHeader={({ section: { date } }) => (<View style={styles.headerContainer}><Text style={styles.headerText}>{date}</Text></View>)}
                    />) : (<NoData message={"No data available"} />)
                    )
                }
            </View>
        </ImageBackground>

    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    column: {
        flex: 1,
        flexDirection: "column"
    },
    row: {
        flex: 1,
        flexDirection: "row",
        borderColor: "green",
        // borderWidth: 1,
        // minHeight: "auto",
    },
    dataView: {
        flex: 1,
        padding: 5,
        borderColor: "yellow",
        // borderWidth: 1
    },
    entryText: {
        // height: 20
        borderColor: "purple",
        // borderWidth: 1,
    },
    entry: {
        // width: "100%",
        minHeight: 150,
        borderWidth: 2,
        borderColor: "green",
        flexDirection: "column",
        padding: 10,
        // margin:10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5
        // justifyContent: "center",
        // alignItems: "center"
    },
    headerText: {
        textAlign: "center",
        color: "white",
        // borderWidth:1,
        textShadowRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: "gray",
        opacity: 0.8,

    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: "center",
        padding: 5,

    },
    background: {
        height: "100%"

    }
});
export default ResultScreen;