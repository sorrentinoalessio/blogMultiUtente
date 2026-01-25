import { expect } from 'chai';
import postRepository from '../../src/repository/PostRepository.js';
import mongoose from 'mongoose';
import sinon from 'sinon';
import postSchema from '../../src/schemas/postSchema.js';

const sandbox = sinon.createSandbox();
const objectId = mongoose.Types.ObjectId;

describe('Post Repository Unit Tests', () => {

    afterEach(() => {
        sandbox.restore();
    });

    describe('complete()', () => {
        it('Should set post status completed', async () => {
            const userId = new objectId();                                  // Crea un objectId fake per simulare l'id di un utente che possiede l'attività
            sandbox.stub(postSchema, 'findOneAndUpdate').resolves({     // Invece di accedere al db, crea uno stub che restituisce una fake attività con i seguenti campi:
                _id: new objectId(),        // Id dell'attività
                ownerId: userId,            // Id dell'utente a cui appartiene l’attività
                name: 'Test Post',
                description: 'This is a test post',
                status: 'completed',
                toObject: function() { return this; }
            });
            const post = await postRepository.complete(new objectId().toString(), userId.toString()); // Chiama metodo complete() del repository con i suoi parametri
            expect(post.status).to.equal('completed');      // Verifica che lo status restituito sia completed
            expect(post.ownerId.toString()).to.equal(userId.toString());    // Verifica che l’attività restituita appartenga all’utente corretto
        });
        it('Should throw not found exception if post not found', async () => {
            const userId = new objectId();
            sandbox.stub(postSchema, 'findOneAndUpdate').resolves(null);    // Stub di findOneAndUpdate che restituisce null, simulando attività non trovata
            try {
                await postRepository.complete(new objectId().toString(), userId.toString());    // Chiama complete() su un’attività che non esiste per testare la gestione dell’errore
            } catch(err) {
                expect(err.message).to.equal('post not found');     // Verifica che il messaggio dell’errore sia quello previsto
                return;
            }
            expect.fail('Expected exception was not thrown');   // Se arriva qua (il catch non scatta) significa che non è stato lasciato l'errore, quindi TEST FALLITO

        });
    })

    describe('add()', () => {
        it('Should create a new post with correct properties', async () => {
            const userId = new objectId();      // Simula id utente
            const content = {       // Simula un oggetto content con i campi neccessari dell'attività
                name: 'Post name',
                description: 'This is a test post',
                ownerId: userId
            }
            sandbox.stub(postSchema, 'create').resolves({       // Stub che restituisce una fake attività con: id attività e content
                toObject: () => { 
                    return {
                        _id: new objectId(),
                        ...content,
                    }; 
                },
            });
            const post = await postRepository.add(content);     // Chiama il metodo add() del repository con il contenuto dell’attività
            expect(post.name).to.equal(content.name);       // Verifica che il nome restituito sia quello che abbiamo passato
            expect(post.description).to.equal(content.description);     // Verifica che la descrizione restituita sia quella che abbiamo passato
            expect(post.ownerId.toString()).to.equal(userId.toString());        // Verifica che l’attività appartenga all’utente finto confrontando ownerId con userId
        });

        it('Should throw domain exception if database fails on add', async () => {
            const userId = new objectId();
            const content = {
                name: 'Post name',
                description: 'This is a test post',
                ownerId: userId
            }

            sandbox.stub(postSchema, 'create').rejects(new Error('DB error'));     // Simula un errore del database quando viene chiamato create

            try {
                await postRepository.add(content);
            } catch(err) {
                expect(err.message).to.equal(`something went wrong: DB error`);     // Verifica che il messaggio dell’errore sia quello previsto
                expect(err.status).eq(500);
                return;
            }
            expect.fail('Expected exception was not thrown');
        });
    })

    describe('getById()', () => {
        it('Should return the post with the correct post ID and owner ID', async () => {
            const userId = new objectId();
            
            const content = {
                _id: new objectId(),
                ownerId: userId,
                name: 'Test Post',
                description: 'This is a test post',
            }
            sandbox.stub(postSchema, 'findOne').resolves({      // Stub che restituisce una fake attività completa
                toObject: function() { return content; }
            });

            const post = await postRepository.getById(content._id.toString(), userId.toString());    // Chiama getById() passando gli i due ID

            expect(post._id.toString()).to.equal(content._id.toString())     // Controlla che l'ID dell'attività restituita corrisponda a quello finto
            expect(post.ownerId.toString()).to.equal(userId.toString());    // Controlla che l'ID dell'utente proprietario sia corretto
            expect(post.name).to.equal(content.name);
            expect(post.description).to.equal(content.description);
        });

        it('Should throw domain exception if database fails on getPostById', async () => {
            const userId = new objectId();
            const postId = new objectId();

            sandbox.stub(postSchema, 'findOne').rejects(new Error('DB error'));     // Simula un errore del database quando viene chiamato findOne

            try {
                await postRepository.getById(postId.toString(), userId.toString());
            } catch(err) {
                expect(err.message).to.equal(`something went wrong: DB error`);     // Verifica che il messaggio dell’errore sia quello previsto
                expect(err.status).eq(500);
                return;
            }
            expect.fail('Expected exception was not thrown');
        });

        it('Should throw not found exception if post does not exist', async () => {
            const userId = new objectId();
            const postId = new objectId();

            sandbox.stub(postSchema, 'findOne').resolves(null);     // Simula findOne che non trova l'attività (restituisce null)

            try {
                await postRepository.getById(postId.toString(), userId.toString());
            } catch(err) {
                expect(err.message).to.equal(`error: post ${postId.toString()} not found`);
                expect(err.status).eq(404);
                return;
            }
            expect.fail('Expected exception was not thrown');
        });
    })

    describe('update()', () => {
        it('Should update post successfully', async () => {
            const userId = new objectId();
            const postId = new objectId();

            const params = {    
                name: 'New name',
                description: 'This is a new test post',
            }
            sandbox.stub(postSchema, 'findOneAndUpdate').resolves({
                _id: postId,
                ownerId: userId,
                ...params,
                toObject: function() { return this; }
            });
            const post = await postRepository.update(postId.toString(), params, userId.toString());
            expect(post.ownerId.toString()).to.equal(userId.toString());
            expect(post.name).to.equal(params.name);
            expect(post.description).to.equal(params.description);
        });

        it('Should throw domain exception if database fails', async () => {
            const userId = new objectId();
            const postId = new objectId();
            const params = {    
                name: 'New name',
                description: 'This is a new test post',
            }

            sandbox.stub(postSchema, 'findOneAndUpdate').rejects(new Error('DB error'));     // Simula un errore del database quando viene chiamato findOne

            try {
                await postRepository.update(postId.toString(), params, userId.toString());
            } catch(err) {
                console.log(err.message)
                expect(err.message).to.equal(`something went wrong: DB error`);     // Verifica che il messaggio dell’errore sia quello previsto
                return;
            }
           expect.fail('Expected exception was not thrown');
        });

        it('Should return null if post does not exist', async () => {
            const userId = new objectId();
            const postId = new objectId();
            const params = {    
                name: 'New name',
                description: 'This is a new test post',
            }

            sandbox.stub(postSchema, 'findOneAndUpdate').resolves(null);     // Simula findOne che non trova l'attività (restituisce null)

            const post = await postRepository.update(postId.toString(), params, userId.toString());
            expect(post).to.be.null;
        })
    })
})   
