import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/auth/cli/browser/:jwtToken')
  index(@Param('jwtToken') jwtToken: string, @Req() request: Request, @Res() res: Response) {
    const jwtPayload: any = jwt.verify(jwtToken, 'secret')
    if (!jwtPayload) {
      throw new InternalServerErrorException('Invalid Token')
    }

    const { wsServer } = jwtPayload
    if (!wsServer) {
      throw new InternalServerErrorException('Invalid Token')
    }

    const { token, username } = request.cookies;
    if (!token) {
      return res.render('signin');
    }

    return res.render('index', { username, wsServer });
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
