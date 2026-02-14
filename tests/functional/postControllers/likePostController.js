import { expect } from 'chai';
import fixturesUtils from '../../fixtures/fixturesUtils.js';
import SocketFixtures from '../../fixtures/SocketFixtures.js';
import sinon from 'sinon';
import { actions } from '../../../src/constants/const.js';
import { getMaxListeners } from 'events';
import LikePostAction from '../../../src/components/actions/likePostAction.js';
import { isObjectIdOrHexString } from 'mongoose';
import mongoose from 'mongoose';


const sandbox = sinon.createSandbox();
const objectId = mongoose.Types.ObjectId;

let client;
let user;
let likeAction;

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
        likeAction = new LikePostAction(client, user);
        likeAction.process();

    });

    describe('LIKE POST and UNLIKE success', () => {
        it('Should like post', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const like = {
                postId: postData._id.toString(),
            }
            await new Promise((resolve, reject) => {
                client.emit(actions.LIKE_POST, like, (data) => {
                    if (data.error) return reject(data.error);
                    resolve(data.result.data);
                    expect(data.result.data.likes[0]).eq(user._id.toString())
                    expect(data.result.data.postId).eq(postData._id.toString())
                });
            });
            client.disconnect();
        })
        it('Should like post if exist at least one like', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const like = {
                postId: postData._id.toString(),
            }
            const likeFake = await fixturesUtils.createLikes({ postId: postData._id, likes: [new objectId()] }, true);
            await new Promise((resolve, reject) => {
                client.emit(actions.LIKE_POST, like, (data) => {
                    if (data.error) return reject(data.error);
                    resolve(data.result.data);
                    expect(data.result.data.likes[1]).eq(user._id.toString())
                    expect(data.result.data.postId).eq(postData._id.toString())
                });
            });
            client.disconnect();
        })
        it('Should unlike post if exist at least one likes with userId', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const like = {
                postId: postData._id.toString(),
            }
            const likeFake = await fixturesUtils.createLikes({ postId: postData._id, likes: [user._id] }, true);
            await new Promise((resolve, reject) => {
                client.emit(actions.LIKE_POST, like, (data) => {
                    if (data.error) return reject(data.error);
                    resolve(data.result.data);
                    expect(data.result.data.likes[0]).to.not.exist
                    expect(data.result.data.postId).eq(postData._id.toString())
                });
            });
            client.disconnect();
        })
    })



})
