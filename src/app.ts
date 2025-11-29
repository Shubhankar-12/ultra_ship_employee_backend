import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { config } from "./config/env";
import { connectDB } from "./config/db";
import jwt from "jsonwebtoken";
import { Employee } from "./models/employee.model";
import { createEmployeeLoader } from "./loaders/employee.loader";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("dev"));
// app.use(express.json()); // Removed to avoid conflict with Apollo Server's body parsing

// Context setup for Apollo Server
const context = async ({ req }: any) => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  let user = null;

  if (token) {
    try {
      const decoded: any = jwt.verify(token, config.jwtSecret);
      user = await Employee.findById(decoded.id);
    } catch (err) {
      // Invalid token, user remains null
    }
  }

  return {
    user,
    loaders: {
      employeeLoader: createEmployeeLoader(),
    },
  };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true, // Enable introspection for tools like Postman
  formatError: (err) => {
    console.error(err);
    return err;
  },
});

export const startServer = async () => {
  await server.start();
  // Disable Apollo's default CORS to use the one configured in Express
  server.applyMiddleware({ app: app as any, cors: false });

  await connectDB();

  app.listen(config.port, () => {
    console.log(
      `Server running on http://localhost:${config.port}${server.graphqlPath}`
    );
  });
};
