const ENV = {
  APITangkApp:
    process.env.NODE_ENV === "production"
      ? "https://backend-tangk-app.vercel.app/"
      : "http://localhost:5000/",
};

export default ENV;
  