import React from "react"
import { Stack } from "expo-router"


//app ek athule navigation walata use wenwa
const HomeLayout = () => {
  return (
  <Stack screenOptions={{animation: "slide_from_right"}}>
     <Stack.Screen name="index" options={{ headerShown: false}} />
     <Stack.Screen name="[id]" options={{title: "Book Detail Form", headerShown: false}}/>
  </Stack>
  )
}

export default HomeLayout