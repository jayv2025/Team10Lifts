import * as React from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  ScrollView,
  ImageBackground,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Button, Card, Text as PaperText } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

import { recipes } from '../lib/recipeData';
import { supabase } from '../lib/supabase';

const beginnerProgramImage = require('../assets/beginner.jpg');
const intermediateProgramImage = require('../assets/intermediate.jpg');
const advancedProgramImage = require('../assets/advanced.jpg');
const HOME_PROGRAMS = [
  {
    title: 'Beginner',
    subtitle: 'Start your fitness journey with simple workouts.',
    image: beginnerProgramImage,
  },
  {
    title: 'Intermediate',
    subtitle: 'Build strength, consistency, and better habits.',
    image: intermediateProgramImage,
  },
  {
    title: 'Advanced',
    subtitle: 'Push your limits with harder training plans.',
    image: advancedProgramImage,
  },
] as const;

const HOME_FEATURES = [
  {
    title: 'Track Your Workouts',
    description: 'Log exercises, sets, reps, and progress over time.',
  },
  {
    title: 'Follow Simple Programs',
    description: 'Choose beginner, intermediate, or advanced plans.',
  },
  {
    title: 'Eat With a Goal',
    description: 'View meal ideas that support strength and recovery.',
  },
] as const;

const HOME_STATS = [
  {
    number: '3',
    label: 'Training Levels',
  },
  {
    number: '4+',
    label: 'Recipe Ideas',
  },
  {
    number: 'AI',
    label: 'Fitness Support',
  },
] as const;

export default function HomeScreen({ navigation }: any) {
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [aiMessage, setAiMessage] = React.useState('');
  const [isAsking, setIsAsking] = React.useState(false);
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const recipePreview = recipes.slice(0, 3);

  async function handleAskJake() {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setAiMessage('Type a question for Jake first.');
      setAnswer('');
      return;
    }

    try {
      setIsAsking(true);
      setAiMessage('');

      const { data, error } = await supabase.functions.invoke('ask-jake', {
        body: {
          question: trimmedQuestion,
        },
      });

      if (error) {
        throw new Error(error.message || 'Unable to reach Jake right now.');
      }

      if (!data?.answer || typeof data.answer !== 'string') {
        throw new Error('Jake did not return a valid response.');
      }

      setAnswer(data.answer);
    } catch (error) {
      setAnswer('');
      setAiMessage(
        error instanceof Error
          ? error.message
          : 'Unable to reach Jake right now.'
      );
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroLabel}>Fitness made simple</Text>

          <Text style={styles.title}>Team 10 Lifts</Text>

          <Text style={styles.subtitle}>
            Stay strong, stay consistent, and build better fitness habits with
            workouts, recipes, and AI-powered support.
          </Text>

          <View
            style={[
              styles.heroButtonRow,
              { flexDirection: isDesktop ? 'row' : 'column' },
            ]}
          >
            <Button
              mode="contained"
              buttonColor="#5D00FF"
              textColor="white"
              style={styles.heroButton}
              onPress={() => navigation.navigate('Programs')}
            >
              View Programs
            </Button>

            <Button
              mode="outlined"
              textColor="#5D00FF"
              style={styles.outlineButton}
              onPress={() => navigation.navigate('Recipes')}
            >
              View Recipes
            </Button>
          </View>
        </View>

        {/* Stats Section */}
        <View
          style={[
            styles.statsGrid,
            { flexDirection: isDesktop ? 'row' : 'column' },
          ]}
        >
          {HOME_STATS.map((item, index) => (
            <View
              key={index}
              style={[
                styles.statBox,
                { width: isDesktop ? '31%' : '100%' },
              ]}
            >
              <Text style={styles.statNumber}>{item.number}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* About Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>What is Team 10 Lifts?</Text>

          <Text style={styles.bodyText}>
            Team 10 Lifts is a beginner-friendly fitness app designed to help
            users stay organized with their workouts, meal ideas, and progress.
            The goal is to make fitness feel simple, motivating, and easier to
            follow.
          </Text>
        </View>

        {/* Features */}
        <Text style={styles.sectionTitle}>Why Use Team 10 Lifts?</Text>

        <View
          style={[
            styles.cardGrid,
            { flexDirection: isDesktop ? 'row' : 'column' },
          ]}
        >
          {HOME_FEATURES.map((feature, index) => (
            <Card
              key={index}
              style={[
                styles.featureCard,
                { width: isDesktop ? '31%' : '100%' },
              ]}
            >
              <View style={styles.featureContent}>
                <PaperText variant="titleLarge" style={styles.featureTitle}>
                  {feature.title}
                </PaperText>

                <PaperText variant="bodyMedium" style={styles.featureText}>
                  {feature.description}
                </PaperText>
              </View>
            </Card>
          ))}
        </View>

        {/* Weekly Challenge */}
        <View style={styles.challengeSection}>
          <Text style={styles.challengeTitle}>Weekly Challenge</Text>

          <Text style={styles.challengeText}>
            Complete three workouts, drink enough water, and try one high-protein
            meal this week.
          </Text>

          <View style={styles.challengeList}>
            <Text style={styles.challengeItem}>• Complete 3 workouts</Text>
            <Text style={styles.challengeItem}>• Try 1 new recipe</Text>
            <Text style={styles.challengeItem}>• Stretch after training</Text>
          </View>
        </View>

        {/* Programs */}
        <Text style={styles.sectionTitle}>Programs</Text>

        <View
          style={[
            styles.cardGrid,
            { flexDirection: isDesktop ? 'row' : 'column' },
          ]}
        >
          {HOME_PROGRAMS.map((program, index) => (
            <Card
              key={index}
              style={[
                styles.card,
                { width: isDesktop ? '31%' : '100%' },
              ]}
            >
              <ImageBackground
                source={program.image}
                style={styles.cardBackground}
                imageStyle={styles.cardImage}
                resizeMode="cover"
              >
                <View style={styles.overlay}>
                  <PaperText variant="titleLarge" style={styles.cardTitle}>
                    {program.title}
                  </PaperText>

                  <PaperText variant="bodyMedium" style={styles.cardSubtitle}>
                    {program.subtitle}
                  </PaperText>

                  <Button
                    mode="contained"
                    buttonColor="#5D00FF"
                    textColor="white"
                    onPress={() => navigation.navigate('Programs')}
                    style={styles.button}
                  >
                    View Program
                  </Button>
                </View>
              </ImageBackground>
            </Card>
          ))}
        </View>

        {/* Recipes */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recipes</Text>

          <Button
            mode="text"
            textColor="#5D00FF"
            onPress={() => navigation.navigate('Recipes')}
          >
            See All
          </Button>
        </View>

        <View
          style={[
            styles.cardGrid,
            { flexDirection: isDesktop ? 'row' : 'column' },
          ]}
        >
          {recipePreview.map((recipe) => (
            <Card
              key={recipe.id}
              style={[
                styles.recipeOuterCard,
                { width: isDesktop ? '31%' : '100%' },
              ]}
            >
              <View style={styles.recipeCard}>
                <PaperText variant="titleLarge" style={styles.recipeTitle}>
                  {recipe.name}
                </PaperText>

                <PaperText variant="bodyMedium" style={styles.recipeCategory}>
                  {recipe.category}
                </PaperText>

                <PaperText variant="bodyMedium" style={styles.recipeDescription}>
                  {recipe.description}
                </PaperText>

                <Button
                  mode="contained"
                  buttonColor="#5D00FF"
                  textColor="white"
                  onPress={() => navigation.navigate('Recipes')}
                  style={styles.button}
                >
                  View Recipe
                </Button>
              </View>
            </Card>
          ))}
        </View>

        {/* AI Coach */}
        <View style={styles.aiSection}>
          <Text style={styles.aiTitle}>Ask Jake</Text>

          <Text style={styles.aiText}>
            Need workout advice, meal ideas, or help staying motivated? Ask the
            Team 10 AI coach.
          </Text>

          <TextInput
            style={styles.input}
            onChangeText={setQuestion}
            value={question}
            placeholder="Ask Jake about workouts, meals, or fitness..."
            placeholderTextColor="#5D00FF"
            keyboardType="default"
          />

          <Button
            mode="contained"
            buttonColor="#5D00FF"
            textColor="white"
            style={styles.askButton}
            onPress={handleAskJake}
            disabled={isAsking}
          >
            {isAsking ? 'Thinking...' : 'Ask Jake'}
          </Button>

          {isAsking ? (
            <ActivityIndicator
              color="#5D00FF"
              style={styles.aiLoadingIndicator}
            />
          ) : null}

          {answer ? (
            <View style={styles.answerCard}>
              <Text style={styles.answerTitle}>Jake says</Text>
              <Text style={styles.answerText}>{answer}</Text>
            </View>
          ) : null}

          {aiMessage ? <Text style={styles.aiMessage}>{aiMessage}</Text> : null}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },

  heroSection: {
    alignItems: 'center',
    paddingTop: 120,
    paddingBottom: 80,
  },

  heroLabel: {
    color: '#5D00FF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  title: {
    color: '#000000',
    fontFamily: 'Impact',
    letterSpacing: 3,
    fontSize: 76,
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    color: '#5D00FF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: 700,
    lineHeight: 28,
    marginBottom: 25,
  },

  heroButtonRow: {
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroButton: {
    borderRadius: 25,
    minWidth: 160,
  },

  outlineButton: {
    borderRadius: 25,
    borderColor: '#5D00FF',
    borderWidth: 2,
    minWidth: 160,
  },

  statsGrid: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 40,
  },

  statBox: {
    backgroundColor: '#5D00FF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },

  statNumber: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
  },

  statLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },

  infoSection: {
    backgroundColor: '#F3EEFF',
    borderRadius: 20,
    padding: 22,
    marginBottom: 35,
  },

  sectionTitle: {
    color: '#5D00FF',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 30,
    marginBottom: 15,
  },

  bodyText: {
    color: '#000000',
    fontSize: 16,
    lineHeight: 25,
  },

  cardGrid: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },

  featureCard: {
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
    marginBottom: 16,
  },

  featureContent: {
    padding: 20,
    minHeight: 170,
    justifyContent: 'center',
  },

  featureTitle: {
    color: '#000000',
    fontWeight: '800',
    marginBottom: 10,
  },

  featureText: {
    color: '#333333',
    fontSize: 15,
    lineHeight: 22,
  },

  challengeSection: {
    backgroundColor: '#000000',
    borderRadius: 22,
    padding: 24,
    marginTop: 30,
    marginBottom: 20,
  },

  challengeTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
  },

  challengeText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },

  challengeList: {
    backgroundColor: '#1F1F1F',
    borderRadius: 15,
    padding: 15,
  },

  challengeItem: {
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 8,
  },

  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },

  cardBackground: {
    minHeight: 250,
    justifyContent: 'flex-end',
  },

  cardImage: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 6,
  },

  cardSubtitle: {
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 22,
  },

  button: {
    borderRadius: 20,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  recipeOuterCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#EEEEEE',
  },

  recipeCard: {
    backgroundColor: '#EEEEEE',
    padding: 18,
    minHeight: 220,
    justifyContent: 'space-between',
  },

  recipeTitle: {
    color: '#000000',
    fontWeight: '800',
    marginBottom: 6,
  },

  recipeCategory: {
    color: '#5D00FF',
    fontWeight: '800',
    marginBottom: 8,
  },

  recipeDescription: {
    color: '#000000',
    fontSize: 15,
    marginBottom: 14,
    lineHeight: 22,
  },

  aiSection: {
    backgroundColor: '#F3EEFF',
    borderRadius: 22,
    padding: 24,
    marginTop: 35,
  },

  aiTitle: {
    color: '#000000',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },

  aiText: {
    color: '#000000',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },

  input: {
    color: '#5D00FF',
    fontSize: 14,
    fontWeight: '700',
    minHeight: 45,
    borderWidth: 2,
    borderColor: '#5D00FF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },

  askButton: {
    borderRadius: 25,
    marginTop: 12,
    alignSelf: 'flex-start',
  },

  aiLoadingIndicator: {
    marginTop: 14,
    alignSelf: 'flex-start',
  },

  answerCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9CCFF',
    borderRadius: 18,
    padding: 16,
  },

  answerTitle: {
    color: '#5D00FF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },

  answerText: {
    color: '#000000',
    fontSize: 15,
    lineHeight: 24,
  },

  aiMessage: {
    color: '#5D00FF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
  },
});
