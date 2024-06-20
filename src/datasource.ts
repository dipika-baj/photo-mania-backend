import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entity/User.entity";
import { Post } from "./entity/Post.entity";

dotenv.config();

export const database = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [User, Post],
  subscribers: [],
  migrations: [],
});

database
  .initialize()
  .then()
  .catch((err) => {
    console.log(err);
  });
