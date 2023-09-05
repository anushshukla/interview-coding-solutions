interface LRUCacheHashmap {
    [cacheKeyName: string]: {
        value: string;
        nodeName: string;
    }
}

interface LRUCacheList {
    nodes: {
		[nodeName: string]: {
			cacheKeyName: string;
			next: string | null;
			prev: string | null;
		};
	};
	head: string | null;
	tail: string | null;
	counter: 0;
	size: 0;
}

function getParsedObjFromLocalStore<T>(keyNane: string, defaultValue = {} as T): T {
	const cache = localStorage.getItem(keyNane);
	if (!cache) {
		return defaultValue;
	}
    return JSON.parse(cache);
}

function setJsonObjToLocalStore<T>(keyNane: string, value: T): void {
	localStorage.setItem(keyNane, JSON.stringify(value));
    return;
}

class LRUCache {
	public static defaultLimit = 10;
	private _hashmap: LRUCacheHashmap;
	private _list: LRUCacheList;
	private _limit: number;

	public constructor(
		limit: number,
		linkList = getParsedObjFromLocalStore<LRUCacheList>('lru-cache-list', { head: null, tail: null, nodes: {}, size: 0, counter: 0 } as LRUCacheList),
		hashmap = getParsedObjFromLocalStore<LRUCacheHashmap>('lru-cache-hashmap')
	) {
		this._limit = limit;
		this._list = linkList;
		this._hashmap = hashmap;
	}

	public static clearStorage() {
		localStorage.removeItem('lru-cache-list');
		localStorage.removeItem('lru-cache-hashmap');
	}

	private _removeNode(nodeName: string): void {
		if (this._isListEmpty()) {
			console.error('node remove not possible in empty list');
			return;
		}

		if(!(nodeName in this._list.nodes)) {
			console.error(`${nodeName} not present in the list`, this._list.nodes);
			return;
		}
		
		this._list.size--;
		if (!this._list.tail) {
			this._list.head = null;
			this._list.nodes = {};
			return;
		}

		const nodeToDel = this._list.nodes[nodeName];

		if (nodeToDel.prev) {
			this._list.nodes[nodeToDel.prev].next = nodeToDel.next;
		} else {
			this._list.head = nodeToDel.next;
		}

		if (nodeToDel.next) {
			this._list.nodes[nodeToDel.next].prev = nodeToDel.prev;
		} else {
			this._list.tail = nodeToDel.prev;
		}

		delete this._list.nodes[nodeName];
	}

	private _addNode(cacheKeyName: string): void {
		this._list.counter++;
		this._list.size++;
		const nodeName = `node${this._list.counter}`;
		this._list.nodes[nodeName] = {
			cacheKeyName,
			next: null,
			prev: this._getLastNode(),
		};

		if (!this._list.head) {
			this._list.head = nodeName;
			return;
		}
		
		this._list.nodes[this._getLastNode()].next = nodeName;
		this._list.tail = nodeName;
		return;
	}

	private _getLastNode(): string {
		return (this._list.tail || this._list.head) as string;
	}

	private _isListEmpty(): boolean {
		return this._list.size === 0;
	}

	private _updateLocalStorage() {
		setJsonObjToLocalStore<LRUCacheList>('lru-cache-list', this._list);
		setJsonObjToLocalStore<LRUCacheHashmap>('lru-cache-hashmap', this._hashmap);
	}

	public get(key: string): string | null {
		if (!(key in this._hashmap)) {
			console.log('no cache available');
			return null;
		}
		const cache = this._hashmap[key];
		this._removeNode(cache.nodeName);
		this._addNode(key);
		this._hashmap[key].nodeName = this._getLastNode();
		this._updateLocalStorage();
		return cache.value;
	}

	public put(key: string, value: string): void {
		if (key in this._hashmap) {
			const cache = this._hashmap[key];
			this._removeNode(cache.nodeName);
			this._addNode(key);
			return;
		}
		
		if (this._list.size === this._limit) {
			const nodeToRemove = this._list.head;
			delete this._hashmap[this._list.nodes[nodeToRemove as string].cacheKeyName];
			this._removeNode(nodeToRemove as string);
		}
		
		this._addNode(key);
		this._hashmap[key] = {
			value,
			nodeName: this._getLastNode()
		};
		this._updateLocalStorage();
	}
}

// Test LRU when limit is reached
// LRUCache.clearStorage();
// const lruCache = new LRUCache(3);
// lruCache.put('key1', 'value1');
// lruCache.put('key2', 'value2');
// lruCache.put('key3', 'value3');
// lruCache.put('key4', 'value4'); // this should remove the LRU cache i.e. key1

// Test LRU when limit is reached after few cache hits
// LRUCache.clearStorage();
// const lruCache = new LRUCache(3);
// lruCache.put('key1', 'value1');
// lruCache.put('key2', 'value2');
// lruCache.put('key3', 'value3');

// // const lruCache = new LRUCache(3);
// console.log(lruCache.get('key2'));
// console.log(lruCache.get('key1'));
// lruCache.put('key4', 'value4'); // this should remove the LRU cache i.e. key3
