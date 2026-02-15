import { expect } from 'chai';
import fixturesUtils from '../../fixtures/fixturesUtils.js';
import SocketFixtures from '../../fixtures/SocketFixtures.js';
import sinon from 'sinon';
import { actions } from '../../../src/constants/const.js';
import CommentPostAction from '../../../src/components/actions/commentPostAction.js';


const sandbox = sinon.createSandbox();

let client;
let user;
let commentAction;

describe('COMMENT POST test', () => {
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

    describe('COMMENT POST success', () => {
        it('Should comment post', async () => {

            const postData = await fixturesUtils.createPost({ ownerId: user._id }, true);
            const comment = {
                postId: postData._id.toString(),
                comment: "comment new"
            }
            const result = await new Promise((resolve, reject) => {
                client.emit(actions.COMMENT_POST, comment, (data) => {
                    resolve(data.result);
                });
            });
            expect(result.data._id).to.exist;
            expect(result.data.comment).eq(comment.comment);
            expect(result.data.ownerId).eq(user._id.toString());
            expect(result.data.postId).eq(postData._id.toString());
            client.disconnect();
        })
    })

})
