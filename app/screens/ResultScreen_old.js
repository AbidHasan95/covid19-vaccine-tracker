import React from 'react';
import { View, Text, StatusBar, StyleSheet, FlatList } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid4 } from 'uuid';
// const { uuid } = require('uuidv4');

const formatData = (jsondata) => {
    var vacSlots = {}
    // console.log(jsondata)
    console.log("------");
    var id = 0
    for (var center of jsondata.centers) {
        // console.log(center.name)

        for (var slot of center.sessions) {
            // console.log(slot);
            date = slot.date;
            date = date.substring(6,) + date.substring(2, 6) + date.substring(0, 2)
            // console.log(date, typeof (date));
            date = new Date(date);
            // console.log(date, typeof (date));
            id += 1;
            entry = {
                "id": uuid4(),
                "name": center.name,
                "address": center.address,
                "block_name": center.block_name,
                "pincode": String(center.pincode),
                "timing": center.from + " - " + center.to,
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
    return vacSlots;
}

function Entry({ props }) {
    console.log("props", props.address);
    return (
        <View style={{
            // width: "100%",
            minHeight: 150,
            borderWidth: 2,
            borderColor: "green",
            flexDirection: "column",
            // justifyContent: "center",
            // alignItems: "center"
        }}>
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

        </View>
    );
}

const renderEntry = ({ item }) => {
    return (
        <Entry props={item} />
    );
}

// function ResultScreen({ navigation, route }) {
function ResultScreen({ navigation }) {
    var data = require('./sample_response.json');
    // console.log(data)
    data1 = formatData(data);
    console.log(Object.keys(data1));
    dates = Object.keys(data1)
    dates = dates.sort((a, b) => a - b)
    testData = data1[dates[0]];
    console.log("testdata", testData, "testttt", testData.length);
    return (
        <View style={{
            marginTop: StatusBar.currentHeight,
        }}>
            {/* <Text>Hello {route.params.State_name} and {route.params.District_id}</Text> */}
            <Text>Hello</Text>
            <FlatList
                data={testData}
                renderItem={renderEntry}
                keyExtractor={item => item.id}
            />

        </View>

    );
}

const styles = StyleSheet.create({
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
    }
});
export default ResultScreen;