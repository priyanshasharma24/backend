const asyncHandler = require("express-async-handler");
const Goal = require("../model/goalModel");
const User = require("../model/userModel");

// @desc        Get Goals
// @route       Get /api/goals
// @access      Private
const getGoals = asyncHandler(async (req, res) => {
  
  // const goals = await Goal.find(); this will get all goals
  //but we want to get goal of specific Users

  const goals = await Goal.find({user : req.user.id});

  res.status(200).json(goals);
});

// @desc        Set Goal
// @route       Post /api/goals/
// @access      Private
const setGoal = asyncHandler(async (req, res) => {
  // console.log(req.body)
  if (!req.body.text) {
    res.status(400);
    throw new Error("please add a text feild");
  }
  const goal = await Goal.create({
    text: req.body.text,
    user : req.user.id
  });

  res.status(200).json(goal);
});

// @desc        Update Goals
// @route       Put /api/goals/:id
// @access      Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  //check for user
  if(!req.user){
    res.status(401)
    throw new Error('User not found')
  }

  //make sure the logged in user matches the goal user
  if(goal.user.toString() !== req.user.id){
    res.status(401)
    throw new Error('User not authorised')
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});

// @desc        Delete Goals
// @route       Delete /api/goals/:id
// @access      Private
const deleteGoal = asyncHandler(async (req, res) => {

    const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  

  //check for user
  if(!req.user){
    res.status(402)
    throw new Error('User not found')
  }

  //make sure the logged in user matches the goal user
  if(goal.user.toString() !== req.user.id){
    res.status(402)
    throw new Error('User not authorised')
  }

  await Goal.findByIdAndDelete(req.params.id);

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
