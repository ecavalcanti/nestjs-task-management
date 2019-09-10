import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { AuthCrendentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCrendentialsDto): Promise<void> {
    const { username, password  } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.password = password;

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentialsDto: AuthCrendentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ username });

    if (! await this.validatePassword(user, password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      username,
    };
    const accessToken = await this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  private async validatePassword(user: User, password: string): Promise<boolean> {
    return user && await user.validadePassword(password);
  }
}
