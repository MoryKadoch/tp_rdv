import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Scan from './Scan';
import List from './List';
import Rdv from './Rdv';

const Tab = createBottomTabNavigator();

function NavBottom() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Scan') {
            iconName = focused ? 'ios-barcode' : 'ios-barcode-outline';
          } else if (route.name === 'List') {
            iconName = focused ? 'ios-list' : 'ios-list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Scan" component={Scan} />
      <Tab.Screen name="List" component={List} />
      <Tab.Screen name="Rdv" component={Rdv} options={{
        tabBarButton: () => null
      }} />

    </Tab.Navigator>
  );
}

export default NavBottom;
