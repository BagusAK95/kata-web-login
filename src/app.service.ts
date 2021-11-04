import { BadRequestException, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import * as axios from 'axios';

@Injectable()
export class AppService {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.default.create({});
  }

  async login(username: string, password: string) {
    const login = await this.http.post('https://api.kata.ai/cli-login', {
      username,
      password,
    });

    const token = login.data.id
    if (!token) {
      throw new BadRequestException('Invalid username or password');
    }

    return { token }
  }
}
