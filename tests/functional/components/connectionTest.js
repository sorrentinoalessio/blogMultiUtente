import { expect } from 'chai';
import fixturesUtils from '../../fixtures/fixturesUtils.js';
import SocketFixtures from '../../fixtures/SocketFixtures.js';
import sinon from 'sinon';
import { actions } from '../../../src/constants/const.js';


const sandbox = sinon.createSandbox();

let client;
let user;

describe('Connection test', () => {
    afterEach(async () => {
        sandbox.restore();
        await fixturesUtils.clearDb();
    });

    beforeEach(async () => {
        user = await fixturesUtils.createUser({}, true);
        client = SocketFixtures.createClient(user);
        client.connect();
        client.on("connect_error", (err) => {
            console.error("Connect error:", err.message);
        });

        await new Promise(resolve => client.once('connect', resolve));

    });

    describe('Connection success',() => {
        it('should connect success', async () => {
            const client = SocketFixtures.createClient(user);
            client.on('connect',(data) => {
                expect(client.connected).to.be.true;
                SocketFixtures.resultSynchronizer.increment();
            })
            client.connect();
            await SocketFixtures.resultSynchronizer.wait(1);
            client.disconnect();
        })
    
    })
})

   
