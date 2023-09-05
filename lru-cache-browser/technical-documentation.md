# Problem statement

Create LRU cache in the browser with data persistence using local storage for FE application performance optimization.

# Solution

## Intuition

Hashmap and double link list data structure implementation.

## Approach

Creating another hashmap to implement a double link list-like structure that can be serialized to store in the local storage of the browser.

## Complexity

Big O notation is going to be used for figuring out worst-case complexity.

Note: JSON stringify and parse performance impacts are disregarded for the sake of simplicity.

### Time complexity:
O(1)

### Space complexity:
O(2n) considering 2 structure  ~= O(n)

where n is the LRU size.

## Code

https://github.com/anushshukla/interview-coding-solutions/blob/production/lru-cache-browser/lru-cache-browser.ts
