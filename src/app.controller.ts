import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/auth/cli/browser')
  index(@Req() request: Request, @Res() res: Response) {
    const { token, username } = request.cookies;
    if (!token) {
      return res.render('signin');
    }

    return res.render('index', { username });
  }

  @Post('/login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { username, password } = body;
    const login = await this.appService.login(username, password);
    res.cookie('token', login.token);
    res.cookie('username', username);

    return { message: 'Logged In' }
  }

  @Delete('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    res.clearCookie('username');

    return { message: 'Logged Out' }
  }
}
