import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    async function fetchRepositories() {
      try {
        const response = await api.get("repositories");
        setRepositories(response.data);
      } catch (error) {
        console.error(error.response || error);
      }
    }
    fetchRepositories();
  }, []);

  async function handleLikeRepository(id) {
    try {
      const response = await api.post(`repositories/${id}/like`);
      if (response.status === 200) {
        const { data: newRepository } = response;
        const newRepositories = [...repositories];
        const repositoryIndex = newRepositories.findIndex(
          (repository) => repository.id === id
        );
        newRepositories[repositoryIndex] = newRepository;
        setRepositories(newRepositories);
      } else {
        throw new Error(
          `[ERROR] handleLikeRepository(): Unexpected response: ${JSON.stringify(
            response,
            null,
            2
          )}`
        );
      }
    } catch (error) {
      console.error(error.response || error);
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.container}
          data={repositories}
          renderItem={({ item: repository }) => (
            <View key={repository.id} style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
                {repository.techs.map((tech, index) => (
                  <Text key={index} style={styles.tech}>
                    {tech}
                  </Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 5,
    marginHorizontal: -5,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    margin: 5,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
