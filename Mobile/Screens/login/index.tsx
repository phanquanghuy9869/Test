import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { AuthsApi } from "../../api/endpoints";
import { useAppDispatch } from "../../app/hooks";
import OverlayComponent from "../../components/overlay/dialog";
import { loginSuccess, persistToken } from "./login.slice";

export const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [state, setState] = useState({
    user: "",
    password: "",
    messageVisible: false,
    messageContent: "",
    errors: {
      user: "",
      password: "",
    },
  });
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(resetAuthState);
  // }, [])

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      // dispatch(resetAuthState());
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const handeChangeUser = (value: string) => {
    const nextState = {
      ...state,
      user: value,
      errors: {
        ...state.errors,
        user:
          value != null && value.trim().length > 0
            ? ""
            : "Tài khoản không hợp lệ",
      },
    };
    setState(nextState);
  };

  const handleChangePassword = (value: string) => {
    const nextState = {
      ...state,
      password: value,
      errors: {
        ...state.errors,
        password:
          value != null && value.trim().length > 0
            ? ""
            : "Mật khẩu không hợp lệ",
      },
    };
    setState(nextState);
  };

  const submit = async () => {
    try {
      const response = await AuthsApi.login(state.user, state.password, true);
      const data = response.data;
      if (data.accessToken == null) {
        return;
      }
      dispatch(loginSuccess(data));
      await dispatch(persistToken(data));
      setTimeout(function () {
        navigation.navigate("vehicles");
      }, 500);      
    } catch (error: any) {
      setState({
        ...state,
        messageVisible: true,
        messageContent: error.message,
      });
      console.log(JSON.stringify(error));
    }
  };

  const toggle = () => {
    setState({ ...state, messageVisible: !state.messageVisible });
  };

  return (
    <View style={styles.container}>
      <Input
        value={state.user}
        placeholder="User"
        leftIcon={{ type: "font-awesome", name: "user" }}
        errorStyle={{ color: "red" }}
        errorMessage={state.errors.user}
        onChangeText={(value) => handeChangeUser(value)}
      />
      <Input
        value={state.password}
        placeholder="Password"
        secureTextEntry={true}
        leftIcon={{ type: "font-awesome", name: "lock" }}
        errorStyle={{ color: "red" }}
        errorMessage={state.errors.password}
        onChangeText={(value) => handleChangePassword(value)}
      />
      <View>
        <Button
          title="Log in"
          loading={false}
          loadingProps={{ size: "small", color: "white" }}
          buttonStyle={{
            backgroundColor: "rgba(78, 116, 289, 1)",
            borderRadius: 3,
          }}
          titleStyle={{ fontWeight: "bold", fontSize: 23 }}
          containerStyle={{
            marginHorizontal: 50,
            height: 50,
            width: 200,
            marginVertical: 10,
          }}
          onPress={submit}
        />
      </View>
      <OverlayComponent
        visible={state.messageVisible}
        message={state.messageContent}
        toggle={toggle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 40,
  },

  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,

    alignItems: "center",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },

  loginText: {},
});
