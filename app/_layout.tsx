import { Slot } from 'expo-router';
import "../global.css"
import { LoaderProvider } from '../context/LoaderContext';
import { AuthProvider } from '@/context/authContext';

export default function RootLayout() {
  return (

    <LoaderProvider>
      <AuthProvider>
        <Slot/>
      </AuthProvider>
    </LoaderProvider>
    
   
   
    );
}
