import { Crud, CrudController } from '@dataui/crud';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleUpsertDto } from './dto/role-upsert.dto';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Crud({
  model: {
    type: Role,
  },
  query: {
    join: {
      created_by: {},
      updated_by: {},
    },
  },
})
@ApiTags('Role')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('role')
export class RoleController implements CrudController<Role> {
  constructor(public service: RoleService) {}

  @Post('upsert')
  async upsertRole(@Body() roleData: RoleUpsertDto, @GetUser() user: User) {
    return this.service.upsertRole(roleData, user);
  }
}
