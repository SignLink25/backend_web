import { Roles } from 'src/common/enum/roles.enum';
import { Media } from 'src/media/entities/media.entity';
import { Progress } from 'src/progress/entities/progress.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  username: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text', { nullable: true })
  number: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: Roles;

  @Column('text', { nullable: true })
  selfDescription: string;

  @Column('text', { nullable: true })
  whyLearn: string;

  @Column('text', { nullable: true })
  level: string;

  @ManyToOne(() => Media, (media) => media.user, {
    onDelete: 'CASCADE',
    eager: true,
  })
  media: Media;

  @OneToMany(() => Progress, (progress) => progress.user, {
    onDelete: 'CASCADE',
  })
  progress: Progress[];

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @Column('text', { nullable: true })
  token: string;

  @Column('text', { nullable: true })
  expirationToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  checkEmail() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkEmailUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
