import {
    Exclude,
    Expose
} from 'class-transformer';

export class PersonModel {

    @Expose()
    cpf: string;

    @Expose()
    name: string;

    @Exclude({ toPlainOnly: true })
    friends: string[];

    @Exclude({ toPlainOnly: true })
    createdAt: Date;

    constructor(cpf: string, name: string, friends: string[] = []) {
        this.cpf = cpf;
        this.name = name;
        this.friends = friends;
        this.createdAt = new Date()
    }
}