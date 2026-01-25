import { expect, should } from "chai";
import SocketFixtures from "../../fixtures/SocketFixtures.js";
import fixturesUtils from "../../fixtures/fixturesUtils.js";

describe('Connection tests', () => {
    beforeEach(async () => {

        await fixturesUtils.clearDb();
    });
    describe('Connection success',() => {
        it('should connect success', async () => {
            const client = SocketFixtures.createClient();
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

   
