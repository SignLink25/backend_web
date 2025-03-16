import { IsBoolean, IsUUID } from 'class-validator';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateProgressDto {
  @IsUUID()
  lesson: Lesson;

  @IsUUID()
  task: Task;

  @IsUUID()
  user: User;

  @IsBoolean()
  completed: boolean;
}
