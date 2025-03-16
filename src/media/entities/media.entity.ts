import { Phonetic } from 'src/phonetic/entities/phonetic.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Word } from 'src/word/entities/word.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  url: string;

  @Column('text')
  type: string;

  @Column('text', { unique: true })
  alt: string;

  @OneToMany(() => Phonetic, (phonetic) => phonetic.media, {
    onDelete: 'CASCADE',
  })
  phonetic: Phonetic[];

  @OneToMany(() => Task, (task) => task.media, {
    onDelete: 'CASCADE',
  })
  tasks: Task[];

  @OneToMany(() => User, (user) => user.media, {
    onDelete: 'CASCADE',
  })
  user: User[];

  @ManyToMany(() => Word, (word) => word.media)
  words: Word[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
