import { ValidateCpfPipe } from '../pipes';
import { RecommendationService } from '../services';
import {
    Controller,
    Get,
    Param
} from '@nestjs/common';

@Controller('recommendations')
export class RecommendationController {

    constructor(
        private readonly recommendationService: RecommendationService
    ) { }

    @Get(':cpf')
    findByCpf(@Param('cpf', ValidateCpfPipe) cpf: string)
        : string[] {
        return this.recommendationService.getRecommendations(cpf);
    }
}