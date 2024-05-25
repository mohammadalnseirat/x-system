const AuthUser = require("../models/authUser");
// For Using Momment Library
var moment = require("moment");
var jwt = require("jsonwebtoken");

// /home   /done
const user_index_get = (req, res) => {
  const token = req.cookies.jwt;
  var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  AuthUser.findOne({ _id: decoded.id })
    .then((result) => {
      // console.log(result)
      res.render("index", { arrayData: result.customerInfo, moment: moment });
    })
    .catch((error) => {
      console.log(error);
    });
};

// add customer //done
const user_post = (req, res) => {
  // get signup user
  const token = req.cookies.jwt;
  var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //Save data in DataBase Start here
  AuthUser.updateOne(
    { _id: decoded.id },
    {
      $push: {
        customerInfo: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          age: req.body.age,
          country: req.body.country,
          gender: req.body.gender,
          createdAt: new Date(),
        },
      },
    }
  )
    .then(() => {
      res.redirect("/home");
    })
    .catch((error) => {
      console.log(error);
    });
  // Save dat in DataBase End here
};

// delete customer  / done
const user_delete = (req, res) => {
  const token = req.cookies.jwt;
  var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  AuthUser.updateOne(
    { _id: decoded.id },
    { $pull: { customerInfo: { _id: req.params.id } } }
  )
    .then(() => {
      res.redirect("/home");
    })
    .catch((error) => {
      console.log(error);
    });
};

// show details view/:id  /done
const user_view_get = (req, res) => {
  // result ==> object
  AuthUser.findOne({ "customerInfo._id": req.params.id })
    .then((result) => {
      // console.log(result.customerInfo)
      // find method to get details
      const clickedObject = result.customerInfo.find((item) => {
        return item._id == req.params.id;
      });
      //  console.log(clickedObject)
      res.render("user/view", { obj: clickedObject, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

// edit page edit/:id   /done
const user_edit_get = (req, res) => {
  AuthUser.findOne({ "customerInfo._id": req.params.id })
    .then((result) => {
      // find method to get data
      const clickedObject = result.customerInfo.find((item) => {
        return item._id == req.params.id;
      });
      res.render("user/edit", { obj: clickedObject });
    })
    .catch((error) => {
      console.log(error);
    });
};

// update customer   edit/:id    /done
const user_put = (req, res) => {
  AuthUser.updateOne(
    { "customerInfo._id": req.params.id },
    {
      "customerInfo.$.firstName": req.body.firstName,
      "customerInfo.$.lastName": req.body.lastName,
      "customerInfo.$.email": req.body.email,
      "customerInfo.$.phoneNumber": req.body.phoneNumber,
      "customerInfo.$.age": req.body.age,
      "customerInfo.$.country": req.body.country,
      "customerInfo.$.gender": req.body.gender,
      "customerInfo.$.updatedAt": new Date(),
    }
  )
    .then(() => {
      res.redirect("/home");
    })
    .catch((error) => {
      console.log(error);
    });
};

// search page  //done
const user_search_post = (req, res) => {
  const token = req.cookies.jwt;
  var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const searchText = req.body.searchText.trim();
  AuthUser.findOne({ _id: decoded.id })
    .then((result) => {
      // filter array customers
      const searchCustomers = result.customerInfo.filter((item) => {
        return (
          item.firstName.includes(searchText) ||
          item.lastName.includes(searchText)
        );
      });
      res.render("user/search", { arrayData: searchCustomers, moment: moment });
    })
    .catch((error) => {
      console.log(error);
    });
};

// done
const user_add_get = (req, res) => {
  res.render("user/add");
};

module.exports = {
  user_index_get,
  user_edit_get,
  user_view_get,
  user_add_get,
  user_search_post,
  user_delete,
  user_put,
  user_post,
};
