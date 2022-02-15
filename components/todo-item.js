import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { colors, fontSizes, radius, spacing } from "../constant";
import AntDesign from "react-native-vector-icons/AntDesign";

const TodoItem = ({ todo, editTodo, deleteTodo, toggleComplete }) => {
  return (
    <TouchableOpacity
      onLongPress={() => {
        Alert.alert(
          "Delete or Update",
          null,
          [
            {
              text: "Edit",
              onPress: () => editTodo(todo),
            },
            {
              text: "Delete",
              onPress: () => deleteTodo(todo),
            },
          ],
          {
            cancelable: true,
          }
        );
      }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => toggleComplete(todo)}
          style={[styles.checkContainer, todo.completed ? {} : styles.notCompleted]}
        >
          {todo.completed && <AntDesign name="checkcircle" size={24} color={colors.pink} />}
        </TouchableOpacity>
        <Text style={[styles.todoText, todo.completed && styles.todoCompleted]}>{todo.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.todoBg,
    padding: spacing.lg,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
  },
  checkContainer: {
    height: 24,
    width: 24,
    marginRight: spacing.sm,
  },
  notCompleted: {
    borderWidth: 2,
    borderColor: colors.pink,
    borderRadius: radius.full,
  },
  todoText: {
    color: colors.white,
    fontSize: fontSizes.md,
  },
  todoCompleted: {
    textDecorationLine: "line-through",
  },
});

export default TodoItem;
