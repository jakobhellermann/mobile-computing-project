import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { Button, ScrollView, StyleSheet, TextInput, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

export default function HomeScreen() {

  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title">Login</ThemedText>

      <Card style={{ gap: 16 }}>
        <View>
          <ThemedText>E-Mail</ThemedText>
          <TextInput
            placeholder='E-Mail Address'
            placeholderTextColor={"#cecece"}
            style={styles.input}
          />
        </View>
        <View>
          <ThemedText>Password</ThemedText>
          <TextInput
            placeholder='Password'
            placeholderTextColor={"#cecece"}
            style={styles.input}
          />
        </View>
        <ThemedText type='link'>Forgot password?</ThemedText>
        <CustomButton title="Sign in"
        />
        <CustomButton title="Sign Up"
        />

      </Card>
    </ScrollView >
  );
}

function CustomButton({ title, ...rest }: { title: string; } & TouchableOpacityProps) {
  return <TouchableOpacity
    style={{
      backgroundColor: "#2c2c2c",
      padding: 8,
      borderRadius: 6,
      alignItems: 'center'
    }}
    {...rest}
  >
    <ThemedText style={{ color: '#fff' }}>{title}</ThemedText>
  </TouchableOpacity>;

}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#ffffff",
    padding: 8,
    borderWidth: 1,
    borderColor: "#cecece",
    borderRadius: 4,
  },
  button: {
    backgroundColor: "#ffffff",
    padding: 8,
    borderWidth: 1,
    borderColor: "#cecece",
    borderRadius: 4,
  },
  container: {
    padding: 16,
  },
  cardList: {
    gap: 8,
  },
});
