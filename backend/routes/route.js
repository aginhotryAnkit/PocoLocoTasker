// routes/index.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = express.Router();
const helper = require("../component/helper");
require("dotenv").config();
app.use(express.json());

const Task = require("../models/tasks");

const Schema = mongoose.Schema;
const Joi = require("joi");

// app.use((req, res, next)=>{
//   res.send('middleware working');
//   console.log("middleware working...");
//   next();
// });

const mongoDbConnectionURL = process.env.MONGO_CONNECTION_URL;

mongoose
  .connect(mongoDbConnectionURL, {})
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => console.log(err));

//connect to the mongoDB
// mongoose.connect(function

const sampleTaskSchema = [];

router.get("/", (req, res) => {
  res.render("welcome");
});

router.get("/welcome", (req, res) => {
  res.render("welcome");
});

router.get("/PocoLocoTasker", (req, res) => {
  res.render("PocoLocoTasker");
});

router.get("/api/getAllTasks", async (req, res) => {
  try {
    let allTasks = await Task.find();
    console.log(allTasks);
    res.status(201).send(allTasks);

  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }

});

//create new tasks
router.post("/api/createTask", async (req, res) => {
  const newTask = new Task(req.body);
  try {
    const search = await Task.findOne({
      title: req.body.title
    });

    if (search == null) {
      const savedTask = await newTask.save();
      res.status(201).send({
        success: true,
        message: "Task created successfully",
        data: savedTask ?? [],
      });
    } else {
      res.status(409).send({
        success: false,
        message: "title already exists",
        data: search,
      });
    }


  } catch (err) {
    res.status(400).send(err);
  }

  // const postData = req.body;

  // const schema = Joi.object({
  //   title: Joi.string().required(),
  //   description: Joi.string().required(),
  //   priority: Joi.string().required(),
  //   dueDate: Joi.string().required(),
  //   tags: Joi.array().required(),
  // });

  // const validationResponse = schema.validate(postData);

  // //when the request is not valid return the error
  // if (validationResponse.error != undefined) {
  //   return res.status(400).send({
  //     success: false,
  //     message: validationResponse.error.details[0].message,
  //   });
  // }

  // let search = false;
  // let searchResult = sampleTaskSchema.find((ele) => {
  //   if (ele.title == postData.title) {
  //     search = true;
  //   }
  // });

  // if (search) {
  //   return res.status(400).send({
  //     success: false,
  //     message: "title already exists",
  //     data: searchResult,
  //   });
  // }

  // //push the task
  // sampleTaskSchema.push(postData);

  // //send response to the client
  // res.status(200).send({
  //   success: true,
  //   message: "Task created successfully",
  //   data: postData,
  // });
});


router.delete("/api/done", async function(req, res) {
  try {
    const taskId = req.body.taskId;
    const searchTask = await Task.findById(taskId);
  
    if (searchTask) {
      const updateData = {
        title: searchTask.title, // This seems redundant since you are not changing the title
        description: searchTask.description, // Also redundant, consider what you really need to update
        priority: searchTask.priority, // Redundant if unchanged
        dueDate: searchTask.dueDate, // Redundant if unchanged
        tags: searchTask.tags, // Redundant if unchanged
        done: true // Only updating the 'done' status
      };
  
      const updateResponse = await Task.findByIdAndUpdate(taskId, {$set: updateData}, {new: true}); // 'new: true' to return the updated document
      console.log(updateResponse);
  
      res.status(200).send({
        success: true,
        message: "Task updated successfully",
        data: updateResponse,
      });
  
    } else {
      res.status(404).send({
        success: false,
        message: "Task not found",
        data: null,
      });
    }
  
  } catch (e) {
    console.log(e);
    res.status(400).send({
      success: false,
      message: "Error updating the task",
      error: e
    });
  }
  

})

module.exports = router;
