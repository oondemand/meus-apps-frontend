export const getRandomColor = () => {
  const colors = [
    "red",
    "green",
    "blue",
    "purple",
    "orange",
    "teal",
    "pink",
    "yellow",
    "cyan",
  ];

  const random = colors[Math.floor(Math.random() * colors.length)];
  return random;
};
