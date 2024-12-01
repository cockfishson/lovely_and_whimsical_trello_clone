import { DataTypes, Model } from "sequelize";
import {sequelize} from "../sequalize.js";
import Board from "./boardModel.js";

class List extends Model {
  public list_id!: number;
  public board_id!: number;
  public title!: string;
  public position!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

List.init(
  {
    list_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, 
    },
    board_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Board,
        key: "board_id",
      },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    tableName: "lists",
    timestamps: false,
  }
);

export default List;
