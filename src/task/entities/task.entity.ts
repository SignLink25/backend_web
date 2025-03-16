import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Media } from 'src/media/entities/media.entity';
import { Progress } from 'src/progress/entities/progress.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  question: string;

  @Column('text')
  correctAnswer: string;

  @Column('text')
  questionType: string;

  @Column('text', { array: true })
  options: string[];

  @ManyToOne(() => Lesson, (lesson) => lesson.tasks, {
    onDelete: 'CASCADE',
    eager: true,
  })
  lesson: Lesson;

  @ManyToOne(() => Media, (media) => media.tasks, {
    onDelete: 'CASCADE',
    eager: true,
  })
  media: Media;

  @OneToMany(() => Progress, (progress) => progress.task, {
    onDelete: 'CASCADE',
  })
  progress: Progress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
