import * as request from 'supertest';
import { SocialGraphController } from '../../../src/controllers';
import { SocialGraphService } from '../../../src/services';
import {
    Test,
    TestingModule
} from '@nestjs/testing';
import { 
    SocialGraphModel, 
    PersonModel, 
    RelationshipModel 
} from '../../../src/models';
import {
    HttpException,
    HttpStatus,
    INestApplication,
    ValidationPipe
} from '@nestjs/common';

describe('SocialGraphController (integration)', () => {
    let app: INestApplication;
    let service: SocialGraphService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SocialGraphController],
            providers: [
                {
                    provide: SocialGraphService,
                    useValue: {
                        createRandomData: jest.fn().mockImplementation(() => {
                            return new SocialGraphModel({
                                persons: [new PersonModel("298.462.390-74", "Alice")],
                                relationships: [new RelationshipModel(
                                    "298.462.390-74", 
                                    "942.852.260-36"
                                )] 
                            });
                        })
                    },
                },
            ],
        }).compile();

        app = module.createNestApplication();
        service = module.get<SocialGraphService>(SocialGraphService);
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/socialgraph/generate (POST) - should create random social graph data',
        async () => {
            await request(app.getHttpServer())
                .post('/socialgraph/generate')
                .expect(201)
                .expect(res => {
                    expect(res.body).toBeDefined();
                });
        });

    it('/socialgraph/generate (POST) - should handle creation failure',
        async () => {
            jest.spyOn(service, 'createRandomData').mockImplementationOnce(() => {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error',
                    message: 'Failed to generate data'
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            });

            const response = await request(app.getHttpServer())
                .post('/socialgraph/generate')
                .expect(500);

            expect(response.body.error).toBe('Internal Server Error');
            expect(response.body.message).toBe('Failed to generate data');
        });
});
