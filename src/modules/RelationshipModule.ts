import { RelationshipController } from '../controllers';
import { PersonModule } from '.';
import { RelationshipService } from '../services';
import {
    Module,
    forwardRef
} from '@nestjs/common';

@Module({
    imports: [forwardRef(() => PersonModule)],
    controllers: [RelationshipController],
    providers: [RelationshipService],
    exports: [RelationshipService]
})
export class RelationshipModule { }
