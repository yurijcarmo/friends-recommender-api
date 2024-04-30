import * as request from 'supertest';
import { PersonController } from '../../../src/controllers';
import { PersonService } from '../../../src/services';
import { PersonModel } from '../../../src/models';
import { 
    INestApplication,
    ValidationPipe 
} from '@nestjs/common';
import {
    Test,
    TestingModule
} from '@nestjs/testing';

describe('PersonController (integration)', () => {
    let app: INestApplication;
    let service: PersonService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PersonController],
            providers: [
                {
                    provide: PersonService,
                    useValue: {
                        createPerson: jest.fn().mockImplementation(
                            (dto: PersonModel) => ({ ...dto })
                        ),
                        getPerson: jest.fn().mockImplementation(
                            (cpf: string) => ({ cpf, name: 'Test Name' })
                        ),
                        cleanPersons: jest.fn().mockResolvedValue(undefined),
                        getPersons: jest.fn().mockResolvedValue([]),
                    },
                },
            ],
        }).compile();

        app = module.createNestApplication();
        service = module.get<PersonService>(PersonService);
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/persons (GET) - should handle cases where no persons found', async () => {
        jest.spyOn(service, 'getPersons').mockReturnValue([]);
        await request(app.getHttpServer())
            .get('/persons')
            .expect(200)
            .expect([]);
    });

    it('/person (POST) - should handle validation error', async () => {
        const invalidDto = { cpf: '123', name: '' };
        await request(app.getHttpServer())
            .post('/person')
            .send(invalidDto)
            .expect(400)
            .expect(res => {
                expect(res.body.message).toEqual([
                    "The document number must be a valid CPF with 11 digits",
                    "name should not be empty"
                ]);
            });
    });

    it('/person/:cpf (GET) - should retrieve a person by cpf', async () => {
        const cpf = '17534937060';
        await request(app.getHttpServer())
            .get(`/person/${cpf}`)
            .expect(200)
            .expect({
                cpf,
                name: 'Test Name'
            });
    });

    it('/person/:cpf (GET) - should handle error when cpf has less than 11 digits',
        async () => {
            const shortCpf = '1234567';
            await request(app.getHttpServer())
                .get(`/person/${shortCpf}`)
                .expect(400)
                .expect(res => {
                    expect(res.body.message).toContain(
                        'The CPF must have exactly 11 digits'
                    );
                });
        });

    it('/persons (GET) - should handle cases where no persons found',
        async () => {
            jest.spyOn(PersonService.prototype, 'getPersons')
                .mockReturnValue([]);
            await request(app.getHttpServer())
                .get('/persons')
                .expect(200)
                .expect([]);
        });

    it('/clean (DELETE) - should clean all persons', async () => {
        await request(app.getHttpServer())
            .delete('/clean')
            .expect(200);
    });
});
