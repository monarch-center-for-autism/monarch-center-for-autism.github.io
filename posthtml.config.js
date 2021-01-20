module.exports = {
  plugins: {
    "posthtml-expressions": {
      locals: {
        GTM_ID: process.env.GTM_ID,
      },
    },
  },
};
