modules.define('spec', ['i-bem', 'i-bem__collection'], function(provide, bem, bemCollection) {

describe('BEM collections', function() {
    var Block = bem.declBlock('block');

    describe('for each entity', function() {
        var entities, collection;

        beforeEach(function() {
            entities = [
                Block.create(),
                Block.create({ m1 : 'v1' }),
                Block.create({ m1 : 'v2' })
            ];
            collection = new bemCollection(entities);
        });

        it('setMod', function() {
            collection.setMod('m1', 'v3');
            entities.every(function(entity) {
                return entity.hasMod('m1', 'v3');
            }).should.be.true;
        });

        it('delMod', function() {
            collection.delMod('m1');
            entities.every(function(entity) {
                return !entity.hasMod('m1');
            }).should.be.true;
        });

        it('toggleMod', function() {
            collection.toggleMod('m1', 'v1', 'v2');
            entities[1].hasMod('m1', 'v2').should.be.true;
            entities[2].hasMod('m1', 'v1').should.be.true;
        });
    });

    describe('hasMod', function() {
        var collection;

        beforeEach(function() {
            collection = new bemCollection([
                Block.create({ m1 : 'v1' }),
                Block.create({ m1 : 'v1', m2 : 'v2' })
            ]);
        });

        it('everyHasMod', function() {
            collection.everyHasMod('m1', 'v1').should.be.true;
            collection.everyHasMod('m2').should.be.false;
        });

        it('someHasMod', function() {
            collection.someHasMod('m2', 'v2').should.be.true;
            collection.someHasMod('m3').should.be.false;
        });
    });
});

provide();

});
