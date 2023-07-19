import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';
import * as Calendar from 'expo-calendar';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Rdv = ({ route }) => {
    const { user } = route.params;
    const [userData, setUserData] = useState(null);
    const [calendars, setCalendars] = useState([]);
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16).replace('T', ' '));
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 16).replace('T', ' '));

    useEffect(() => {
        (async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
                const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
                setCalendars(calendars);
            }
        })();
    }, []);

    useEffect(() => {
        axios.get(`http://10.74.3.105:5000/user/${user}`)
            .then(response => {
                setUserData(response.data);
                setTitle('Rendez-vous avec ' + response.data.data.results[0].name.first);
                console.log(response.data.data.results[0].location.coordinates.latitude);
                console.log(response.data.data.results[0].location.coordinates.longitude);
            })
            .catch(error => {
                console.error("There was an error retrieving the user data: ", error);
            });
    }, [user]);

    const addEvent = async () => {
        const eventStartDate = new Date(startDate);
        const eventEndDate = new Date(endDate);
        const calendar = await Calendar.createEventAsync(calendars[0].id, {
            title: title,
            startDate: eventStartDate,
            endDate: eventEndDate,
            timeZone: 'Europe/Paris',
        });
        alert('Event created');
    };

    if (userData === null) {
        return;
    }

    if (userData.data.results[0] === undefined) {
        return (
            <View style={styles.container}>
                <Text>No data found</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image style={styles.image} source={{ uri: userData.data.results[0].picture.large }} />
            <MapView
                key={userData.data.results[0].location.coordinates.latitude + userData.data.results[0].location.coordinates.longitude}
                style={styles.map}
                initialRegion={{
                    latitude: parseFloat(userData.data.results[0].location.coordinates.latitude),
                    longitude: parseFloat(userData.data.results[0].location.coordinates.longitude),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: parseFloat(userData.data.results[0].location.coordinates.latitude),
                        longitude: parseFloat(userData.data.results[0].location.coordinates.longitude),
                    }}
                    title={userData.data.results[0].name.first}
                    description={userData.data.results[0].location.country}
                />
            </MapView>
            <Text style={styles.info}>Name: {userData.data.results[0].name.first} {userData.data.results[0].name.last}</Text>
            <Text style={styles.info}>Gender: {userData.data.results[0].gender}</Text>
            <Text style={styles.info}>Email: {userData.data.results[0].email}</Text>
            <Text style={styles.info}>Location: {userData.data.results[0].location.country}</Text>
            <Text style={styles.info}>City: {userData.data.results[0].location.city}</Text>
            <Text style={styles.info}>Age: {userData.data.results[0].dob.age}</Text>
            <Text style={styles.info}>Phone: {userData.data.results[0].phone}</Text>
            <Text style={styles.info}>Cell: {userData.data.results[0].cell}</Text>
            <Text style={styles.info}>Street: {userData.data.results[0].location.street.name} {userData.data.results[0].location.street.number}</Text>
            <Text style={styles.info}>Postcode: {userData.data.results[0].location.postcode}</Text>
            <Text style={styles.info}>State: {userData.data.results[0].location.state}</Text>
            <Text style={styles.info}>Registered: {userData.data.results[0].registered.date}</Text>

            <Text style={styles.title}>Add event to calendar</Text>
            <TextInput style={styles.input} placeholder="Title" onChangeText={setTitle} value={title} />
            <TextInput style={styles.input} placeholder="Start date (YYYY-MM-DD HH:MM)" onChangeText={setStartDate} value={startDate} />
            <TextInput style={styles.input} placeholder="End date" onChangeText={setEndDate} value={endDate} />
            <Button title="Add event" onPress={addEvent} />

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    info: {
        fontSize: 14,
    },
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    map: {
        width: '100%',
        height: 300,
    },
});

export default Rdv;
