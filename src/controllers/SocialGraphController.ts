import { SocialGraphModel } from '../models';
import { SocialGraphService } from '../services';
import {
    Controller,
    Post
} from '@nestjs/common';

@Controller('socialgraph')
export class SocialGraphController {

    constructor(
        private readonly socialGraphService: SocialGraphService
    ) { }

    @Post('generate')
    async createRandomData(): Promise<SocialGraphModel> {
        return this.socialGraphService.createRandomData()
    }
}