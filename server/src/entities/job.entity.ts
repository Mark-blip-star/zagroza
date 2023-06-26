import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('job')
export class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  job_title: string;

  @Column()
  job_salary: number;

  @Column()
  job_technology: string;
}
