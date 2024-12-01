import Board from "./boardModel.js";
import List from "./listModel.js";
import TrelloCard from "./trelloCardModel.js";

Board.hasMany(List, { foreignKey: "board_id", onDelete: "CASCADE" });
List.belongsTo(Board, { foreignKey: "board_id" });

List.hasMany(TrelloCard, { foreignKey: "list_id", onDelete: "CASCADE" });
TrelloCard.belongsTo(List, { foreignKey: "list_id" });

export { Board, List, TrelloCard };
