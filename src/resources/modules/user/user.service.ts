import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { CompanyEntity } from '../company/entities/company.entity';
import { UnitEntity } from '../unity/entities/unity.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,

    @InjectRepository(UnitEntity)
    private unitRepository: Repository<UnitEntity>,
  ) {}

  private createToken(userId: string, companyId: string) {
    return jsonwebtoken.sign(
      { id: userId, cId: companyId },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: '3d',
      },
    );
  }

  private createRefreshToken(userId: string, companyId: string) {
    return jsonwebtoken.sign(
      { id: userId, cId: companyId },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: '20d',
      },
    );
  }

  async loginUserService(data: LoginUserDto) {
    try {
      const userExists = await this.userRepository.findOne({
        where: { email: data.email },
        relations: ['company'], // Carrega a empresa automaticamente
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

      // Verifica se a empresa foi carregada corretamente
      if (!userExists.company) {
        throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
      }

      // tokens
      const accessToken = this.createToken(
        userExists.id,
        userExists.company.id,
      );
      const refreshToken = this.createRefreshToken(
        userExists.id,
        userExists.company.id,
      );

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

      const unit = this.unitRepository.create({
        name: 'Unidade',
        company: companyCreated,
      });

      await this.unitRepository.save(unit);

      const user = this.userRepository.create({
        ...data,
        company: companyCreated,
      });

      const userCreated = await this.userRepository.save(user);

      const accessToken = this.createToken(userCreated.id, companyCreated.id);
      const refreshToken = this.createRefreshToken(
        userCreated.id,
        companyCreated.id,
      );

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

  async impersonateUserService(userId: string) {
    // Busque o usuário
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['company'],
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    if (!user.company) {
      throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
    }

    // Gere os tokens
    const accessToken = this.createToken(user.id, user.company.id);
    const refreshToken = this.createRefreshToken(user.id, user.company.id);

    return {
      user: {
        ...user,
        password: undefined, // Nunca retorne a senha
      },
      token: accessToken,
      refreshToken: refreshToken,
    };
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
