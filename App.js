import { Node, useEffect } from "react";
import React, { useState } from "react";
import { View, FlatList, StyleSheet, Keyboard, StatusBar } from "react-native";
import Heading from "./components/heading";
import TodoItem from "./components/todo-item";
import AddTodo from "./components/add-todo";
import { colors, spacing } from "./constant";
import { getDocs, addDoc, collection, doc, deleteDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "./config/firebase";

const App: () => Node = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [todoIdToUpdate, setTodoIdToUpdate] = useState("");

  const editMode = !!todoIdToUpdate.length;

  const getTodos = async () => {
    try {
      const todosSnapshot = await getDocs(collection(db, "todos"));
      setTodos(todosSnapshot.docs.map((todoDoc) => ({ id: todoDoc.id, ...todoDoc.data() })));
    } catch (err) {
      console.error("Cannot get todos");
      console.error(err.message);
    }
  };

  const addTodo = async () => {
    try {
      const newTodo = { text: text, completed: false };
      const doc = await addDoc(collection(db, "todos"), newTodo);
      setTodos((prevTodos) => [{ id: doc.id, ...newTodo }, ...prevTodos]);
      setText("");
      Keyboard.dismiss();
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteTodo = async (todo) => {
    try {
      const todoRef = doc(db, "todos", todo.id);
      await deleteDoc(todoRef);
      setTodos((prevTodos) => prevTodos.filter((prevTodo) => prevTodo.id !== todo.id));
    } catch (err) {
      console.error("Cannot delete todo");
      console.error(err.message);
    }
  };

  const editTodo = (todo) => {
    setTodoIdToUpdate(todo.id);
    setText(todo.text);
  };

  const cancelEditTodo = () => {
    setTodoIdToUpdate("");
    setText("");
  };

  const updateTodo = async () => {
    try {
      const todoRef = doc(db, "todos", todoIdToUpdate);
      await updateDoc(todoRef, { text });
      setTodos((prevTodos) => {
        const updatedTodos = prevTodos.map((prevTodo) => {
          if (prevTodo.id === todoIdToUpdate) {
            return { ...prevTodo, text };
          }
          return prevTodo;
        });
        return updatedTodos;
      });
      Keyboard.dismiss();
      setText("");
      setTodoIdToUpdate("");
    } catch (err) {
      console.error("Cannot update todo");
      console.error(err.message);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const todoRef = doc(db, "todos", todo.id);
      await updateDoc(todoRef, { completed: !todo.completed });
      setTodos((prevTodos) => {
        const updateTodos = prevTodos.map((prevTodo) => {
          if (prevTodo.id === todo.id) {
            return { ...prevTodo, completed: !todo.completed };
          }
          return prevTodo;
        });
        return updateTodos;
      });
    } catch (err) {
      console.error("Cannot toggle complete todo");
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.bg} />
      <Heading />
      <FlatList
        data={todos.filter((todo) => todo.id !== todoIdToUpdate)}
        renderItem={({ item }) => (
          <TodoItem todo={item} editTodo={editTodo} deleteTodo={deleteTodo} toggleComplete={toggleComplete} />
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ marginVertical: spacing.sm }} />}
        contentContainerStyle={{ padding: spacing.md }}
      />
      <AddTodo
        editMode={editMode}
        text={text}
        setText={setText}
        onSubmit={editMode ? updateTodo : addTodo}
        cancelEditTodo={cancelEditTodo}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
