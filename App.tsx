import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

type Flashcard = {
  id: number;
  question: string;
  answer: string;
};

type Quote = {
  text: string;
  author: string;
};

const initialFlashcards: Flashcard[] = [
  {
    id: 1,
    question: 'What is React Native?',
    answer: 'A framework for building native apps using JavaScript and React.',
  },
  {
    id: 2,
    question: 'What is a component?',
    answer: 'A reusable piece of UI in React / React Native.',
  },
  {
    id: 3,
    question: 'What hook lets you add state to a component?',
    answer: 'The useState hook.',
  },
];

const quotes: Quote[] = [
  {
    text: 'The future depends on what you do today.',
    author: 'Mahatma Gandhi',
  },
  {
    text: 'Success is the sum of small efforts, repeated day in and day out.',
    author: 'Robert Collier',
  },
  {
    text: 'It always seems impossible until it is done.',
    author: 'Nelson Mandela',
  },
  {
    text: 'Code is like humor. When you have to explain it, it’s bad.',
    author: 'Cory House',
  },
  {
    text: 'The best error message is the one that never shows up.',
    author: 'Thomas Fuchs',
  },
];

const getRandomQuote = (): Quote => {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
};

const App = () => {
  const [activeScreen, setActiveScreen] = useState<'flashcards' | 'quotes'>(
    'flashcards',
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top tabs to switch between the two tasks */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeScreen === 'flashcards' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveScreen('flashcards')}
        >
          <Text
            style={[
              styles.tabText,
              activeScreen === 'flashcards' && styles.tabTextActive,
            ]}
          >
            Flashcards
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeScreen === 'quotes' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveScreen('quotes')}
        >
          <Text
            style={[
              styles.tabText,
              activeScreen === 'quotes' && styles.tabTextActive,
            ]}
          >
            Random Quotes
          </Text>
        </TouchableOpacity>
      </View>

      {activeScreen === 'flashcards' ? <FlashcardScreen /> : <QuoteScreen />}
    </SafeAreaView>
  );
};

/* -------------------- FLASHCARD QUIZ APP (TASK 1) -------------------- */

const FlashcardScreen = () => {
  const [cards, setCards] = useState<Flashcard[]>(initialFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [questionInput, setQuestionInput] = useState('');
  const [answerInput, setAnswerInput] = useState('');

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    if (cards.length === 0) return;
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevious = () => {
    if (cards.length === 0) return;
    setShowAnswer(false);
    setCurrentIndex((prev) =>
      prev === 0 ? cards.length - 1 : prev - 1,
    );
  };

  const handleAddCard = () => {
    if (!questionInput.trim() || !answerInput.trim()) {
      return;
    }

    const newCard: Flashcard = {
      id: Date.now(),
      question: questionInput.trim(),
      answer: answerInput.trim(),
    };

    const newCards = [...cards, newCard];
    setCards(newCards);
    setQuestionInput('');
    setAnswerInput('');
    setShowAnswer(false);
    setCurrentIndex(newCards.length - 1);
  };

  const handleUpdateCurrent = () => {
    if (!currentCard) return;
    if (!questionInput.trim() || !answerInput.trim()) {
      return;
    }

    const updated = cards.map((card, index) =>
      index === currentIndex
        ? {
            ...card,
            question: questionInput.trim(),
            answer: answerInput.trim(),
          }
        : card,
    );

    setCards(updated);
    setShowAnswer(false);
  };

  const handleDeleteCurrent = () => {
    if (!currentCard) return;

    const remaining = cards.filter((_, index) => index !== currentIndex);

    setCards(remaining);
    setShowAnswer(false);

    if (remaining.length === 0) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex >= remaining.length) {
      setCurrentIndex(remaining.length - 1);
    }
  };

  const handleLoadCurrentIntoForm = () => {
    if (!currentCard) return;
    setQuestionInput(currentCard.question);
    setAnswerInput(currentCard.answer);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Text style={styles.heading}>Flashcard Quiz App</Text>

      {/* Flashcard display */}
      <View style={styles.card}>
        {cards.length === 0 ? (
          <Text style={styles.cardText}>
            No flashcards yet. Add one below!
          </Text>
        ) : (
          <>
            <Text style={styles.cardLabel}>
              Card {currentIndex + 1} of {cards.length}
            </Text>
            <Text style={styles.cardText}>
              {showAnswer ? currentCard.answer : currentCard.question}
            </Text>
          </>
        )}
      </View>

      {/* Buttons for current card */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.smallButton} onPress={handlePrevious}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setShowAnswer((prev) => !prev)}
          disabled={cards.length === 0}
        >
          <Text style={styles.buttonText}>
            {showAnswer ? 'Show Question' : 'Show Answer'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallButton} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Form for add / edit */}
      <Text style={styles.subheading}>Add / Edit Flashcards</Text>

      <TextInput
        style={styles.input}
        placeholder="Question"
        value={questionInput}
        onChangeText={setQuestionInput}
      />
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="Answer"
        value={answerInput}
        multiline
        onChangeText={setAnswerInput}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleAddCard}>
          <Text style={styles.buttonText}>Add New Card</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, cards.length === 0 && styles.buttonDisabled]}
          onPress={handleLoadCurrentIntoForm}
          disabled={cards.length === 0}
        >
          <Text style={styles.buttonText}>Load Current Into Form</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, cards.length === 0 && styles.buttonDisabled]}
          onPress={handleUpdateCurrent}
          disabled={cards.length === 0}
        >
          <Text style={styles.buttonText}>Update Current Card</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.deleteButton, cards.length === 0 && styles.buttonDisabled]}
          onPress={handleDeleteCurrent}
          disabled={cards.length === 0}
        >
          <Text style={styles.buttonText}>Delete Current Card</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

/* -------------------- RANDOM QUOTE GENERATOR (TASK 2) -------------------- */

const QuoteScreen = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(getRandomQuote());

  const handleNewQuote = () => {
    setCurrentQuote(getRandomQuote());
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Random Quote Generator</Text>

      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>"{currentQuote.text}"</Text>
        <Text style={styles.quoteAuthor}>— {currentQuote.author}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNewQuote}>
        <Text style={styles.buttonText}>New Quote</Text>
      </TouchableOpacity>
    </View>
  );
};

/* ----------------------------- STYLES ----------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // dark navy
  },
  screen: {
    flex: 1,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginVertical: 16,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 24,
    marginBottom: 8,
  },
  tabRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#38bdf8',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#38bdf8',
  },
  tabText: {
    color: '#38bdf8',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  cardLabel: {
    color: '#94a3b8',
    marginBottom: 8,
    fontSize: 14,
  },
  cardText: {
    color: 'white',
    fontSize: 18,
    lineHeight: 26,
  },
  quoteCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginBottom: 24,
  },
  quoteText: {
    color: 'white',
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 12,
  },
  quoteAuthor: {
    color: '#e5e7eb',
    fontSize: 16,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  button: {
    backgroundColor: '#38bdf8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    minWidth: 200,
  },
  smallButton: {
    backgroundColor: '#38bdf8',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginHorizontal: 4,
    flex: 1,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    minWidth: 200,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    fontSize: 16,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default App;
