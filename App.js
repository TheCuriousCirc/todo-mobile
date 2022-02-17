import React, { Node, useEffect, useState } from "react";
import { FlatList, Keyboard, StatusBar, StyleSheet, View } from "react-native";
import "react-native-get-random-values";
import AddTodo from "./components/add-todo";
import Heading from "./components/heading";
import TodoItem from "./components/todo-item";
import { colors, spacing } from "./constant";
import initializeDB from "./initializeDB";

const generatedId = () => Math.random().toString(36).substring(2, 9);

const App: () => Node = () => {
  const [db, setDb] = useState(null);

  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [todoIdToUpdate, setTodoIdToUpdate] = useState("");

  const editMode = !!todoIdToUpdate.length;

  const addTodo = async () => {
    try {
      await db.todos.insert({ _id: generatedId(), text, completed: false });
      setText("");
      Keyboard.dismiss();
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteTodo = async (todo) => {
    try {
      const doc = db.todos.findOne({
        selector: { _id: todo.get("_id") },
      });
      await doc.remove();
    } catch (err) {
      console.error("Cannot delete todo");
      console.error(err.message);
    }
  };

  const editTodo = (todo) => {
    setTodoIdToUpdate(todo._id);
    setText(todo.text);
  };

  const cancelEditTodo = () => {
    setTodoIdToUpdate("");
    setText("");
  };

  const updateTodo = async () => {
    try {
      const doc = db.todos.findOne({
        selector: { _id: todoIdToUpdate },
      });

      await doc.update({ $set: { text } });

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
      const doc = db.todos.findOne({
        selector: { _id: todo.get("_id") },
      });
      await doc.update({ $set: { completed: !todo.completed } });
    } catch (err) {
      console.error("Cannot toggle complete todo");
      console.error(err.message);
    }
  };

  useEffect(() => {
    let sub;
    if (db && db.todos) {
      sub = db.todos.find().$.subscribe((todos) => {
        // console.log(JSON.stringify(todos, null, "\t"));
        setTodos(todos);
      });
    }
    return () => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    };
  }, [db]);

  useEffect(() => {
    const initDB = async () => {
      const _db = await initializeDB();
      setDb(_db);
    };
    initDB();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.bg} />
      <Heading />
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <TodoItem todo={item} editTodo={editTodo} deleteTodo={deleteTodo} toggleComplete={toggleComplete} />
        )}
        keyExtractor={(item) => item._id}
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
