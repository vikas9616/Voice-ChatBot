export default {
  server: {
    proxy: {
      "/ws": {
        target: "ws://localhost:5000",
        ws: true,
      },
    },
  },
};
