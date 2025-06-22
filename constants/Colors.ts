const primaryColor = '#4A90E2';
const secondaryColor = '#50E3C2';
const white = '#FFFFFF';
const black = '#000000';
const gray = '#9B9B9B';
const lightGray = '#F5F5F7';
const darkGray = '#4A4A4A';

export const Colors = {
  light: {
    text: darkGray,
    background: lightGray,
    tint: primaryColor,
    icon: gray,
    tabBar: gray,
    tabIconDefault: gray,
    tabIconSelected: primaryColor,
    card: white,
    secondary: secondaryColor,
    danger: '#E74C3C',
    success: '#2ECC71'
  },
  dark: {
    // Anda bisa mendefinisikan skema warna gelap di sini jika diperlukan
    text: white,
    background: black,
    tint: primaryColor,
    icon: lightGray,
    tabBar: darkGray,
    tabIconDefault: lightGray,
    tabIconSelected: primaryColor,
    card: darkGray,
    secondary: secondaryColor,
    danger: '#E74C3C',
    success: '#2ECC71'
  },
};