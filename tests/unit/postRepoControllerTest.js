import * as chai from 'chai';
const { expect } = chai;
import { request } from 'chai-http';
import app from '../../server.js'
import CryptoUtils from '../../src/utils/CryptoUtils.js';
import fixturesUtils from '../../tests/fixtures/fixturesUtils.js';
import sinon from 'sinon';
import { postStatus, actions } from '../../src/constants/const.js';
import { io as ioClient } from 'socket.io-client';


const sandbox = sinon.createSandbox();
let user;
let token;


describe('Repo post controller tests', () => {
    afterEach(async () => {
        await fixturesUtils.clearDb();
        sandbox.restore();
    });
    beforeEach(async () => {
        await fixturesUtils.clearDb();
        user = await fixturesUtils.createUser({}, true);
        token = CryptoUtils.generateToken(user, 86400);
    });

    describe('GET  post by Id fail', () => {
        it('Should return empty array if post not exist', (done) => {
            const clientSocket = ioClient(`http://localhost:3001/blog`, {
                auth: { accessToken: token }
            });

            clientSocket.on('connect_error', (err) => {
                clientSocket.close();
                done(err);
            });

            clientSocket.on('connect', () => {
                clientSocket.emit(actions.LIST_POST, {}, (response) => {
                    try {
                        expect(response.result.success).to.be.true;
                        expect(response.result.data).to.deep.eq([]);
                        clientSocket.close();
                        done();
                    } catch (err) {
                        clientSocket.close();
                        done(err);
                    }
                });
            });
        });
    });

    it('Should return error if token is not provided', (done) => {
        const clientSocket = ioClient(`http://localhost:3001/blog`, {
            auth: {}
        });

        clientSocket.on('connect_error', (err) => {
            try {
                expect(err.message).to.eq('Token mancante');
                clientSocket.close();
                done();
            } catch (assertErr) {
                clientSocket.close();
                done(assertErr);
            }
        });

        clientSocket.on('connect', () => {
            clientSocket.close();
            done(new Error('La connessione non doveva riuscire senza token'));
        });
    });

    describe('GET post repo success', () => {
        it('Should return list of posts', (done) => {
            const clientSocket = ioClient(`http://localhost:3001/blog`, {
                auth: { accessToken: token }
            });

            clientSocket.on('connect_error', (err) => {
                clientSocket.close();
                done(err);
            });

            clientSocket.on('connect', () => {
                clientSocket.emit(actions.LIST_POST, {}, (response) => {
                    try {
                        expect(response.result.success).to.be.true;
                        expect(response.result.data).to.be.an('array');
                        clientSocket.close();
                        done();
                    } catch (err) {
                        clientSocket.close();
                        done(err);
                    }
                });
            });
        });
    });

    describe('GET post by postId and userId success', () => {
        it('Should return 201 post', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const res = await request.execute(app)
                .get(`/user/post/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).eq(201);
        })
    })

    describe('GET posts public', () => {
        it('Should return 201 post', async () => {
            const postData = await fixturesUtils.createPost({ status: postStatus.PUBLIC, ownerId: user._id }, true);
            const res = await request.execute(app)
                .get(`/post`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).eq(201);
        })
    })

    describe('GET post ,comment and like public ', () => {
        it('Should return 201 post', async () => {
            const postData = await fixturesUtils.createPost({ status: postStatus.PUBLIC }, true);
            const comment = await fixturesUtils.createComment({ ownerId: user._id, postId: postData._id }, true);
            const like = await fixturesUtils.createLikes({ postId: postData._id, likes: [user._id] }, true);
            const res = await request.execute(app)
                .get(`/post/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).eq(201);
        })
    })

    describe('PATCH post update status success', () => {
        it('Should return status 201', async () => {
            const postData = await fixturesUtils.createPost({ ownerId: user._id }, true);
            const bodyUpdateStatus = {
                status: 'public',
                title: 'nuovo titolo update',
                description: 'nuova descrizione update',
                tag: ['tecnologia']
            }
            const res = await request.execute(app)
                .patch(`/user/post/update/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(bodyUpdateStatus)
            expect(res.status).eq(201);
            expect(res.body.status).eq('public');
            expect(res.body.title).eq('nuovo titolo update');
            expect(res.body.description).eq('nuova descrizione update');
            expect(res.body.tag).to.have.lengthOf(1);
            expect(res.body.tag[0].tag).to.equal('tecnologia');
        })
    })

    describe('PATCH post update status fail body status empty or not [public, draft, delete,archived]  ', () => {
        it('Should return status 400 is body is empty', async () => {
            const postData = await fixturesUtils.createPost({ ownerId: user._id }, true);
            const bodyUpdateStatus = {
                status: ''
            }

            const res = await request.execute(app)
                .patch(`/user/post/update/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(bodyUpdateStatus)
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "status" must be one of [public, draft, delete, archived]. "status" is not allowed to be empty');

        })
        it('Should return status 400 for status not [public, draft, delete, archived] ', async () => {
            const postData = await fixturesUtils.createPost({ ownerId: user._id }, true);
            const bodyUpdateStatus = {
                status: 'fakeStatus'
            }
            const res = await request.execute(app)
                .patch(`/user/post/update/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(bodyUpdateStatus)
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "status" must be one of [public, draft, delete, archived]');

        })
    })

    describe('GET tag by postId and userId fail', () => {
        it('Should return 500 if userId not found', async () => {
            const postData = await fixturesUtils.createPost({}, true);
            const res = await request.execute(app)
                .get(`/user/tag/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).eq(500);

        })
        it('Should return 201 if tag not found', async () => {
            const postData = await fixturesUtils.createPost({ ownerId: user._id }, true);
            const res = await request.execute(app)
                .get(`/user/tag/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).eq(201);
        })
        it('Should return 400 if idPost not found', async () => {
            const postData = {}
            const res = await request.execute(app)
                .get(`/user/tag/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).eq(400);
            expect(res.body.message).eq('ValidationError: "id" must only contain hexadecimal characters. "id" length must be 24 characters long');
        })
    })

    describe('GET tag by postId and userId succes', () => {
        it('Should return 201 if tag found', async () => {
            const postData = await fixturesUtils.createPost({ ownerId: user._id }, true);
            const res = await request.execute(app)
                .get(`/user/tag/${postData._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).eq(201);
        })
    })

    describe('DELETE tag from post success', () => {
        it('Should return status 200/201 and remove the tag', async () => {
            const postData = await fixturesUtils.createPost({ ownerId: user._id }, true);
            const idTag = postData.tag[0]._id.toString();
            const postId = postData._id.toString();
            const res = await request.execute(app)
                .patch(`/user/tag/delete/${idTag}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ postId });
            expect(res.status).eq(201)
            expect(res.body.tag).to.have.lengthOf(postData.tag.length - 1);
        });
    });

})