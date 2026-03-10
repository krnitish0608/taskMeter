import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '@core/hooks/useAppDispatch';
import { useAppSelector } from '@core/hooks/useAppSelector';
import { login, clearError } from '@modules/auth/slices/authSlice';
import { AuthForm } from '@modules/auth/components/AuthForm';
import type { AuthStackParamList } from '@core/types/navigation';

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<LoginNavProp>();
  const { loading, error } = useAppSelector(state => state.auth);

  const handleLogin = useCallback(
    (email: string, password: string) => {
      dispatch(login({ email, password }));
    },
    [dispatch],
  );

  const goToSignUp = useCallback(() => {
    dispatch(clearError());
    navigation.navigate('SignUp');
  }, [dispatch, navigation]);

  return (
    <AuthForm
      title="Welcome Back"
      submitLabel="Log In"
      onSubmit={handleLogin}
      loading={loading}
      error={error}
      footerText="Don't have an account?"
      footerActionLabel="Sign Up"
      onFooterAction={goToSignUp}
    />
  );
};

export default LoginScreen;
