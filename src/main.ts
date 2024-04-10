import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './AppModule';
import * as dotenvFlow from 'dotenv-flow';
import { AllExceptionsFilter } from './filters';
import {
    Logger,
    ValidationPipe,
    ClassSerializerInterceptor
} from '@nestjs/common';

async function bootstrap() {
    try {
        dotenvFlow.config();

        const app = await NestFactory.create(AppModule);

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true
            })
        );

        app.useGlobalInterceptors(new ClassSerializerInterceptor(
            app.get(Reflector)
        ));

        app.useGlobalFilters(new AllExceptionsFilter());

        const port = process.env.PORT;
        await app.listen(port);
        Logger.debug(
            `Listening on http://localhost:${port}/`
        );
    } catch (error) {
        console.error('Error during application startup:', error);
        process.exit(1);
    }
}

bootstrap();
