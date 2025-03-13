module.exports = {
  apps: [
    {
      name: "REACT-PREVIEW", // Nama aplikasi di PM2
      script: "serve", // Perintah untuk menjalankan serve
      args: "-s build", // Argumen untuk serve (melayani folder build)
      interpreter: "none", // Tidak menggunakan interpreter Node.js
      env: {
        PM2_SERVE_PATH: "./build", // Path ke folder build
        PM2_SERVE_PORT: 5000, // Port yang akan digunakan
        PM2_SERVE_SPA: "true", // Mode Single Page Application
      },
    },
  ],
};
