import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const steps = [
  {
    title: 'Chọn sản phẩm',
    description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.',
    image: require('../../../assets/images/splash1.png'), 
  },
  {
    title: 'Thêm vào giỏ hàng hoặc Mua ngay',
    description: 'Velit officia consequat duis enim velit mollit.',
    image: require('../../../assets/images/splash2.png'),
  },
  {
    title: 'Tiến hành đặt hàng và thanh toán',
    description: 'Complete your purchase quickly and easily.',
    image: require('../../../assets/images/splash3.png'),
  },
];

const SplashScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigation = useNavigation();

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate('HomeController');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>{currentStep + 1}/3</Text>
        <TouchableOpacity onPress={() => navigation.replace('HomeController')}>
          <Text>Bỏ qua</Text>
        </TouchableOpacity>
      </View>
      <Image source={steps[currentStep].image} style={styles.image} />
      <Text style={styles.title}>{steps[currentStep].title}</Text>
      <Text style={styles.description}>{steps[currentStep].description}</Text>
      <View style={styles.footer}>
        <Button title="Trước" onPress={prevStep} disabled={currentStep === 0} />
        <Button title="Sau" onPress={nextStep} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 20,
    
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default SplashScreen;
