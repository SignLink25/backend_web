import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('module')
export class ModuleClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('text')
  level: string;

  @Column('integer')
  order: number;

  @OneToMany(() => Lesson, (lesson) => lesson.module, {
    onDelete: 'CASCADE',
  })
  lessons: Lesson[];
}
