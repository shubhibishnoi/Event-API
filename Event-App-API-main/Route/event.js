const express = require("express");
const router = express.Router();

const { isLogedIn, auth } = require('../Middleware/auth.js');

const Event = require("../Model/event");

router.post("/createNew", auth, (req, res) => {
  const newEvent = new Event({
    creatorID: req.user._id,
    title: req.body.title,
    des: req.body.des,
    date: req.body.date
  });

  newEvent.save((err) => {
    if(!err){
      res.status(201).json({msg: "Event Created"});
    }
  })
});

router.post("/addInvite", auth, async (req, res) => {
  const eventID = req.body.eventID
  const toBeInvitedUsers = req.body.userList;

  await Event.findOne({_id: eventID}, (err, foundEvent) => {
    if(!err){
      if(foundEvent){
        if(foundEvent.creatorID == req.user._id){
          for(userId of toBeInvitedUsers){
            foundEvent.invites.push(userId);
          }
          foundEvent.save((err) => {
            if(!err){
              res.json({msg: "Invites added"});
            }
          });
        }else{
          res.json({msg: "Your are Not the creator of this event"})
        }
      }else{
        res.json({msg: "No Event Found"})
      }
    }
  }).clone();
});

router.get("/list", auth, async (req, res) => {
  try{
    const eventsList = [];

    await Event.find({creatorID: req.user._id}, (err, foundEvents) => {
      for(eve of foundEvents){
          eventsList.push(eve);
      }
    }).clone();

    await Event.find({}, (err, foundEvents) => {
      for(eve of foundEvents){
        if(eve.invites.includes(req.user.username)){
          console.log(eve.invites, req.user.username);
          eventsList.push(eve);
          console.log("EventList: ", eventsList);
        }
      }
    }).clone();

    res.json({EventsList: eventsList});
  } catch (error) {
    console.error(error);
  }

});

router.get("/:eventId", async (req, res) => {
  const eventId = req.params.eventId;

  await Event.findOne({_id: eventId}, (err, foundEvent) => {
    if(foundEvent){
      res.json({event: foundEvent});
    }else{
      res.json({msg: "No Event found"});
    }
  });
});

module.exports = router
