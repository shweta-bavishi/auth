import React, { Component } from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase';
import { Header, Button, Spinner, Card, CardSection, Input } from './components/common';

class App extends Component {
  state = { loggedIn: null, email: '', password: '', error: '', name: '', loading: false, welcomeName: '' };
  componentWillMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyDwZYi5KtSAfYMdCg6l7QCE2fpHnV8Snjo',
      authDomain: 'authentication-ed272.firebaseapp.com',
      databaseURL: 'https://authentication-ed272.firebaseio.com',
      projectId: 'authentication-ed272',
      storageBucket: 'authentication-ed272.appspot.com',
      messagingSenderId: '955089042685'

  });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      this.setState({ loggedIn: true });
    } else {
       this.setState({ loggedIn: false });
    }
  });
}

onButtonPress() {
  const { email, password } = this.state;

  this.setState({ error: '', loading: true });

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(this.onLoginSuccess.bind(this))
    .catch(() => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(this.onUserCreate.bind(this))
        .catch(this.onLoginFail.bind(this));
    });
}

onLoginFail() {
  this.setState({ error: 'Authentication Failed', loading: false });
}

onUserCreate() {
  firebase.auth().currentUser.sendEmailVerification()
  .then(() => {
      console.log('Email Sent');
      })
  .catch(() => {
        console.log('Nothing');
      });
      this.onLoginSuccess();
}

onLoginSuccess() {
  this.setState({
    welcomeName: this.state.name,
    email: '',
    password: '',
    loading: false,
    error: '',
    loggedIn: true,
    name: ''
  });
}
loginForm() {
  return (
    <Card>
      <CardSection>
        <Input
          autoCorrect={false}
          label='Email'
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
      </CardSection>
      <CardSection>
        <Input
          autoCorrect={false}
          label='Name'
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
        />
      </CardSection>
      <CardSection>
        <Input
          secureTextEntry
          label='Password'
          autoCorrect={false}
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
        />
      </CardSection>

      <Text style={styles.errorTextStyle}>
        {this.state.error}
      </Text>

      <CardSection>
        {this.renderButton()}
      </CardSection>
    </Card>
  );
}

signOut() {
  firebase.auth().signOut();
}
renderButton() {
  if (this.state.loading) {
    return <Spinner size="small" />;
  }

  return (
    <Button onPress={this.onButtonPress.bind(this)}>
      Login
    </Button>
  );
}
renderContent() {
  switch (this.state.loggedIn) {
    case true:
    return (
      <Card>
      <CardSection>
        <Text style={styles.nameStyle}>Welcome Back {this.state.welcomeName} !!!!</Text>
      </CardSection>
      <CardSection>
        <Button onPress={this.signOut.bind(this)}>
        Log Out
        </Button>
      </CardSection>
      </Card>
    );
    case false: return (
      <View>
      {this.loginForm()}
      </View>
    );
    default: return <Spinner size="large" />;
  }
}

  render() {
    return (
    <View>
    <Header name="Authentication" />
    {this.renderContent()}
    </View>
  );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red',
  },
  nameStyle: {
    fontSize: 20,
  },
  inputStyle: {
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    height: 20,
    underlineColorAndroid: 'transperant',
    selectionColor: '#000000'
  },
};

export default App;
