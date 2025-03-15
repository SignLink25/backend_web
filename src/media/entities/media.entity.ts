import { Phonetic } from 'src/phonetic/entities/phonetic.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
