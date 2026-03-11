import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@themes/ThemeContext';
import type { AuthStackParamList } from '@core/types/navigation';

const LoginScreen = React.lazy(
  () => import('@modules/auth/screens/LoginScreen'),
);
const SignUpScreen = React.lazy(
  () => import('@modules/auth/screens/SignUpScreen'),
);

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};
