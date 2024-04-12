import { INestApplication, ValidationPipe } from "@nestjs/common";
import { RecommendationController } from "../../../src/controllers";
import { RecommendationService } from "../../../src/services";
import * as request from 'supertest';
import { 
    Test, 
    TestingModule 
} from "@nestjs/testing";

describe('RecommendationController Integration', () => {
    let app: INestApplication;
    let service: RecommendationService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RecommendationController],
            providers: [
                {
                    provide: RecommendationService,
                    useValue: {
                        getRecommendations: jest.fn(),
                    },
                },
            ],
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        service = module.get<RecommendationService>(RecommendationService);
        await app.init();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/recommendations/:cpf (GET) - should handle cases where no recommendations '
    + 'found', async () => {
        const cpf = '12345678901';
        jest.spyOn(service, 'getRecommendations').mockReturnValueOnce([]);

        await request(app.getHttpServer())
            .get(`/recommendations/${cpf}`)
            .expect(200)
            .expect([]);
    });

    it('/recommendations/:cpf (GET) - should handle cases where recommendations are '
    + 'present', async () => {
        const cpf = '12345678901';
        jest.spyOn(service, 'getRecommendations').mockReturnValueOnce([
            'Recommendation1',
            'Recommendation2'
        ]);

        await request(app.getHttpServer())
            .get(`/recommendations/${cpf}`)
            .expect(200)
            .expect(['Recommendation1', 'Recommendation2']);
    });
});
