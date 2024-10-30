import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtStrategy } from '../jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn((req) => {
      return { accessToken: 'fake_token' };  // valor simulado de retorno para o login
    }),
    validateUser: jest.fn((name, password) => {
      if (name !== 'test' || password !== '123') {
        return
      }
      return { name: 'test', password: 'salt' };
    })
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }, JwtStrategy],

    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should login with valid credentials', () => {
      const req = {
        name: "test",
        password: "123"
      }
      expect(authController.login(req).then((res) => {
        expect(res).toEqual({ accessToken: 'fake_token' });
      }));
    });
  });
  
  it('should not login with invalid credentials', async () => {
    const req = {
      name: "test2",
      password: "123"
    }
    await expect(authController.login(req)).rejects.toThrow(UnauthorizedException);
  });
});
