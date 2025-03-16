import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.progress, {
    onDelete: 'CASCADE',
    eager: true,
  })
  lesson: Lesson;

  @ManyToOne(() => Task, (task) => task.progress, {
    onDelete: 'CASCADE',
    eager: true,
  })
  task: Task;

  @ManyToOne(() => User, (user) => user.progress, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;

  @Column('boolean', { default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
