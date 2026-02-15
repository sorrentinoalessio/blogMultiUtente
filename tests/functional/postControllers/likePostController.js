import { expect } from 'chai';
import fixturesUtils from '../../fixtures/fixturesUtils.js';
import SocketFixtures from '../../fixtures/SocketFixtures.js';
import sinon from 'sinon';
import { actions } from '../../../src/constants/const.js';
import { getMaxListeners } from 'events';
import LikePostAction from '../../../src/components/actions/likePostAction.js';
import { isObjectIdOrHexString } from 'mongoose';
import mongoose from 'mongoose';
import { console } from 'inspector';


const sandbox = sinon.createSandbox();
const objectId = mongoose.Types.ObjectId;

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

    describe('LIKE POST and UNLIKE success', () => {
        it('Should like post', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const result = await new Promise((resolve) => {
                client.emit(actions.LIKE_POST, { postId: postData._id.toString() }, (data) => {
                    resolve(data.result);
                });
            });
            expect(result.success).to.be.true;
            const likesAsStrings = result.data.likes.map(l => l.toString());
            expect(likesAsStrings).to.include(user._id.toString());
            expect(result.data.postId).eq(postData._id.toString());
            client.disconnect();
        });

        it('Should like post if exist at least one like', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const likeFake = await fixturesUtils.createLikes({ postId: postData._id, likes: [new objectId()] }, true);
            const result = await new Promise((resolve) => {
                client.emit(actions.LIKE_POST, { postId: postData._id.toString() }, (data) => {
                    resolve(data.result);
                });
            });
            expect(result.success).to.be.true;
            expect(result.data.likes.length).eq(2)
            expect(result.data.postId).eq(postData._id.toString())
            client.disconnect();
        });
        it('Should unlike post if exist at least one likes with userId', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const likeFake = await fixturesUtils.createLikes({ postId: postData._id, likes: [user._id] }, true);
            const result = await new Promise((resolve) => {
                client.emit(actions.LIKE_POST, { postId: postData._id.toString() }, (data) => {
                    resolve(data.result);
                });
            });
            expect(result.success).to.be.true;
            expect(result.data.likes.length).eq(0)
            expect(result.data.postId).eq(postData._id.toString())
            client.disconnect();
        });
    })

    describe('LIKE POST fail', () => {
        it('Should fail if postId is missing', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const result = await new Promise((resolve) => {
                client.emit(actions.LIKE_POST, {}, (data) => {
                    resolve(data.result);
                });
            });
            expect(result.success).to.be.false;
            expect(result.error).to.eq('"postId" is required');
            client.disconnect();
        });


        it('Should like post fail postId not string correct', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const result = await new Promise((resolve) => {
                client.emit(actions.LIKE_POST, { postId: 123 }, (data) => {
                    resolve(data.result);
                });
            });
            expect(result.success).to.be.false;
            expect(result.error).to.eq('"postId" must be a string');
            client.disconnect();
        });
         it('Should fail if postId not find ', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const fakePostId = new objectId().toString();
            const result = await new Promise((resolve) => {
                client.emit(actions.LIKE_POST, {postId: fakePostId}, (data) => {
                    resolve(data.result);
                });
            });
            expect(result.success).to.be.false;
            expect(result.error).to.eq(`Errore durante l'operazione: PostId ${fakePostId.toString()} non trovato`);
            client.disconnect();
        });



    });

})


