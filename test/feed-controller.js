const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const FeedController = require("../controllers/feed");

describe("Feed Controller", function () {
  before(function (done) {
    mongoose
      .connect(
        "mongodb+srv://Maximilian-Nodejs-MS:Southkorea121@cluster0.llotg6f.mongodb.net/test-messages?retryWrites=true&w=majority",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then((result) => {
        // app.listen(8080);
        // console.log("Connected to Server successfully!");
        const user = new User({
          email: "test@test.com",
          password: "123456",
          name: "Test",
          posts: [],
          _id: "655e881d6e882877785a5cfd",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  //   this.beforeEach(function () {});runs before each Test everytime(not only one time) for example,
  //   to initialize the Test everytime
  //   this.afterEach(function () {}); runs aftre each Test everytime(not only one time) for example,
  //   to cleanup the Test after finishing it everytime

  it("should add a created post to the posts of the creator!", function (done) {
    // sinon.stub(User, "findOne");
    // User.findOne.throws();

    const req = {
      body: {
        title: "Test Post",
        content: "A Test Post",
      },
      file: {
        path: "abc",
      },
      userId: "655e881d6e882877785a5cfd",
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property("posts");
      expect(savedUser.posts).to.have.length(1);
      done();
    });
    // expect(AuthController.login);
    // AuthController.login(req, {}, () => {}).then((result) => {
    //   //   console.log(result);
    //   expect(result).to.be.an("error");
    //   expect(result).to.have.property("statusCode", 500);
    //   done();
    // });

    // User.findOne.restore();
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
