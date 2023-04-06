interface Person {
  name: string;
  friends: Person[];
}

type People = Person[];

export deafult function getAllFriendsNames(people: People) {
	const friendsNames = [];
	for (const person of people) {
		friendsNames.push(person.name);
		let friends = person.friends;
		let friendsLen = person.friends?.length;
		let index = 0;
		while (friendsLen) {
			const friend = friends[index];
			// console.log({name: person.name, friends, friendsLen, index, hasMoreFriends: friends.friends?.length })
			if (friend.friends?.length) { // Yes // No
				friends.push(...friend.friends);  // [‘Naresh’, ‘Suresh’]];
				friendsLen += friend.friends.length; // 2
			}
			friendsNames.push(friend.name);
			friendsLen--;  // 2 -> 1 then 1 -> 0
			index++; // 0 -> 1 then 1 -> 2

		}
	}	
	return friendsNames;
}
