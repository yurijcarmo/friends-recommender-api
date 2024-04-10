import { Expose } from "class-transformer";
import { PersonModel, RelationshipModel } from ".";

export class SocialGraphModel {

    @Expose()
    persons: PersonModel[];

    @Expose()
    relationships: RelationshipModel[];

    constructor({ persons, relationships }:
        {
            persons: PersonModel[],
            relationships: RelationshipModel[]
        }
    ) {
        this.persons = persons;
        this.relationships = relationships;
    }
}
