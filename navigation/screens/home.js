import * as React from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={() => alert('This is the Home Screen!')}>
                Home Screen!
            </Text>

        </View>


    )
}

