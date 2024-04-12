import { Module, forwardRef } from '@nestjs/common';
import { RecommendationController } from '../controllers';
import { RecommendationService } from '../services';
import {
    PersonModule,
    RelationshipModule
} from '.';

@Module({
    imports: [
        forwardRef(() => PersonModule),
        forwardRef(() => RelationshipModule)
    ],
    controllers: [RecommendationController],
    providers: [RecommendationService],
    exports: [RecommendationService]
})
export class RecommendationModule { }
