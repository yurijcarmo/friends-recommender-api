import { PersonController } from '../controllers';
import { RelationshipModule } from './RelationshipModule';
import { PersonService } from '../services';
import {
    Module
} from '@nestjs/common';

@Module({
    imports: [RelationshipModule],
    controllers: [PersonController],
    providers: [PersonService],
    exports: [PersonService]
})
export class PersonModule { }
