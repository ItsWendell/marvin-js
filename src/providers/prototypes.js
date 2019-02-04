/**
 * Splits an array into multiple chunks.
 */
Array.prototype.chunk = function (groupsize) {
    var sets = [], chunks, i = 0;
    chunks = this.length / groupsize;

    while (i < chunks) {
        sets[i] = this.splice(0, groupsize);
        i++;
    }

    return sets;
};