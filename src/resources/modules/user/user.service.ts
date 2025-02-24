import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { CompanyEntity } from '../company/entities/company.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
  ) {}

  private createToken(userId: string) {
    return jsonwebtoken.sign({ id: userId }, process.env.ACCESS_TOKEN, {
      expiresIn: '3d',
    });
  }

  private createRefreshToken(userId: string) {
    return jsonwebtoken.sign({ id: userId }, process.env.REFRESH_TOKEN, {
      expiresIn: '20d',
    });
  }

  async loginUserService(data: LoginUserDto) {
    try {
      const userExists = await this.userRepository.findOneBy({
        email: data.email,
      });

      // verifica se o usuario existe
      if (!userExists) {
        throw new HttpException(
          'Email de usuário incorreto!',
          HttpStatus.BAD_REQUEST,
        );
      }

      // remove a senha do objeto
      const { password, ...user } = userExists;

      const passwordConfirm = await bcrypt.compare(data.password, password);

      // verfica a senha esta correta
      if (!passwordConfirm) {
        throw new HttpException(
          'Email de usuário ou senha incorretos!',
          HttpStatus.BAD_REQUEST,
        );
      }

      // tokens
      const accessToken = this.createToken(userExists.id);
      const refreshToken = this.createRefreshToken(userExists.id);

      return {
        user: user,
        token: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserLoggedService(user: UserEntity) {
    try {
      const foundUser = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.company', 'company')
        .where('user.id = :id', { id: user.id })
        .getOne();

      if (!foundUser) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }

      return {
        ...foundUser,
        password: undefined,
        company: foundUser.company,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async registerUserService(data: RegisterUserDto) {
    try {
      // Verifica se o usuário já existe
      const userExists = await this.userRepository.findOneBy({
        email: data.email,
      });

      if (userExists) {
        throw new HttpException(
          'Email já utilizado ou incorreto!',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Criptografa a senha
      const passwordEncrypt = await bcrypt.hash(data.password, 10);
      data.password = passwordEncrypt;

      if (!passwordEncrypt) {
        throw new HttpException(
          'Encrypt error!',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const company = this.companyRepository.create({
        name: `Empresa de ${data.name}`,
      });

      const companyCreated = await this.companyRepository.save(company);

      const user = this.userRepository.create({
        ...data,
        company: companyCreated,
      });

      const userCreated = await this.userRepository.save(user);

      const accessToken = this.createToken(userCreated.id);
      const refreshToken = this.createRefreshToken(userCreated.id);

      return {
        user: userCreated,
        token: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
