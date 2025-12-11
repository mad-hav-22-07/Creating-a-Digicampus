import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header background */}
      <View style={styles.header}>
      {/* Background square */}
      <View style={styles.headerBackground} />

      {/* Circle */}
      <View style={styles.circle} />

      {/* Title + Subtitle */}
      <View style={styles.headerTextBox}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

  {/* Image */}
  <Image
    source={require('../../assets/images/logo.png')}
    style={styles.illustration}
  />
</View>


      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        keyboardType="email-address"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#888"
      />

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  header: {
  backgroundColor: '#2D665F',
  height: 400,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  paddingTop: 70,
  marginBottom: 30,
  position: 'relative',
  width: '100%',
  paddingHorizontal: 10,
},
circle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#ffffff',
  marginBottom: 20,
  marginLeft: 20,
},
headerTextBox: {
  marginBottom: 20,
  marginLeft: 20,
},
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 0,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 20,
    color: '#f0f0f0',
    marginBottom: 10,
    textAlign: 'left',
  },
  illustration: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    position: 'absolute', 
    right: 5,           
    top: 200,              
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: 350,
    alignSelf: 'center',
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  forgot: {
    color: '#525559ff',
    textAlign: 'right',
    marginBottom: 20,
    paddingRight: 10,

  },
  button: {
    backgroundColor: '#2D665F',
    padding: 15,
    borderRadius: 10,
    width: 350,
    alignSelf: 'center',
    
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    
    
  },
});