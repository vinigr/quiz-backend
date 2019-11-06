module.exports = () => {
  let hexadecimal = '0123456789ABCDEF';
  let color = '';

  for (let i = 0; i < 6; i++) {
    color += hexadecimal[Math.floor(Math.random() * 16)];
  }
  return color;
};
