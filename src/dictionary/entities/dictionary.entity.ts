import { Language } from 'src/language/entities/language.entity';
import { Word } from 'src/word/entities/word.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('dictionary')
export class Dictionary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @ManyToOne(() => Language, (language) => language.dictionary, {
    onDelete: 'CASCADE',
    eager: true,
  })
  language: Language;

  @OneToMany(() => Word, (word) => word.dictionary, {
    onDelete: 'CASCADE',
    eager: true,
  })
  words: Word[];
}
