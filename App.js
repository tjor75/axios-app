import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";

import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_OMDB_KEY; // Reemplaza con tu propia API key de OMDb
const COLOR_PRIMARY   = "#007BFF";
const COLOR_SECONDARY = "#aaa";
const BORDER_RADIUS   = 8;


const Rating = ({ source, value }) => {
  return (
    <View style={styles.rating}>
      <Text style={styles.ratingValue}>{value}</Text>
      <Text style={styles.ratingSource}>{source}</Text>
    </View>
  );
}
const RatingList = ({ ratings }) => {
  let i = -1;
  return (
    <View style={styles.ratingList}>
      {
        ratings.map(() => {
          i++;
          return <Rating key={"rating" + i} source={ratings[i].Source} value={ratings[i].Value} />;
        })
      }
    </View>
  );
}
const BasicDetails = ({ actors, director, genre }) => {
  return (
    <View style={styles.input}>
      <Text style={styles.movieText}>
        <Text style={styles.detailTitle}>Actores:</Text> {actors}
      </Text>
      <Text style={styles.movieText}>
        <Text style={styles.detailTitle}>Director:</Text> {director}
      </Text>
      <Text style={styles.movieText}>
        <Text style={styles.detailTitle}>Género:</Text> {genre}
      </Text>
    </View>
  )
}


const App = () => {
  // tt0133093 / tt0317219
  const [imdbId, setImdbId] = useState("tt0317219");
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Funcion que simula esperar 'n' miilsegundos
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchMovieData = async () => {
    if (!imdbId.trim()) {
      Alert.alert("Error", "Por favor, ingresa un ID de IMDb válido.");
      return;
    }

    setLoading(true);
    setMovieData(null);

    try {
      //http://www.omdbapi.com/?i=tt0317219&apikey=7b62fa5d
      const response = await axios.get(`http://www.omdbapi.com/`, {
        params: {
          i: imdbId,
          apikey: API_KEY,
        },
        timeout: 5000, // 5 segundos
      });

      // Simular un delay artificial de 3 segundos (asi vemos el Loading)
      await sleep(3000);

      console.log("Status:", response.status);
      // En response.data se encuentra la respuesta! 
      if (response.data.Response === "True") {
        setMovieData(response.data);
      } else {
        Alert.alert(
          "No encontrado",
          response.data.Error || "Película no encontrada"
        );
      }
    } catch (error) {
      console.log("Error: ", error);
      if (error.code === "ECONNABORTED") {
        Alert.alert(
          "Timeout",
          "La solicitud ha tardado demasiado en responder."
        );
      } else {
        Alert.alert("Error", "Hubo un problema al consultar la APIs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar/>
      <ScrollView>
      <Text style={styles.title}>Buscar Película por IMDb ID</Text>

      <TextInput
        style={styles.input}
        placeholder="Ej: tt0111161"
        value={imdbId}
        onChangeText={setImdbId}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={fetchMovieData}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {movieData && (
        <View style={styles.result}>
          <Image
            source={{ uri: movieData.Poster }}
            style={styles.poster}
            resizeMode="contain"
          />
          <Text style={styles.movieTitle}>{movieData.Title}</Text>
          <RatingList ratings={movieData.Ratings} />
          <BasicDetails actors={movieData.Actors} director={movieData.Director} genre={movieData.Genre} />
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    marginTop: 16,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR_SECONDARY,
    borderRadius: BORDER_RADIUS,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: COLOR_PRIMARY,
    padding: 14,
    borderRadius: BORDER_RADIUS,
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  result: {
    alignItems: "center",
    marginTop: 16,
  },
  poster: {
    width: "100%",
    height: 400,
    marginBottom: 12,
    overflow: "hidden",
    borderRadius: BORDER_RADIUS,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  detailTitle: {
    fontWeight: "bold"
  },

  ratingList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginBottom: 12,
    width: "100%"
  },
  rating: {
    width: "33.33%"
  },
  ratingValue: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18
  },
  ratingSource: {
    textAlign: "center"
  }
});

export default App;
