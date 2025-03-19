import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import { Media } from 'src/media/entities/media.entity';
import { Phonetic } from 'src/phonetic/entities/phonetic.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('word')
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  word: string;

  @Column('text')
  meaning: string;

  @Column('text')
  grammaticalClass: string;

  @OneToMany(() => Phonetic, (phonetic) => phonetic.word, {
    onDelete: 'CASCADE',
    eager: true,
  })
  phonetic: Phonetic[];

  @ManyToMany(() => Media, (media) => media.words)
  @JoinTable({
    name: 'word_media',
    joinColumn: {
      name: 'word_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'media_id',
      referencedColumnName: 'id',
    },
  })
  media: Media[];

  @Column('text')
  explanation_language: string;

  @Column('text')
  sign_language: string;

  @Column('text', { array: true })
  syllables: string[];

  @Column('text')
  ipa: string;

  @Column('text')
  exemplo: string;

  @ManyToOne(() => Dictionary, (dictionary) => dictionary.words, {
    onDelete: 'CASCADE',
  })
  dictionary: Dictionary;

  @ManyToMany(() => Word, (word) => word.synonyms)
  @JoinTable({
    name: 'word_synonyms',
    joinColumn: {
      name: 'word_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'synonym_id',
      referencedColumnName: 'id',
    },
  })
  synonyms: Word[];
}
