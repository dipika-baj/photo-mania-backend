import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Post } from "./Post.entity";
import { timeStamp } from "console";

@Entity()
@Unique(["email", "username"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column()
  imageUrl!: string;

  @Column()
  imageName!: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];
}
