import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('language')
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', { unique: true })
  name: string;
  @Column('text', { unique: true })
  code: string;
  @Column('text')
  country: string;
  @OneToMany(() => Dictionary, (dictionaries) => dictionaries.language, {
    onDelete: 'CASCADE',
  })
  dictionary: Dictionary[];
}
