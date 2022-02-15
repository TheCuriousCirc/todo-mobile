import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { colors, fontSizes, spacing } from "../constant";

const Heading = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Today's Task</Text>
    </View>
  );
};

export default Heading;

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  headingText: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: colors.white,
  },
});
