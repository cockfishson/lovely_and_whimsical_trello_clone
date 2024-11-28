import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequalize.js";
import List from "./listModel.js";

class TrelloCard extends Model {
  public card_id!: number;
  public list_id!: number;
  public title!: string;
  public description!: string;
  public position!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

TrelloCard.init(
  {
    card_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: List,
        key: "list_id",
      },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "trello_cards",
    timestamps: false,
  }
);

export default TrelloCard;
