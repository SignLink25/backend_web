import { Media } from 'src/media/entities/media.entity';
import { Word } from 'src/word/entities/word.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('phonetic')
export class Phonetic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  ipa: string;

  @Column('text')
  syllables: string;

  @ManyToOne(() => Media, (media) => media.phonetic, {
    onDelete: 'CASCADE',
    eager: true,
  })
  media: Media;

  @ManyToOne(() => Word, (word) => word.phonetic, {
    onDelete: 'CASCADE',
  })
  word: Word;

  @CreateDateColumn()
  createdAt: Date;
}
