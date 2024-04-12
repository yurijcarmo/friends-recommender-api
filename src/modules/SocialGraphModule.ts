import { SocialGraphController } from '../controllers';
import { SocialGraphService } from '../services';
import { Module } from '@nestjs/common';
import {
    PersonModule,
    RelationshipModule,
} from '.';

@Module({
    imports: [
        RelationshipModule,
        PersonModule
    ],
    controllers: [SocialGraphController],
    providers: [SocialGraphService],
    exports: [SocialGraphService]
})
export class SocialGraphModule { }
