/* eslint-disable import/no-unresolved, no-shadow */
import on from 'src/on';
import once from 'src/once';
import onDebounce from 'src/ondebounce';
import off from 'src/off';
import trigger from 'src/trigger';
import bindNode from 'src/bindnode';
import createSpy from '../../helpers/createspy';
import makeObject from '../../helpers/makeobject';
import simulateClick from '../../helpers/simulateclick';
import MatreshkaArray from 'src/array';
import MatreshkaObject from 'src/object';

describe('Events summary (on, once, onDebounce, off, trigger)', () => {
    let obj;
    let handler;
    let node;
    let childNode;
    let grandchildNode;

    beforeEach(() => {
        obj = {};
        handler = createSpy();
        node = window.document.body.appendChild(
            window.document.createElement('div')
        );

        node.innerHTML = `
            <div id="child">
                <div class="grandchild">

                </div>
            </div>
        `;

        childNode = node.querySelector('#child');
        grandchildNode = node.querySelector('.grandchild');
    });

    afterEach(() => {
        window.document.body.removeChild(node);
    });

    it('fires', () => {
        on(obj, 'someevent', handler);
        trigger(obj, 'someevent');
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('fires work in context of an object which has isMatreshka=true property', () => {
        const obj = { isMatreshka: true };
        on.call(obj, 'someevent', handler);
        trigger.call(obj, 'someevent');
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('removes', () => {
        on(obj, 'someevent', handler);
        off(obj, 'someevent');
        trigger(obj, 'someevent');

        expect(handler).not.toHaveBeenCalled();
    });

    it('removes work in context of an object which has isMatreshka=true property', () => {
        const obj = { isMatreshka: true };
        on.call(obj, 'someevent', handler);
        off.call(obj, 'someevent');
        trigger.call(obj, 'someevent');

        expect(handler).not.toHaveBeenCalled();
    });

    it('fires delegated', () => {
        const obj = makeObject('a.b.c');
        on(obj, 'a.b.c@someevent', handler);
        trigger(obj.a.b.c, 'someevent');
        expect(handler).toHaveBeenCalledTimes(1);
    });


    it('removes delegated', () => {
        const obj = makeObject('a.b.c');
        on(obj, 'a.b.c@someevent', handler);
        off(obj, 'a.b.c@someevent');
        trigger(obj.a.b.c, 'someevent');
        expect(handler).not.toHaveBeenCalled();
    });

    it('fires DOM event with no selector', () => {
        bindNode(obj, 'x', '#child');
        on(obj, 'click::x', handler);
        simulateClick(childNode);
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('removes DOM event with no selector', () => {
        on(obj, 'click::x', handler);
        off(obj, 'click::x');
        bindNode(obj, 'x', '#child');
        simulateClick(childNode);
        expect(handler).not.toHaveBeenCalled();
    });

    it('fires DOM event using selector', () => {
        bindNode(obj, 'x', '#child');
        on(obj, 'click::x(.grandchild)', handler);
        simulateClick(grandchildNode);
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('triggers DOM event via trigger', () => {
        const handler = createSpy((a, b) => expect(a + b).toEqual(3));
        bindNode(obj, 'x', '#child');
        on(obj, 'click::x', handler);
        trigger(obj, 'click::x', 1, 2);

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('triggers once', () => {
        once(obj, 'someevent', handler);
        trigger(obj, 'someevent');
        trigger(obj, 'someevent');
        trigger(obj, 'someevent');

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('allows to pass name-handler object to "once"', () => {
        const handlers = {
            foo: createSpy(),
            bar: createSpy()
        };

        once(obj, handlers);

        trigger(obj, 'foo');
        trigger(obj, 'bar');

        expect(handlers.foo).toHaveBeenCalledTimes(1);
        expect(handlers.bar).toHaveBeenCalledTimes(1);

        trigger(obj, 'foo');
        trigger(obj, 'bar');

        expect(handlers.foo).toHaveBeenCalledTimes(1);
        expect(handlers.bar).toHaveBeenCalledTimes(1);
    });

    it('triggers once in context of an object which has isMatreshka=true property', () => {
        const obj = { isMatreshka: true };
        once.call(obj, 'someevent', handler);
        trigger.call(obj, 'someevent');
        trigger.call(obj, 'someevent');
        trigger.call(obj, 'someevent');

        expect(handler).toHaveBeenCalledTimes(1);
    });


    it('onDebounce works', done => {
        setTimeout(() => {
            expect(handler).toHaveBeenCalledTimes(1);
            done();
        }, 200);

        onDebounce(obj, 'someevent', handler);
        trigger(obj, 'someevent');
        trigger(obj, 'someevent');
        trigger(obj, 'someevent');
    });

    it('onDebounce work in context of an object which has isMatreshka=true property', done => {
        const obj = { isMatreshka: true };

        setTimeout(() => {
            expect(handler).toHaveBeenCalledTimes(1);
            done();
        }, 200);

        onDebounce.call(obj, 'someevent', handler);
        trigger.call(obj, 'someevent');
        trigger.call(obj, 'someevent');
        trigger.call(obj, 'someevent');
    });

    it('allows to pass name-handler object to "on" and "off"', () => {
        const handlers = {
            foo: createSpy(),
            bar: createSpy()
        };

        on(obj, handlers);

        trigger(obj, 'foo');
        trigger(obj, 'bar');

        expect(handlers.foo).toHaveBeenCalledTimes(1);
        expect(handlers.bar).toHaveBeenCalledTimes(1);

        off(obj, handlers);

        trigger(obj, 'foo');
        trigger(obj, 'bar');

        expect(handlers.foo).toHaveBeenCalledTimes(1);
        expect(handlers.bar).toHaveBeenCalledTimes(1);
    });

    it('allows to pass name-handler object to "onDebounce"', done => {
        const handlers = {
            foo: createSpy(),
            bar: createSpy()
        };

        setTimeout(() => {
            expect(handlers.foo).toHaveBeenCalledTimes(1);
            expect(handlers.bar).toHaveBeenCalledTimes(1);
            done();
        }, 200);

        onDebounce(obj, handlers);

        trigger(obj, 'foo');
        trigger(obj, 'bar');
        trigger(obj, 'foo');
        trigger(obj, 'bar');
    });

    it('allows to flip context and triggerOnInit (on)', () => {
        const thisArg = {};
        const handler = createSpy(() => {
            expect(this).toEqual(thisArg);
        });

        on(obj, 'foo', handler, true, thisArg);
        on(obj, 'bar', handler, thisArg, true);
        expect(handler).toHaveBeenCalledTimes(2);
    });

    it('allows to attatch "*" events to Matreshka.Array instance', () => {
        const obj = new MatreshkaArray();
        const handler = createSpy();

        on(obj, '*@someevent', handler);
        obj.push({});
        trigger(obj[0], 'someevent');
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('allows to attatch "*" event to Matreshka.Object instance', () => {
        const obj = new MatreshkaObject();
        const handler = createSpy();

        on(obj, '*@someevent', handler);
        obj.setData('x', {});
        trigger(obj.x, 'someevent');
        expect(handler).toHaveBeenCalledTimes(1);
    });
});
