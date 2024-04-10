import { PersonService } from '.';
import { PersonModel } from '../models';
import { 
    Injectable, 
    NotFoundException 
} from '@nestjs/common';

@Injectable()
export class RecommendationService {
    constructor(
        private readonly personService: PersonService
    ) {}

    getRecommendations(cpf: string): string[] {
        try {
            const person = this.personService.getPerson(cpf);
            const friendsOfFriends = this.getFriendsOfFriends(person);
            const recommendations = this.filterNonFriends(
                person, 
                friendsOfFriends
            );
            this.sortRecommendations(
                person, 
                recommendations
            );
            return recommendations;

        } catch (error) {
            throw new NotFoundException(
                `Failed to get recommendations: ${error.message}`
            );
        }
    }

    private sortRecommendations(person: PersonModel, recommendations: string[])
    : void {
        const friendDetails = recommendations.map(friendCpf => ({
            cpf: friendCpf,
            commonFriendsCount: this.countCommonFriends(person.friends, friendCpf)
        }));

        friendDetails.sort((a, b) => b.commonFriendsCount - a.commonFriendsCount);
        recommendations.splice(
            0, recommendations.length, ...friendDetails.map(f => f.cpf)
        );
    }

    private getFriendsOfFriends(person: PersonModel): Set<string> {
        const friendsOfFriends = new Set<string>();

        person.friends.forEach(friendCpf => {
            const friend = this.personService.getPerson(friendCpf);
            friend.friends.forEach(friendOfFriendCpf => {
                if (
                    friendOfFriendCpf !== person.cpf 
                    && !person.friends.includes(friendOfFriendCpf)
                ) {
                    friendsOfFriends.add(friendOfFriendCpf);
                }
            });
        });

        return friendsOfFriends;
    }

    private countCommonFriends(personFriends: string[], potentialFriendCpf: string)
    : number {
        const potentialFriend = this.personService.getPerson(potentialFriendCpf);

        return personFriends.reduce((count, currentFriendCpf) => {
            const isCommonFriend = potentialFriend.friends
                .includes(currentFriendCpf);
            return count + (isCommonFriend ? 1 : 0);
        }, 0);
    }


    private filterNonFriends(person: PersonModel, friendsOfFriends: Set<string>)
    : string[] {
        return Array.from(friendsOfFriends).filter(
            friend => !person.friends.includes(friend)
        );
    }
}
