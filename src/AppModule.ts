import { Module } from '@nestjs/common';
import {
  PersonModule,
  RecommendationModule,
  RelationshipModule,
  SocialGraphModule
} from './modules';

@Module({
  imports: [
    SocialGraphModule,
    PersonModule,
    RecommendationModule,
    RelationshipModule
  ]
})
export class AppModule { }
