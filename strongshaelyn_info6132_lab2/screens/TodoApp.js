import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, TextInput, Button, Paragraph } from 'react-native-paper';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { addTodo, deleteTodo } from '../redux/actions';
import firestore from '@react-native-firebase/firestore';

const TodoApp = ({ todo_list, addTodo, deleteTodo }) => {
  const [task, setTask] = useState('');

  useEffect(() => {
    // Subscribe to real-time updates from Firestore
    const unsubscribe = firestore().collection('todos').onSnapshot(snapshot => {
      const updatedTodos = [];
      snapshot.forEach(doc => {
        updatedTodos.push({
          id: doc.id,
          task: doc.data().task
        });
      });
      // Update local state with Firestore data
      addTodo(updatedTodos);
    });

    // Unsubscribe from Firestore updates when component unmounts
    return () => unsubscribe();
  }, []);

  const handleAddTodo = () => {
    if (task.trim() !== '') {
      // Add a new task to Firestore
      firestore().collection('todos').add({ task });
      setTask('');
    }
  };

  const handleDeleteTodo = (id) => {
    // Delete the task from Firestore
    firestore().collection('todos').doc(id).delete();
  };

  return (
    <View style={styles.container}>
      <Card title="Card Title">
        <Title style={styles.paragraph}>ToDo App with React Native and Redux</Title>
      </Card>
      <Card>
        <Card.Content>
          <Title>Add ToDo Here</Title>
          <TextInput
            mode="outlined"
            label="Task"
            value={task}
            onChangeText={setTask}
          />
          <Button mode="contained" onPress={handleAddTodo}>
            Add Task
          </Button>
        </Card.Content>
      </Card>
      <FlatList
        data={todo_list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card>
            <Card.Title
              title={`Task#${item.id}`}
              left={(props) => <Icon name="tasks" size={24} color="black" />}
              right={(props) => <Button iconName="close" color="red" onPress={() => handleDeleteTodo(item.id)} />}
            />
            <Card.Content>
              <Paragraph>{item.task}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  paragraph: {
    marginVertical: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    todo_list: state.todos.todo_list,
  };
};

const mapDispatchToProps = { addTodo, deleteTodo };

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);
