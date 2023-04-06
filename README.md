# Interview Coding Solutions

## Problem statements

### Simple number parser

#### Problem statement

The goal is to create a javascript function that behaves similar to Number() or parseInt(). In other words; a function that accepts a string as input and provides its equivalent integer as output. You are free to use any approach but refrain from using Number() and parseInt() methods itself or any kind of implicit or explicit type-casting.

#### Solution

##### Assumptions
- Integers only (no decimals, complex numbers, etc.)
- parseInt output behavior to be considered

Code: https://github.com/anushshukla/interview-coding-solutions/blob/production/simple-number-parser.ts

### Unique numbers count

#### Problem statement

For a given input return the count of unique numbers.

Ex:

I/P = `[1, 1, 1, 1, 2]`
Expected O/P: 2


#### Solution

##### Assumptions
- Input is going to array of numbers

Code: https://github.com/anushshukla/interview-coding-solutions/blob/production/get-unique-num-count.ts

### Get all friends of friends

#### Problem statement

For a given input return the count of unique numbers.

Ex:

I/P =
```json
[
    {
        "name": "Rahul",
        "friends": [
            {
                "name": "Manasi",
                "friends": [
                    {
                        "name": "Madhura",
                        "friends": [
                            {
                                "name": "Shubham"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "Pinky",
        "friends": [
            {
                "name": "Anoop",
                "friends": [
                    {
                        "name": "Ram"
                    }
                ]
            },
            {
                "name": "Sham"
            }
        ]
    },
    {
        "name": "Dinesh",
        "friends": [
            {
                "name": "Geeta",
                "friends": [
                    {
                        "name": "Anurag"
                    },
                    {
                        "name": "Vishal",
                        "friends": [
                            {
                                "name": "Vaishnavi"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Rupesh",
                "friends": [
                    {
                        "name": "Akshay"
                    }
                ]
            }
        ]
    },
    {
        "name": "Bittu",
        "friends": [
            {
                "name": "Vineet",
                "friends": [
                    {
                        "name": "Pankaj"
                    }
                ]
            },
            {
                "name": "Tony"
            }
        ]
    }
]
```

Print all the Friends of friends names

Expected O/P: `['Rahul', 'Manasi', 'Madhura', 'Shubham', 'Pinky', 'Anoop', 'Sham', 'Ram', 'Dinesh', 'Geeta', 'Rupesh', 'Anurag', 'Vishal', 'Akshay', 'Vaishnavi', 'Bittu', 'Vineet', 'Tony', 'Pankaj']`


#### Solution

##### Assumptions
- Input is array of Person where each person would have a name as string and an optional property as friends which will can be an array of Person.

Code: https://github.com/anushshukla/interview-coding-solutions/blob/production/get-all-friends.ts



