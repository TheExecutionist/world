function Chain() {
    this.chain = {};
    this.length = 0;
}

Chain.prototype.set = function (key, value) {
    this.chain[key] = value;
    this.length++;
}

Chain.prototype.get = function (key) {
    return this.chain[key];
}

Chain.prototype.has = function (key) {
    return this.chain.hasOwnProperty(key);
}

Chain.prototype.delete = function (key) {
    delete this.chain[key];
    this.length--;
}

Chain.prototype.clear = function () {
    this.chain = {};
    this.length = 0;
}

Chain.prototype.forEach = function (callback) {
    let i = 0;
    for (const key in this.chain) {
        callback(this.chain[key], key, i++);
    }
}

Chain.prototype.map = function (callback) {
    const result = [];

    for (const value of this) {
        result.push(callback(value));
    }

    return result;
}

Chain.prototype.mapToChain = function (callback) {
    for (const key in this.chain) {
        this.chain[key] = callback(this.chain[key], key);
    }

    return this;
}

Chain.prototype.filter = function (callback) {
    const result = [];

    for (const value of this) {
        if (callback(value)) {
            result.push(value);
        }
    }

    return result;
}

Chain.prototype.filterToChain = function (callback) {
    for (const key in this.chain) {
        if (!callback(this.chain[key], key)) {
            delete this.chain[key];
            this.length--;
        }
    }
    
    return this;
}

Chain.prototype[Symbol.iterator] = function () {
    let i = 0;
    const chain = this.chain;
    const keys = Object.keys(chain);
    const length = keys.length;

    return {
        next: function () {
            if (i < length) {
                return {
                    value: chain[keys[i++]],
                    done: false
                };
            } else {
                return {
                    done: true
                };
            }
        }
    };
}

module.exports = Chain;