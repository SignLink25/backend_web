import { Language } from 'src/language/entities/language.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
