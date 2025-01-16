import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Calendar } from 'react-native-calendars';

export default function HomeScreen() {
  const handleDayPress = (day: { dateString: string; }) => {
    console.log('Selected day:', day.dateString);
    // TODO: Logic für die einzelnen Tage
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title">Calendar</ThemedText>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            '2025-01-10': { selected: true, marked: true, selectedColor: 'blue' },
            '2025-01-15': { marked: true, dotColor: 'red' },
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: 'orange',
            monthTextColor: 'blue',
            indicatorColor: 'blue',
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  calendarContainer: {
    marginTop: 16,
  },
});