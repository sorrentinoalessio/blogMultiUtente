
import fixturesUtils from "../../fixtures/fixturesUtils.js";
import sinon from "sinon";
import CryptoUtils from "../../../src/utils/CryptoUtils.js";

const sandbox = sinon.createSandbox();
let user;
let token;


    describe.skip('Upload avatar user tests', () => {
    afterEach(async () => {
       // await fixturesUtils.clearDb();
        sandbox.restore();
    });
    beforeEach(async () => {
        await fixturesUtils.clearDb();
        user = await fixturesUtils.createUser({}, true);
        token = CryptoUtils.generateToken(user, 86400);
    });

    it('Should return 200 if avatar  valid', async () => {

        const res = await request.execute(app)
        .post(`/user/profile/avatar/upload`)
            .set('Authorization', `Bearer ${token}`)
            .attach("uploadedFile", path.resolve("test/test.jpg"));
        expect(res.status).eq(200);

    })
})

