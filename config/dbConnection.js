import mongoose from "mongoose";

const connect = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected ", connect.connection.host, connect.connection.name);
  } catch (error) {
    console.log("failed to connect to database ", error);
  }
};

export default connect;
