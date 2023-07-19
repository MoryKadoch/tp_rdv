import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const List = () => {
    const navigation = useNavigation();
    const [data, setData] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            axios.get('http://10.74.3.105:5000/list')
                .then((response) => {
                    console.log(response.data);
                    setData(response.data);
                }
                );
        }, [])
    );

    const renderItem = ({ item }) => {
        const userData = item.data.results[0];

        return (
            <TouchableOpacity 
                style={styles.item} 
                onPress={() => navigation.navigate('Rdv', { user: item.id })}
            >
                <Image style={styles.image} source={{ uri: userData.picture.large }} />
                <View style={styles.textContainer}>
                    <Text style={styles.id}>ID: {item.id}</Text>
                    <Text style={styles.name}>Name: {userData.name.first} {userData.name.last}</Text>
                    <Text style={styles.email}>Email: {userData.email}</Text>
                    <Text style={styles.location}>Location: {userData.location.country}</Text>
                    <Text style={styles.age}>Age: {userData.dob.age}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: '#D3D3D3',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    textContainer: {
        marginLeft: 10,
        justifyContent: 'space-around',
    },
    id: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 16,
    },
    email: {
        fontSize: 14,
        color: 'blue',
        width: 180,
    },
    location: {
        fontSize: 14,
    },
    age: {
        fontSize: 14,
    }
});

export default List;
