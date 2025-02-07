export const getExerciseImage = (exerciseName: string) => {
    const formattedName = exerciseName.replace(/\s+/g, "_"); // Replace spaces with underscores
    const exerciseImagePath = `/exercises/${formattedName}/0.jpg`;
    console.log("Generated image path:", exerciseImagePath); // Debugging
    return exerciseImagePath;
  
  };
  