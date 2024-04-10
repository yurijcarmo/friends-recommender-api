import { RelationshipService } from '../services';
import { RelationshipDto } from '../dtos';
import { RelationshipModel } from '../models';
import {
    Controller,
    Post,
    Body,
    Get,
    HttpCode
} from '@nestjs/common';

@Controller()
export class RelationshipController {

    constructor(
        private readonly relationshipService: RelationshipService
    ) { }

    @Post('relationship')
    @HttpCode(200)
    createRelationship(@Body() data: RelationshipDto): RelationshipModel {
        return this.relationshipService.createRelationship(
            data.cpf1,
            data.cpf2
        );
    }

    @Get('relationships')
    findByAll(): RelationshipModel[] {
        return this.relationshipService.getRelationships();
    }
}