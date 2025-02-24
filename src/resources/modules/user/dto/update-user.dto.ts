import { RegisterUserDto } from './register-user.dto';

export interface UpdateUserDto extends Partial<RegisterUserDto> {}
