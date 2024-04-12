import { RecommendationController } from '../../../src/controllers';
import { RecommendationService } from '../../../src/services';
import { ValidateCpfPipe } from '../../../src/pipes';
import {
    Test,
    TestingModule
} from '@nestjs/testing';

describe('RecommendationController', () => {
    let controller: RecommendationController;
    let service: RecommendationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RecommendationController],
            providers: [
                {
                    provide: RecommendationService,
                    useValue: {
                        getRecommendations: jest.fn().mockImplementation(
                            cpf => ['Recommendation1', 'Recommendation2']
                        ),
                    },
                },
                ValidateCpfPipe,
            ],
        }).compile();

        controller = module.get<RecommendationController>(RecommendationController);
        service = module.get<RecommendationService>(RecommendationService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findByCpf', () => {
        it('should return recommendations for a given cpf', () => {
            const cpf = '12345678901';
            const recommendations = controller.findByCpf(cpf);
            expect(recommendations).toEqual(['Recommendation1', 'Recommendation2']);
            expect(service.getRecommendations).toHaveBeenCalledWith(cpf);
        });

        it('should handle no recommendations found', () => {
            jest.spyOn(service, 'getRecommendations').mockReturnValueOnce([]);
            const cpf = '12345678901';
            const recommendations = controller.findByCpf(cpf);
            expect(recommendations).toEqual([]);
            expect(service.getRecommendations).toHaveBeenCalledWith(cpf);
        });
    });
});
