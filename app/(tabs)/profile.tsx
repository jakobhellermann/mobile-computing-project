import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, TextInput, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { useRegister } from '@/src/hooks/register';
import { useLogin } from '@/src/hooks/login';
import { useAuth } from '@/src/modules/auth/context';
import { User } from 'shared';
import { Link, useRouter } from 'expo-router';
import { useNotifications } from '@/src/hooks/toast';

export default function ProfileScreen() {
  const { user } = useAuth();

  if (!user) return <LoginScreen />;
  else return <LoggedInScreen user={user} />;
}

function LoggedInScreen({ user }: { user: User; }) {
  const { logout } = useAuth();
  const router = useRouter();

  const { showError } = useNotifications();

  const handleNotificationRouting = () => {
    router.push({
      pathname: "/pages/subscriptions_page",
    });
  };

  return <View style={styles.loggedIncontainer}>
    <View>
      <Text style={{ fontSize: 20 }}>Welcome back,</Text>
      <ThemedText style={{ fontSize: 20 }} type='defaultSemiBold'>{user.email}</ThemedText>
      <Text style={{ fontSize: 20 }}>
        Check out the <Link style={{ color: "#636298", fontWeight: "500" }} href={"/(tabs)/calendar"}>Calendar</Link> tab for your upcoming matches; or visit
        the <Link style={{ color: "#636298", fontWeight: "500" }} href={"/(tabs)/calendar"}>Feed</Link> to find out what's happening!
      </Text>
    </View>

    <View style={styles.buttons}>
      <CustomButton title='Manage Subscriptions' onPress={handleNotificationRouting} />
      <CustomButton title='Logout' onPress={() => logout().catch(showError)} />
    </View>
  </View>;

}

const EXAMPLE_EMAIL = "testuser-normal@example.de";
const EXAMPLE_PASSWORD = "normalpwd";

function LoginScreen() {
  const { register } = useRegister();
  const { login } = useLogin();

  const [email, setEmail] = useState(EXAMPLE_EMAIL);
  const [password, setPassword] = useState(EXAMPLE_PASSWORD);

  const onPressRegister = () => register(email, password);;
  const onPressLogin = () => login(email, password);

  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title">Login</ThemedText>

      <Card style={{ gap: 16 }}>
        <View>
          <ThemedText>E-Mail</ThemedText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder='E-Mail Address'
            placeholderTextColor={"#cecece"}
            style={styles.input}
          />
        </View>
        <View>
          <ThemedText>Password</ThemedText>
          <TextInput
            value={password}
            secureTextEntry={true}
            onChangeText={setPassword}
            placeholder='Password'
            placeholderTextColor={"#cecece"}
            style={styles.input}
          />
        </View>
        <CustomButton title="Sign in"
          onPress={onPressLogin}
        />
        <CustomButton title="Sign Up"
          onPress={onPressRegister}
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
  loggedIncontainer: {
    padding: 16,
    justifyContent: "space-between",
    flexDirection: "column",
    height: "100%",
  },
  container: {
    padding: 16,
    flexDirection: "column",
  },
  cardList: {
    gap: 8,
  },
  buttons: {
    padding: 8,
    width: "70%",
    gap: 8,
    alignSelf: "flex-end",
  }
});
