import { expect } from 'chai';
import fixturesUtils from '../../fixtures/fixturesUtils.js';
import SocketFixtures from '../../fixtures/SocketFixtures.js';
import sinon from 'sinon';
import { actions } from '../../../src/constants/const.js';
import { getMaxListeners } from 'events';
import LikePostAction from '../../../src/components/actions/enrollPostAction.js';
import { isObjectIdOrHexString } from 'mongoose';
import mongoose from 'mongoose';
import { console } from 'inspector';


const sandbox = sinon.createSandbox();
const objectId = mongoose.Types.ObjectId;

let client;
let user;

describe('enroll POST test', () => {
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

    });

    describe('enroll POST and UNLIKE success', () => {
        it('Should enroll post', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const result = await new Promise((resolve) => {
                client.emit(actions.ENROLL_POST, { postId: postData._id.toString() }, (data) => {
                    resolve(data.result);
                });
            });
            expect(result.success).to.be.true;
            const enrollsAsStrings = result.data.enroll.map(l => l.toString());
            expect(enrollsAsStrings).to.include(user._id.toString());
            expect(result.data.postId).eq(postData._id.toString());
            client.disconnect();
        });

        it('Should enroll post if exist at least one enroll', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const enrollFake = await fixturesUtils.createLikes({ postId: postData._id, enroll: [new objectId()] }, true);
            const result = await new Promise((resolve) => {
                client.emit(actions.ENROLL_POST, { postId: postData._id.toString() }, (data) => {
                    resolve(data.result);
                });
            });
            expect(result.success).to.be.true;
            expect(result.data.enroll.length).eq(2)
            expect(result.data.postId).eq(postData._id.toString())
            client.disconnect();
        });
        it('Should unenroll post if exist at least one enroll with userId', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const enrollFake = await fixturesUtils.createLikes({ postId: postData._id, enroll: [user._id] }, true);
            const result = await new Promise((resolve) => {
                client.emit(actions.ENROLL_POST, { postId: postData._id.toString() }, (data) => {
                    resolve(data.result);
                });
            });
            expect(result.success).to.be.true;
            expect(result.data.enroll.length).eq(0)
            expect(result.data.postId).eq(postData._id.toString())
            client.disconnect();
        });
    })

    describe('enroll POST fail', () => {
        it('Should fail if postId is missing', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const result = await new Promise((resolve) => {
                client.emit(actions.ENROLL_POST, {}, (data) => {
                    resolve(data.result);
                });
            });
            expect(result.success).to.be.false;
            expect(result.error).to.eq('"postId" is required');
            client.disconnect();
        });


        it('Should enroll post fail postId not string correct', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const result = await new Promise((resolve) => {
                client.emit(actions.ENROLL_POST, { postId: 123 }, (data) => {
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
                client.emit(actions.ENROLL_POST, {postId: fakePostId}, (data) => {
                    resolve(data.result);
                });
            });
            expect(result.success).to.be.false;
            expect(result.error).to.eq(`Errore durante l'operazione: PostId ${fakePostId.toString()} non trovato`);
            client.disconnect();
        });



    });

})


