require("../db/conn");
const Category = require("../model/categorySchema");
const Item = require("../model/itemSchema");
const Clocking = require("../model/ClockingSchema");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// exports.getAllLobbies = factory.getAll(Lobby);
exports.getItemByCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(422).json({ error: "Please provide the id" });
  }

  const items = await Item.find({ categoryId: id });

  res.status(200).json({ message: "success", data: items });
});
// exports.updateLobby = catchAsync(async (req, res, next) => {
//   const { lobbyId } = req.params;
//   const { lobbyName, noOfTables } = req.body;

//   if (!lobbyId || !lobbyName || !noOfTables) {
//     return res
//       .status(422)
//       .json({ error: "Please provide lobbyId, lobbyName, and noOfTables" });
//   }

//   const updatedLobby = await Lobby.findByIdAndUpdate(
//     lobbyId,
//     {
//       lobbyName,
//       noOfTables,
//     },
//     { new: true }
//   );

//   if (!updatedLobby) {
//     return res.status(404).json({ error: "Lobby not found" });
//   }

//   res
//     .status(200)
//     .json({ message: "Lobby updated successfully", lobby: updatedLobby });
// });
// exports.removeLobby = factory.deleteOne(Lobby);
