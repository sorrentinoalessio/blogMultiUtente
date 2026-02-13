import { expect } from 'chai';
import fixturesUtils from '../../fixtures/fixturesUtils.js';
import SocketFixtures from '../../fixtures/SocketFixtures.js';
import sinon from 'sinon';
import { actions } from '../../../src/constants/const.js';
import { getMaxListeners } from 'events';


const sandbox = sinon.createSandbox();

let client;
let user;

describe('LIKE POST test', () => {
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

    describe('LIKE POST success', () => {
        it('Should like post', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const like = {
                postId: postData._id.toString(),
            }
            await new Promise((resolve, reject) => {
                client.emit(actions.LIKE_POST, like, (data) => {
                    if (data.error) return reject(data.error);
                    resolve(data.result.data);
                });
            });
            client.disconnect();
        })
    })

})
