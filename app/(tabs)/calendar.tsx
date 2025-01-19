import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Calendar } from 'react-native-calendars';
import { fetchUpcomingEvents } from '@/src/api/league';
import { UpcomingEvent } from 'shared';
import { useNotifications } from '@/src/hooks/toast';
import { DateData, MarkedDates } from 'react-native-calendars/src/types';
import { groupBy } from '@/src/utils';
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

type CalendarDate = string;

export default function CalendarScreen() {
  const [upcomingEvents, setUpcomingEvents] = useState<Partial<Record<CalendarDate, UpcomingEvent[]>>>({});
  const isFocused = useIsFocused();

  const router = useRouter();
  const { showError } = useNotifications();


  const handleCalendarDetailRouting = (date: string) => {
    console.log('Item pressed, navigating to calendar detail view with date:', date);
    router.push({
      pathname: "/pages/calendar_detail_page",
      params: { entityName: date },
    });
  };

  useEffect(() => {
    fetchUpcomingEvents()
      .then(upcomingEvents => {
        let groups = groupBy(upcomingEvents, x => new Date(x.timestamp).toISOString().substring(0, 10));
        setUpcomingEvents(groups);
      })
      .catch(showError);
  }, [isFocused]);

  const markedDates = useMemo<MarkedDates>(() => {
    return Object.fromEntries(Object.entries(upcomingEvents)
      .map(([date, data]) => [date, {
        marked: true,
        dotColor: 'red',
      } satisfies MarkingProps]));
  }, [upcomingEvents]);

  const handleDayPress = (data: DateData) => {
    console.log('Selected day:', data.dateString);
    const dayData = upcomingEvents[data.dateString];
    handleCalendarDetailRouting(data.dateString);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title">Calendar</ThemedText>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
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