import {
    Exclude,
    Expose
} from "class-transformer";

export class RelationshipModel {

    @Expose()
    cpf1: string;

    @Expose()
    cpf2: string;

    @Exclude({ toPlainOnly: true })
    createdAt: Date;

    constructor(cpf1: string, cpf2: string) {
        this.cpf1 = cpf1;
        this.cpf2 = cpf2;
        this.createdAt = new Date();
    }
}