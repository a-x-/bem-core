modules.define(
    'test',
    ['i-bem__dom', 'jquery'],
    function(provide, DOM, $) {

describe('i-bem__dom', function() {
    describe('getMod', function() {
        it('should return properly extracted mod from html', function() {
            DOM.decl('block', {});

            [
                {
                    cls : '',
                    val : ''
                },
                {
                    cls : 'block_m1_v1',
                    val : 'v1'
                },
                {
                    cls : 'block_m1_v1 bla-block_m1_v2',
                    val : 'v1'
                },
                {
                    cls : 'bla-block_m1_v2 block_m1_v1',
                    val : 'v1'
                }
            ].forEach(function(data) {
                $('<div class="' + data.cls + '"/>').bem('block').getMod('m1')
                    .should.be.equal(data.val);
            });

            delete DOM.blocks['block'];
        });
    });

    describe('getMods', function() {
        it('should return properly extracted mods from html', function() {
            DOM.decl('block', {});

            [
                {
                    cls  : '',
                    mods : { js : 'inited' }
                },
                {
                    cls  : 'block_m1_v1',
                    mods : { js : 'inited', m1 : 'v1' }
                },
                {
                    cls  : 'block_m1_v1 block_m2_v2 bla-block_m4_v3 block_m4_v4',
                    mods : { js : 'inited', m1 : 'v1', m2 : 'v2', m4 : 'v4' }
                },
                {
                    cls  : 'bla-block_m1_v1 block_m2_v2 block_m3_v3 bla-block_m3_v4',
                    mods : { js : 'inited', m2 : 'v2', m3 : 'v3' }
                }
            ].forEach(function(data) {
                $('<div class="' + data.cls + '"/>').bem('block').getMods()
                    .should.be.eql(data.mods);
            });

            delete DOM.blocks['block'];
        });
    });

    describe('DOM.init', function() {
        it('should init block', function() {
            var spy = sinon.spy();
            DOM.decl('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            });

            var rootNode = DOM.init($(
                '<div>' +
                    '<div class="block i-bem" onclick="return {\'block\':{}}"/>' +
                '</div>'));

            spy.called.should.be.true;

            rootNode.remove();
            delete DOM.blocks['block'];
        });

        it('shouldn\'t init live block', function() {
            var spy = sinon.spy();
            DOM.decl('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            }, {
                live : true
            });

            var rootNode = DOM.init($(
                '<div>' +
                    '<div class="block i-bem" onclick="return {\'block\':{}}"/>' +
                '</div>'));

            DOM.init(rootNode);
            spy.called.should.be.false;

            rootNode.remove();
            delete DOM.blocks['block'];
        });
    });

    describe('DOM.destruct', function() {
        it('should destruct block only if it has no dom nodes', function() {
            var spy = sinon.spy();
            DOM.decl('block', {
                onSetMod : {
                    js : {
                        '' : spy
                    }
                }
            });

            var rootNode = DOM.init($(
                '<div>' +
                    '<div class="block i-bem" onclick="return {\'block\':{id:\'block\'}}"/>' +
                    '<div class="block i-bem" onclick="return {\'block\':{id:\'block\'}}"/>' +
                '</div>'));

            DOM.destruct(rootNode.find('.block:eq(0)'));
            spy.called.should.be.false;

            DOM.destruct(rootNode.find('.block'));
            spy.called.should.be.true;

            rootNode.remove();
            delete DOM.blocks['block'];
        });
    });

    describe('DOM.update', function() {
        it('should update tree', function() {
            var spyBlock1Destructed = sinon.spy(),
                spyBlock2Inited = sinon.spy();

            DOM.decl('block1', {
                onSetMod : {
                    js : {
                        '' : spyBlock1Destructed
                    }
                }
            });
            DOM.decl('block2', {
                onSetMod : {
                    js : {
                        inited : spyBlock2Inited
                    }
                }
            });

            var rootNode = DOM.init($(
                '<div>' +
                    '<div class="block1 i-bem" onclick="return {\'block1\':{}}"/>' +
                '</div>'));

            DOM.update(rootNode, '<div class="block2 i-bem" onclick="return {\'block2\':{}}"/>');

            spyBlock1Destructed.called.should.be.true;
            spyBlock2Inited.called.should.be.true;

            rootNode.remove();
            delete DOM.blocks['block1'];
            delete DOM.blocks['block2'];
        });
    });
});

provide();

});