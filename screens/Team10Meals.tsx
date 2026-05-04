import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { recipes } from '../lib/recipeData';

export default function Team10Meals() {
  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: 60,
        }}
      >
        <Text
          style={{
            color: '#5D00FF',
            fontSize: 28,
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          Meals
        </Text>

        <Text
          style={{
            color: '#5D00FF',
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          Browse simple meal ideas that support strength, recovery, and consistency.
        </Text>

        {recipes.map((meal) => (
          <View
            key={meal.id}
            style={{
              backgroundColor: '#5D00FF',
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: '700',
                marginBottom: 4,
              }}
            >
              {meal.name}
            </Text>

            <Text
              style={{
                color: '#5D00FF',
                fontSize: 14,
                fontWeight: '700',
                marginBottom: 8,
              }}
            >
              {meal.category}
            </Text>

            <Text style={{ color: 'black', fontSize: 16 }}>
              {meal.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
