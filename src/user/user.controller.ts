import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Crud({
  model: {
    type: User,
  },
  query: {
    exclude: ['password'],
    join: {
      role: {},
      created_by: {},
      updated_by: {},
    },
  },
})
@ApiTags('User')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('user')
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}

  get base(): CrudController<User> {
    return this;
  }

  @Override()
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User) {
    // Generate random password
    const randomPassword = Array(50)
      .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
      .map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');

    // Hash password
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(randomPassword, salt);

    // Save hash password
    dto.password = hash;

    return this.base.createOneBase(req, dto);
  }

  @Override('updateOneBase')
  async coolFunction(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
  ) {
    // Check if a new password is provided
    if (dto.password) {
      // Hash new password
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(dto.password, salt);

      // Save hashed new password
      dto.password = hash;
    } else {
      // If no new password is provided, remove the password field from the DTO
      // to prevent updating it with null or undefined
      delete dto.password;
    }

    dto.role_id = parseInt(dto.role_id.toString());

    return this.base.updateOneBase(req, dto);
  }
}
