import React from 'react'
import {View, Text, StyleSheet, Pressable} from 'react-native';    
import {Feather} from '@expo/vector-icons';
import Colors from '../../constants/Colors';

function AttractionListItem({ index, title,  subtitle,  onPressRow,
  onPressInfo }) {
  return (
      
      
      <View style={style.listContainer}>
 <Pressable
      onPress={onPressRow}
      style={({ pressed }) => [
        style.container,
        pressed && style.pressed,
      ]}
    >
            <Text>{index}</Text>
           <Text>{title}</Text>
            <Text>{subtitle}</Text>
    </Pressable>
 
    
    <Pressable onPress={onPressInfo} hitSlop={8}>
    <View style={style.listIcons}>
    <Feather name="info" size={16} color={Colors.accent600} />
    <Feather name="plus-circle" size={16} color={Colors.accent600} />
    </View>
    </Pressable>
    </View>
  )
}

export default AttractionListItem

const style = StyleSheet.create({

    listContainer: {
        height: 40,
        marginVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: Colors.gray200,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    listIcons: {
            flexDirection: 'row',
            gap: 12,
        }
    

});
