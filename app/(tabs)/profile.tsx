import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { useRegister } from '@/src/hooks/register';
import { useLogin } from '@/src/hooks/login';
import { useAuth } from '@/src/modules/auth/context';
import { User } from 'shared';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useAuth();

  if (!user) return <LoginScreen />;
  else return <LoggedInScreen user={user} />;
}

function LoggedInScreen({ user }: { user: User; }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleNotificationRouting = () => {
    router.push({
      pathname: "/pages/subscriptions_page",
    });
  };

  return <View style={styles.container}>
    <ThemedText>Logged in as {user.email}</ThemedText>

    <View style={{ gap: 8 }}>
      <CustomButton title='Manage Subscriptions' onPress={handleNotificationRouting} />
      <CustomButton title='Logout' onPress={logout} />
    </View>
  </View>;

}

const EXAMPLE_EMAIL = "testuser-normal@example.de";
const EXAMPLE_PASSWORD = "normalpwd";

function LoginScreen() {
  const { register, error: registerError } = useRegister();
  const { login, error: loginError } = useLogin();

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
        <ThemedText type='link'>Forgot password?</ThemedText>
        <CustomButton title="Sign in"
          onPress={onPressLogin}
        />
        <CustomButton title="Sign Up"
          onPress={onPressRegister}
        />
        <ThemedText type='default'>{loginError ?? registerError}</ThemedText>

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
