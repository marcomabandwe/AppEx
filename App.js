import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  const [nomChose, setNomChose] = useState('');
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [showDateDebutPicker, setShowDateDebutPicker] = useState(false);
  const [showDateFinPicker, setShowDateFinPicker] = useState(false);
  const [resultat, setResultat] = useState(null);

  const handleDateDebutChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDateDebutPicker(false);
    }
    if (selectedDate) {
      setDateDebut(selectedDate);
    }
  };

  const handleDateFinChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDateFinPicker(false);
    }
    if (selectedDate) {
      setDateFin(selectedDate);
    }
  };

  const calculerDuree = () => {
    if (!nomChose.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le nom de la chose');
      return;
    }

    if (dateDebut >= dateFin) {
      Alert.alert('Erreur', 'La date de début doit être antérieure à la date de fin');
      return;
    }

    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    let annees = fin.getFullYear() - debut.getFullYear();
    let mois = fin.getMonth() - debut.getMonth();
    let jours = fin.getDate() - debut.getDate();
    let heures = fin.getHours() - debut.getHours();
    let minutes = fin.getMinutes() - debut.getMinutes();
    let secondes = fin.getSeconds() - debut.getSeconds();

    // Ajustements
    if (secondes < 0) {
      minutes--;
      secondes += 60;
    }
    if (minutes < 0) {
      heures--;
      minutes += 60;
    }
    if (heures < 0) {
      jours--;
      heures += 24;
    }
    if (jours < 0) {
      mois--;
      const dernierJourMoisPrecedent = new Date(fin.getFullYear(), fin.getMonth(), 0).getDate();
      jours += dernierJourMoisPrecedent;
    }
    if (mois < 0) {
      annees--;
      mois += 12;
    }

    // Calcul des semaines
    const semaines = Math.floor(jours / 7);
    const joursRestants = jours % 7;

    setResultat({
      nom: nomChose,
      annees,
      mois,
      semaines,
      jours: joursRestants,
      heures,
      minutes,
      secondes,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const afficherResultat = () => {
    if (!resultat) return null;

    const { nom, annees, mois, semaines, jours, heures, minutes, secondes } = resultat;
    const isPlural = true;

    const parts = [];
    if (annees > 0) parts.push(`${annees} ${annees > 1 ? 'ans' : 'an'}`);
    if (mois > 0) parts.push(`${mois} ${mois > 1 ? 'mois' : 'mois'}`);
    if (semaines > 0) parts.push(`${semaines} ${semaines > 1 ? 'semaines' : 'semaine'}`);
    if (jours > 0) parts.push(`${jours} ${jours > 1 ? 'jours' : 'jour'}`);
    if (heures > 0) parts.push(`${heures} ${heures > 1 ? 'heures' : 'heure'}`);
    if (minutes > 0) parts.push(`${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`);
    if (secondes > 0) parts.push(`${secondes} ${secondes > 1 ? 'secondes' : 'seconde'}`);

    let texte = parts.join(', ');

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Votre {nom} a fait {texte} d'existence.
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>⏳ Calculatrice d'Existence</Text>
        <Text style={styles.subtitle}>
          Découvrez combien de temps quelque chose a existé
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📝 Nom de la chose</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Notre amitié, La Terre, Mon entreprise..."
          value={nomChose}
          onChangeText={setNomChose}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📅 Date de début d'existence</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDateDebutPicker(true)}
        >
          <Text style={styles.dateButtonText}>{formatDate(dateDebut)}</Text>
        </TouchableOpacity>
        {showDateDebutPicker && (
          <DateTimePicker
            value={dateDebut}
            mode="date"
            display="spinner"
            onChange={handleDateDebutChange}
          />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📅 Date de fin d'existence</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDateFinPicker(true)}
        >
          <Text style={styles.dateButtonText}>{formatDate(dateFin)}</Text>
        </TouchableOpacity>
        {showDateFinPicker && (
          <DateTimePicker
            value={dateFin}
            mode="date"
            display="spinner"
            onChange={handleDateFinChange}
          />
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={calculerDuree}>
        <Text style={styles.buttonText}>🚀 Calculer la Durée</Text>
      </TouchableOpacity>

      {afficherResultat()}

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3c72',
    marginBottom: 12,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dateButton: {
    borderWidth: 2,
    borderColor: '#e0e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  button: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  resultContainer: {
    backgroundColor: '#e8f4f8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 6,
    borderLeftColor: '#667eea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultText: {
    fontSize: 18,
    color: '#1e3c72',
    fontWeight: '600',
    lineHeight: 28,
  },
  footer: {
    height: 20,
  },
});
