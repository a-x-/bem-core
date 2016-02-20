/**
 * @module i-bem__collection
 */
modules.define('i-bem__collection', ['inherit'], function(provide, inherit) {

/**
 * @class Collection
 */
var Collection = inherit(/** @lends Collection.prototype */{
    /**
     * @constructor
     * @param {Array} entities BEM entities
     */
    __constructor : function(entities) {
        this._entities = entities.slice();
    },

    setMod : buildForEachEntityMethodProxyFn('setMod'),

    delMod : buildForEachEntityMethodProxyFn('delMod'),

    toggleMod : buildForEachEntityMethodProxyFn('toggleMod'),

    everyHasMod : buildComplexProxyFn('every', 'hasMod'),

    someHasMod : buildComplexProxyFn('some', 'hasMod'),

    get : function(i) {
        return this._entities[i];
    },

    forEach : buildEntitiesMethodProxyFn('forEach'),
    map : buildEntitiesMethodProxyFn('map'),
    reduce : buildEntitiesMethodProxyFn('reduce'),
    reduceRight : buildEntitiesMethodProxyFn('reduceRight'),
    filter : buildEntitiesMethodProxyFn('filter'),
    some : buildEntitiesMethodProxyFn('some'),
    every : buildEntitiesMethodProxyFn('every'),

    has : function(entity) {
        return this._entities.indexOf(entity) > -1;
    },

    find : function(fn, ctx) {
        ctx || (ctx = this);
        var entities = this._entities,
            i = 0,
            entity;

        while(entity = entities[i])
            if(fn.call(ctx, entities, i++, this))
                return entity;

        return null;
    },

    concat : function() {
        var i = 0,
            l = arguments.length,
            arg,
            argsForConcat = [];

        while(i < l) {
            arg = arguments[i++];
            argsForConcat.push(
                arg instanceof Collection?  arg._entities : arg);
        }

        return new Collection(arrayConcat.apply(this._entities, argsForConcat));
    },

    size : function() {
        return this._entities.length;
    },

    toArray : function() {
        return this._entities.slice();
    }
});

var arrayConcat = Array.prototype.concat;

function buildForEachEntityMethodProxyFn(methodName) {
    return function() {
        var args = arguments;
        this._entities.forEach(function(entity) {
            entity[methodName].apply(entity, args);
        });
        return this;
    };
}

function buildEntitiesMethodProxyFn(methodName) {
    return function() {
        var entities = this._entities;
        return entities[methodName].apply(entities, arguments);
    };
}

function buildComplexProxyFn(arrayMethodName, entityMethodName) {
    return function() {
        var args = arguments;
        return this._entities[arrayMethodName](function(entity) {
            return entity[entityMethodName].apply(entity, args);
        });
    };
}

provide(Collection);

});
