import { Media } from 'src/media/entities/media.entity';
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
  word: string;

  @Column('text')
  ipa: string;

  @Column('text')
  phonetic_spelling: string;

  @ManyToOne(() => Media, (media) => media.phonetic, {
    onDelete: 'CASCADE',
    eager: true,
  })
  media: Media;

  @CreateDateColumn()
  createdAt: Date;
}
