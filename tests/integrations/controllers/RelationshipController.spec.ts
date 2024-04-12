import * as request from 'supertest';
import { RelationshipController } from '../../../src/controllers';
import { RelationshipService } from '../../../src/services';
import { RelationshipModel } from '../../../src/models';
import {
    Test,
    TestingModule
} from '@nestjs/testing';
import {
    INestApplication,
    ValidationPipe,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

describe('RelationshipController (integration)', () => {
    let app: INestApplication;
    let service: RelationshipService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RelationshipController],
            providers: [
                {
                    provide: RelationshipService,
                    useValue: {
                        createRelationship: jest.fn().mockImplementation(
                            (cpf1, cpf2) => ({ cpf1, cpf2, createdAt: new Date() })
                        ),
                        getRelationships: jest.fn().mockReturnValue([]),
                    },
                },
            ],
        }).compile();

        app = module.createNestApplication();
        service = module.get<RelationshipService>(RelationshipService);
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/relationship (POST) - should create a relationship', async () => {
        const relationshipDto = { cpf1: '12345678901', cpf2: '98765432101' };
        await request(app.getHttpServer())
            .post('/relationship')
            .send(relationshipDto)
            .expect(200)
            .expect(res => {
                expect(res.body.cpf1).toEqual(relationshipDto.cpf1);
                expect(res.body.cpf2).toEqual(relationshipDto.cpf2);
                expect(res.body.createdAt).toBeDefined();
            });
        expect(service.createRelationship).toHaveBeenCalledWith(
            relationshipDto.cpf1,
            relationshipDto.cpf2
        );
    });

    it('/relationships (GET) - should return all relationships', async () => {
        jest.spyOn(service, 'getRelationships').mockReturnValueOnce([]);

        await request(app.getHttpServer())
            .get('/relationships')
            .expect(200)
            .expect([]);
    });

    it('/relationship (POST) - should handle invalid input', async () => {
        const invalidRelationshipDto = { cpf1: '123', cpf2: '456' };

        await request(app.getHttpServer())
            .post('/relationship')
            .send(invalidRelationshipDto)
            .expect(400);
    });

    it('/relationship (POST) - should handle creation failure', async () => {
        const relationshipDto = { cpf1: '99999999999', cpf2: '88888888888' };
        jest.spyOn(service, 'createRelationship').mockImplementationOnce(() => {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Internal Server Error',
                message: 'Failed to create relationship due to database error'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        await request(app.getHttpServer())
            .post('/relationship')
            .send(relationshipDto)
            .expect(500)
            .expect({
                status: 500,
                error: 'Internal Server Error',
                message: 'Failed to create relationship due to database error'
            });
    });

    it('/relationships (GET) - should return a non-empty relationship list',
        async () => {
            const relationships = [
                new RelationshipModel('12345678901', '98765432101'),
                new RelationshipModel('11111111111', '22222222222')
            ];
            jest.spyOn(service, 'getRelationships').mockReturnValueOnce(relationships);

            await request(app.getHttpServer())
                .get('/relationships')
                .expect(200)
                .expect(res => {
                    expect(res.body.length).toBe(2);
                    expect(res.body[0].cpf1).toBe('12345678901');
                    expect(res.body[1].cpf1).toBe('11111111111');
                });
        });
});
