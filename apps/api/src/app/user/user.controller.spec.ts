import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            readUsers: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
            createUser: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
            readUserById: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
            createFarmer: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
            addDocToFarmer: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
            deleteFarmerDoc: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
