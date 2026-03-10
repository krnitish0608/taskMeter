import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '@core/hooks/useAppDispatch';
import { useAppSelector } from '@core/hooks/useAppSelector';
import { signUp, clearError } from '@modules/auth/slices/authSlice';
import { AuthForm } from '@modules/auth/components/AuthForm';
import type { AuthStackParamList } from '@core/types/navigation';

type SignUpNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

const SignUpScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<SignUpNavProp>();
  const { loading, error } = useAppSelector(state => state.auth);

  const handleSignUp = useCallback(
    (email: string, password: string) => {
      dispatch(signUp({ email, password }));
    },
    [dispatch],
  );

  const goToLogin = useCallback(() => {
    dispatch(clearError());
    navigation.goBack();
  }, [dispatch, navigation]);

  return (
    <AuthForm
      title="Create Account"
      submitLabel="Sign Up"
      onSubmit={handleSignUp}
      loading={loading}
      error={error}
      footerText="Already have an account?"
      footerActionLabel="Log In"
      onFooterAction={goToLogin}
    />
  );
};

export default SignUpScreen;
