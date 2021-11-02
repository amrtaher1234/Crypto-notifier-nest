import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FinanceService } from 'src/shared/finance/finance.service';
import { SubscribeUserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly financeService: FinanceService,
  ) {}

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
  @Get('/symbol/:symb')
  async getSymbol(@Param() params) {
    return await this.financeService.getSymbolQuote(params.symb);
  }
  @Post('/subscribe')
  async subscribeUser(@Body() subscribeUserDto: SubscribeUserDto) {
    await this.userService.subscribeUser(
      subscribeUserDto.id,
      subscribeUserDto.resourceData,
    );
    return {
      message: 'successfuflly subscribed',
    };
  }
}
