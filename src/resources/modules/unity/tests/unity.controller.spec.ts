import { Test, TestingModule } from '@nestjs/testing';
import { UnityController } from '../unity.controller';
import { UnityService } from '../unity.service';

describe('UnityController', () => {
  let controller: UnityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnityController],
      providers: [UnityService],
    }).compile();

    controller = module.get<UnityController>(UnityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
